import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { db } from '@/config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Eraser, Pencil, Undo, Download } from 'lucide-react';

export function Whiteboard({ classId }) {
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const containerRef = useRef(null);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);
    const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        try {
            const container = containerRef.current;
            const canvas = new fabric.Canvas(canvasRef.current, {
                isDrawingMode: true,
                width: container.clientWidth,
                height: container.clientHeight,
                backgroundColor: 'white'
            });

            fabricRef.current = canvas;

            // Initialize brush settings
            canvas.freeDrawingBrush.width = brushSize;
            canvas.freeDrawingBrush.color = color;

            const handleResize = () => {
                if (!container || !canvas) return;
                try {
                    const ratio = canvas.getWidth() / canvas.getHeight();
                    const containerWidth = container.clientWidth;
                    const scale = containerWidth / canvas.getWidth();
                    const zoom = canvas.getZoom() * scale;

                    canvas.setDimensions({
                        width: containerWidth,
                        height: containerWidth / ratio
                    });

                    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
                    canvas.renderAll();
                } catch (error) {
                    console.error('Resize error:', error);
                }
            };

            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(container);

            // Load initial state
            let unsubscribe;
            try {
                unsubscribe = onSnapshot(doc(db, 'classes', classId), (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        if (data?.whiteboardState) {
                            canvas.loadFromJSON(data.whiteboardState, () => {
                                canvas.renderAll();
                                setIsLoading(false);
                            });
                        } else {
                            setIsLoading(false);
                        }
                    } else {
                        setIsLoading(false);
                    }
                }, (error) => {
                    console.error('Whiteboard snapshot error:', error);
                    setError('Failed to load whiteboard data');
                    setIsLoading(false);
                });
            } catch (error) {
                console.error('Whiteboard setup error:', error);
                setError('Failed to initialize whiteboard');
                setIsLoading(false);
            }

            const saveCanvasState = async () => {
                if (!canvas || !classId) return;

                try {
                    const canvasState = JSON.stringify(canvas.toJSON(['hasControls', 'borderColor', 'selectable']));
                    await updateDoc(doc(db, 'classes', classId), {
                        whiteboardState: canvasState,
                        lastUpdated: new Date().toISOString()
                    });
                } catch (error) {
                    console.error('Save state error:', error);
                    toast({
                        title: 'Warning',
                        description: 'Failed to save whiteboard state. Changes may not be preserved.',
                        variant: 'destructive',
                        duration: 5000,
                    });
                }
            };

            const debouncedSave = () => {
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                saveTimeoutRef.current = setTimeout(saveCanvasState, 1000);
            };

            canvas.on('object:added', debouncedSave);
            canvas.on('object:modified', debouncedSave);
            canvas.on('object:removed', debouncedSave);

            return () => {
                resizeObserver.disconnect();
                if (unsubscribe) unsubscribe();
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                canvas.dispose();
            };
        } catch (error) {
            console.error('Whiteboard initialization error:', error);
            setError('Failed to initialize whiteboard');
            setIsLoading(false);
        }
    }, [classId, color, brushSize]);

    const handleModeChange = (newMode) => {
        if (!fabricRef.current) return;
        try {
            setMode(newMode);
            const canvas = fabricRef.current;

            if (newMode === 'erase') {
                canvas.freeDrawingBrush = new fabric.EraseBrush(canvas);
                canvas.freeDrawingBrush.width = brushSize * 2;
            } else {
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                canvas.freeDrawingBrush.width = brushSize;
                canvas.freeDrawingBrush.color = color;
            }
            canvas.isDrawingMode = true;
        } catch (error) {
            console.error('Mode change error:', error);
            toast({
                title: 'Error',
                description: 'Failed to change drawing mode',
                variant: 'destructive',
            });
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-background rounded-lg p-4">
                <p className="text-destructive mb-4">{error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-background rounded-lg p-4">
            <div className="flex gap-2 mb-4">
                <Button
                    variant={mode === 'draw' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleModeChange('draw')}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant={mode === 'erase' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleModeChange('erase')}
                >
                    <Eraser className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        try {
                            const canvas = fabricRef.current;
                            if (!canvas) return;
                            const objects = canvas.getObjects();
                            if (objects.length > 0) {
                                canvas.remove(objects[objects.length - 1]);
                                canvas.renderAll();
                            }
                        } catch (error) {
                            console.error('Undo error:', error);
                        }
                    }}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                        if (fabricRef.current && mode === 'draw') {
                            fabricRef.current.freeDrawingBrush.color = e.target.value;
                        }
                    }}
                    className="h-9 w-9 rounded-md border cursor-pointer"
                />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setBrushSize(size);
                        if (fabricRef.current) {
                            fabricRef.current.freeDrawingBrush.width = mode === 'erase' ? size * 2 : size;
                        }
                    }}
                    className="w-32"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        try {
                            const canvas = fabricRef.current;
                            if (!canvas) return;
                            const dataURL = canvas.toDataURL({
                                format: 'png',
                                quality: 1
                            });
                            const link = document.createElement('a');
                            link.download = `whiteboard-${new Date().toISOString()}.png`;
                            link.href = dataURL;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } catch (error) {
                            console.error('Download error:', error);
                            toast({
                                title: 'Error',
                                description: 'Failed to download whiteboard',
                                variant: 'destructive',
                            });
                        }
                    }}
                >
                    <Download className="h-4 w-4" />
                </Button>
            </div>
            <div ref={containerRef} className="relative flex-1 border rounded-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
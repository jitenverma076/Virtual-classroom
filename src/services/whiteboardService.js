import { fabric } from 'fabric';

let canvas;
let socket;
let currentRoom;
let handleResize;

export const initializeWhiteboard = (canvasId, socketInstance, roomId) => {
    try {
        socket = socketInstance;
        currentRoom = roomId;

        // Create canvas instance
        canvas = new fabric.Canvas(canvasId, {
            isDrawingMode: true,
            width: window.innerWidth,
            height: window.innerHeight - 100,
            backgroundColor: '#ffffff'
        });

        // Set initial brush settings
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';

        // Handle window resize
        handleResize = () => {
            canvas.setWidth(window.innerWidth);
            canvas.setHeight(window.innerHeight - 100);
            canvas.renderAll();
        };

        window.addEventListener('resize', handleResize);

        // Handle drawing events
        canvas.on('path:created', (e) => {
            if (socket) {
                socket.emit('drawing', {
                    path: e.path.toJSON(),
                    room: currentRoom
                });
            }
        });

        // Handle received drawings
        if (socket) {
            socket.on('drawing', (data) => {
                if (data.room === currentRoom) {
                    fabric.util.enlivenObjects([data.path], (objects) => {
                        objects.forEach(obj => {
                            canvas.add(obj);
                            canvas.renderAll();
                        });
                    });
                }
            });

            socket.on('clear', (data) => {
                if (data.room === currentRoom) {
                    clearCanvas();
                }
            });
        }

        return canvas;
    } catch (error) {
        console.error('Error initializing whiteboard:', error);
        throw error;
    }
};

export const clearCanvas = () => {
    if (canvas) {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();

        if (socket) {
            socket.emit('clear', { room: currentRoom });
        }
    }
};

export const setDrawingMode = (isDrawing) => {
    if (canvas) {
        canvas.isDrawingMode = isDrawing;
        if (isDrawing) {
            canvas.freeDrawingBrush.width = 2;
            canvas.freeDrawingBrush.color = '#000000';
        }
        canvas.renderAll();
    }
};

export const setDrawingColor = (color) => {
    if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
    }
};

export const setDrawingWidth = (width) => {
    if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(width, 10) || 2;
    }
};

export const disposeCanvas = () => {
    if (canvas) {
        canvas.dispose();
        if (handleResize) {
            window.removeEventListener('resize', handleResize);
        }
    }
};
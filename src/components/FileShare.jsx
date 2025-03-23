import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';

const FileShare = () => {
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0
        }))]);

        // Simulate file upload progress
        acceptedFiles.forEach(file => {
            const interval = setInterval(() => {
                setFiles(prev => prev.map(f => {
                    if (f.file === file) {
                        const newProgress = Math.min(f.progress + 10, 100);
                        if (newProgress === 100) clearInterval(interval);
                        return { ...f, progress: newProgress };
                    }
                    return f;
                }));
            }, 500);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 100 * 1024 * 1024 // 100MB
    });

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="p-6 space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop files here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Maximum file size: 100MB
                </p>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map(({ file, id, progress }) => (
                        <div
                            key={id}
                            className="flex items-center space-x-4 bg-card p-4 rounded-lg"
                        >
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                                    <div
                                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(id)}
                                className="p-1 hover:bg-secondary rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileShare; 
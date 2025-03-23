import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AppContext';
import { db, storage } from '@/config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function Chat({ classId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, 'classes', classId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(newMessages);

            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        });

        return () => unsubscribe();
    }, [classId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() && !fileInputRef.current?.files?.length) return;

        setIsLoading(true);
        try {
            const messageData = {
                text: message.trim(),
                senderId: user.uid,
                senderName: user.displayName || 'Anonymous',
                timestamp: serverTimestamp(),
                attachments: []
            };

            if (fileInputRef.current?.files?.length) {
                setUploading(true);
                const files = Array.from(fileInputRef.current.files);
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `classes/${classId}/chat/${Date.now()}_${file.name}`);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);
                    return {
                        url: downloadURL,
                        name: file.name,
                        type: file.type,
                        size: file.size
                    };
                });

                messageData.attachments = await Promise.all(uploadPromises);
                setUploading(false);
            }

            await addDoc(collection(db, 'classes', classId, 'messages'), messageData);
            setMessage('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const renderAttachment = (attachment) => {
        const isImage = attachment.type.startsWith('image/');

        if (isImage) {
            return (
                <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={attachment.url} alt={attachment.name} className="max-w-xs rounded-lg" />
                </a>
            );
        }

        return (
            <a href={attachment.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80">
                <span className="text-sm">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">({formatFileSize(attachment.size)})</span>
            </a>
        );
    };

    return (
        <div className="flex flex-col h-[600px] bg-background rounded-lg">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] ${msg.senderId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-4 py-2`}>
                            <div className="text-xs opacity-70 mb-1">{msg.senderName}</div>
                            {msg.text && <p className="break-words">{msg.text}</p>}
                            {msg.attachments?.map((attachment, index) => (
                                <div key={index} className="mt-2">
                                    {renderAttachment(attachment)}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {msg.timestamp?.toDate().toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={() => { }}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFileSelect}
                    disabled={isLoading || uploading}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background rounded-md px-3 py-2 text-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isLoading || uploading}
                />
                <Button type="submit" size="icon" disabled={isLoading || uploading || (!message.trim() && !fileInputRef.current?.files?.length)}>
                    {(isLoading || uploading) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </form>
        </div>
    );
}
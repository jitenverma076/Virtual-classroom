import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AppContext';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chat } from '@/components/classroom/Chat';
import { Whiteboard } from '@/components/classroom/Whiteboard';
import { VideoChat } from '@/components/classroom/VideoChat';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function ClassroomPage() {
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id: classId } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const classRef = doc(db, 'classes', classId);
                const classSnap = await getDoc(classRef);

                if (!classSnap.exists()) {
                    toast.error('Class not found');
                    return;
                }

                const data = classSnap.data();
                if (!data.members.includes(user.uid)) {
                    toast.error('You do not have access to this class');
                    return;
                }

                setClassData({ id: classSnap.id, ...data });
            } catch (error) {
                toast.error('Failed to load class data');
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [classId, user.uid]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
                    <p className="text-muted-foreground">
                        The class you're looking for doesn't exist or you don't have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
                <p className="text-muted-foreground">Class Code: {classData.code}</p>
            </div>

            <Tabs defaultValue="video" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="video">Video Chat</TabsTrigger>
                    <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="border rounded-lg p-4">
                    <VideoChat classId={classId} className="h-[600px]" />
                </TabsContent>

                <TabsContent value="whiteboard" className="border rounded-lg p-4">
                    <Whiteboard classId={classId} className="h-[600px]" />
                </TabsContent>

                <TabsContent value="chat" className="border rounded-lg p-4">
                    <Chat classId={classId} className="h-[600px]" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
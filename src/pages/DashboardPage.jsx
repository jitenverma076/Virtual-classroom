import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AppContext';
import { db } from '@/config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ClassDialog } from '@/components/classroom/ClassDialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const classesRef = collection(db, 'classes');
        const q = query(classesRef, where('members', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const classesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClasses(classesData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching classes:', error);
            toast.error('Failed to load classes');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.uid]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Classes</h1>
                <div className="flex gap-4">
                    <ClassDialog mode="join" />
                    <ClassDialog mode="create" />
                </div>
            </div>

            {classes.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">No Classes Yet</h2>
                    <p className="text-muted-foreground mb-4">
                        Join a class using a class code or create your own class to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            className="border rounded-lg p-6 bg-card hover:bg-card/80 cursor-pointer transition-colors"
                            onClick={() => navigate(`/classroom/${classItem.id}`)}
                        >
                            <h3 className="text-lg font-semibold mb-2">{classItem.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Class Code: {classItem.code}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                Created: {new Date(classItem.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
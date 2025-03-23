import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { db } from '@/config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

export function ClassDialog({ mode = 'join' }) { // mode can be 'join' or 'create'
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'join') {
                // Find the class with the given code
                const classesRef = collection(db, 'classes');
                const q = query(classesRef, where('code', '==', input.trim()));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    throw new Error('Class not found. Please check the code and try again.');
                }

                const classDoc = querySnapshot.docs[0];
                const classData = classDoc.data();

                // Check if user is already a member
                if (classData.members?.includes(user.uid)) {
                    throw new Error('You are already a member of this class.');
                }

                // Add user to class members
                await updateDoc(doc(db, 'classes', classDoc.id), {
                    members: arrayUnion(user.uid)
                });

                toast.success('Successfully joined the class!');
            } else {
                // Create new class
                const classData = {
                    name: input.trim(),
                    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    createdBy: user.uid,
                    members: [user.uid],
                    createdAt: new Date().toISOString()
                };

                await addDoc(collection(db, 'classes'), classData);
                toast.success('Class created successfully!');
            }

            setInput('');
            setIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to process your request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={mode === 'join' ? 'outline' : 'default'}>
                    {mode === 'join' ? 'Join Class' : 'Create Class'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'join' ? 'Join a Class' : 'Create a New Class'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={mode === 'join' ? 'classCode' : 'className'}>
                            {mode === 'join' ? 'Class Code' : 'Class Name'}
                        </Label>
                        <Input
                            id={mode === 'join' ? 'classCode' : 'className'}
                            placeholder={mode === 'join' ? 'Enter class code' : 'Enter class name'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={mode === 'join' ? 6 : 3}
                            maxLength={mode === 'join' ? 6 : 50}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === 'join' ? 'Joining...' : 'Creating...'}
                            </>
                        ) : (
                            mode === 'join' ? 'Join Class' : 'Create Class'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClass, joinClass } from '@/services/classService';
import { useAuth } from '@/contexts/AppContext';

export function ClassCards({ classes, onClassCreated, onClassJoined }) {
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [className, setClassName] = useState('');
    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setError('');
        setIsCreating(true);

        try {
            const classData = {
                name: className,
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                description: '',
            };

            const classId = await createClass(user.uid, classData);
            onClassCreated();
            setClassName('');
            setIsCreating(false);
        } catch (error) {
            setError(error.message);
            setIsCreating(false);
        }
    };

    const handleJoinClass = async (e) => {
        e.preventDefault();
        setError('');
        setIsJoining(true);

        try {
            await joinClass(user.uid, classCode.toUpperCase());
            onClassJoined();
            setClassCode('');
            setIsJoining(false);
        } catch (error) {
            setError(error.message);
            setIsJoining(false);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {classes.map((classItem) => (
                <div
                    key={classItem.id}
                    className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow"
                >
                    <h3 className="text-lg font-semibold">{classItem.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">Code: {classItem.code}</p>
                </div>
            ))}

            <div className="rounded-lg border border-dashed p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Create or Join Class</h3>
                    </div>
                    <div className="grid gap-4 w-full max-w-sm">
                        <form onSubmit={handleCreateClass} className="space-y-2">
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                required
                            />
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className="w-full"
                            >
                                {isCreating ? 'Creating...' : 'Create Class'}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleJoinClass} className="space-y-2">
                            <input
                                type="text"
                                placeholder="Class Code"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                required
                            />
                            <Button
                                type="submit"
                                disabled={isJoining}
                                variant="outline"
                                className="w-full"
                            >
                                {isJoining ? 'Joining...' : 'Join Class'}
                            </Button>
                        </form>
                    </div>
                    {error && (
                        <p className="text-sm text-destructive mt-2">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
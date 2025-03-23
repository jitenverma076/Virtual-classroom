import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AppContext';
import { Bell } from 'lucide-react';

export function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(newNotifications);
        }, (error) => {
            console.error('Error fetching notifications:', error);
        });

        return () => unsubscribe();
    }, [user]);

    if (notifications.length === 0) {
        return (
            <div className="rounded-lg border p-6">
                <div className="flex items-center space-x-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    No new notifications
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border p-6">
            <div className="flex items-center space-x-4 mb-4">
                <Bell className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                                {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationPanel;
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export const fetchUserData = async (userId) => {
    try {
        const classesQuery = query(
            collection(db, 'classes'),
            where('participants', 'array-contains', userId)
        );
        const classesSnapshot = await getDocs(classesQuery);
        const classes = classesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(5)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notifications = notificationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }));

        return { classes, notifications };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const formatDate = (date) => {
    if (!date) return '';

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Date(date).toLocaleDateString(undefined, options);
};

export const generateAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
};

export const getFileIcon = (fileType) => {
    if (!fileType) return 'document';

    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'document';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'spreadsheet';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'presentation';

    return 'document';
};

export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const searchUsers = async (searchTerm) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('displayName', '>=', searchTerm),
            where('displayName', '<=', searchTerm + '\uf8ff'),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

export const getRecentActivity = async (userId) => {
    try {
        const activityRef = collection(db, 'activity');
        const q = query(
            activityRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting recent activity:', error);
        throw error;
    }
};
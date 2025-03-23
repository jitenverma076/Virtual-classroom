import { db, storage } from '@/config/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const sendMessage = async (classId, userId, message, attachments = []) => {
    try {
        const messageData = {
            classId,
            userId,
            message,
            attachments: [],
            createdAt: serverTimestamp()
        };

        if (attachments.length > 0) {
            const uploadPromises = attachments.map(async (file) => {
                const storageRef = ref(storage, `chat-attachments/${classId}/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            });

            messageData.attachments = await Promise.all(uploadPromises);
        }

        await addDoc(collection(db, 'messages'), messageData);
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const subscribeToMessages = (classId, callback) => {
    const messagesRef = collection(db, 'messages');
    const q = query(
        messagesRef,
        where('classId', '==', classId),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));
        callback(messages);
    }, (error) => {
        console.error('Error subscribing to messages:', error);
    });
};
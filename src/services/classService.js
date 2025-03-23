import { db } from '@/config/firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export const createClass = async (userId, classData) => {
    try {
        const classRef = doc(collection(db, 'classes'));
        await setDoc(classRef, {
            ...classData,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            students: [],
            teachers: [userId]
        });

        // Update user's classes array
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            classes: arrayUnion(classRef.id)
        });

        return classRef.id;
    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
};

export const joinClass = async (userId, classCode) => {
    try {
        const classesRef = collection(db, 'classes');
        const q = query(classesRef, where('code', '==', classCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('Class not found');
        }

        const classDoc = querySnapshot.docs[0];
        const classData = classDoc.data();

        if (classData.students.includes(userId)) {
            throw new Error('Already enrolled in this class');
        }

        // Update class with new student
        await updateDoc(doc(db, 'classes', classDoc.id), {
            students: arrayUnion(userId)
        });

        // Update user's classes array
        await updateDoc(doc(db, 'users', userId), {
            classes: arrayUnion(classDoc.id)
        });

        return classDoc.id;
    } catch (error) {
        console.error('Error joining class:', error);
        throw error;
    }
};

export const getUserClasses = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();
        const classIds = userData.classes || [];

        const classes = await Promise.all(
            classIds.map(async (classId) => {
                const classDoc = await getDoc(doc(db, 'classes', classId));
                return { id: classDoc.id, ...classDoc.data() };
            })
        );

        return classes;
    } catch (error) {
        console.error('Error getting user classes:', error);
        throw error;
    }
}; 
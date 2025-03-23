const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

export function validateEnv() {
    const missingVars = requiredEnvVars.filter(
        varName => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please check your .env file and make sure all required variables are set.'
        );
    }

    // Validate URL format
    if (import.meta.env.VITE_APP_URL && !isValidUrl(import.meta.env.VITE_APP_URL)) {
        throw new Error('VITE_APP_URL must be a valid URL');
    }

    // Validate email format
    if (import.meta.env.VITE_SUPPORT_EMAIL && !isValidEmail(import.meta.env.VITE_SUPPORT_EMAIL)) {
        throw new Error('VITE_SUPPORT_EMAIL must be a valid email address');
    }

    // Validate numeric values
    const maxFileSize = parseInt(import.meta.env.VITE_MAX_FILE_SIZE);
    if (isNaN(maxFileSize) || maxFileSize <= 0) {
        throw new Error('VITE_MAX_FILE_SIZE must be a positive number');
    }

    const maxUploadCount = parseInt(import.meta.env.VITE_MAX_UPLOAD_COUNT);
    if (isNaN(maxUploadCount) || maxUploadCount <= 0) {
        throw new Error('VITE_MAX_UPLOAD_COUNT must be a positive number');
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Constants derived from environment variables
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760;
export const MAX_UPLOAD_COUNT = parseInt(import.meta.env.VITE_MAX_UPLOAD_COUNT) || 5;
export const ENABLE_VIDEO_CHAT = import.meta.env.VITE_ENABLE_VIDEO_CHAT !== 'false';
export const ENABLE_WHITEBOARD = import.meta.env.VITE_ENABLE_WHITEBOARD !== 'false'; 
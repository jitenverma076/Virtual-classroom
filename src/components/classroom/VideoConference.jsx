import React, { useEffect, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoConference = ({ roomId, displayName }) => {
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check if running in a supported browser
        const isSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
        if (!isSupported) {
            setError('Your browser does not support video conferencing. Please use a modern browser.');
            return;
        }

        // Check for camera and microphone permissions
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(() => {
                setIsInitialized(true);
            })
            .catch((err) => {
                console.error('Media permissions error:', err);
                setError('Please allow access to your camera and microphone to use video chat.');
            });
    }, []);

    const handleAPIReady = (apiObj) => {
        try {
            console.log('Jitsi Meet API initialized');

            apiObj.executeCommand('displayName', displayName);

            apiObj.addEventListener('videoConferenceJoined', () => {
                console.log('Local user joined');
            });

            apiObj.addEventListener('participantJoined', (participant) => {
                console.log('Participant joined:', participant);
            });

            apiObj.addEventListener('connectionEstablished', () => {
                console.log('Connection established');
            });

            apiObj.addEventListener('connectionFailed', () => {
                setError('Failed to connect to the video conference. Please check your internet connection.');
            });
        } catch (err) {
            setError('Failed to initialize video chat');
            console.error('Jitsi API error:', err);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-destructive bg-destructive/10 p-4 rounded-md max-w-md text-center">
                    <p className="font-medium mb-2">Error</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                    Initializing video chat...
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomId || 'virtual-classroom'}
                configOverwrite={{
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableDeepLinking: true,
                    disableSimulcast: false,
                    resolution: 720,
                    constraints: {
                        video: {
                            height: {
                                ideal: 720,
                                max: 720,
                                min: 180
                            }
                        }
                    }
                }}
                interfaceConfigOverwrite={{
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'participants-pane', 'feedback',
                        'stats', 'shortcuts', 'tileview', 'select-background', 'download',
                        'help', 'mute-everyone', 'security'
                    ],
                    SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_BRAND_WATERMARK: false,
                    NATIVE_APP_NAME: 'Virtual Classroom',
                    PROVIDER_NAME: 'Virtual Classroom'
                }}
                onApiReady={handleAPIReady}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                }}
            />
        </div>
    );
};

export default VideoConference;
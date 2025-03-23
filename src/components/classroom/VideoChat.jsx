import React, { useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuth } from '@/contexts/AppContext';

export function VideoChat({ classId }) {
    const { user } = useAuth();

    return (
        <div className="w-full h-[600px] relative">
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={`virtual-classroom-${classId}`}
                configOverwrite={{
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableDeepLinking: true
                }}
                interfaceConfigOverwrite={{
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop',
                        'fullscreen', 'fodeviceselection', 'hangup', 'chat',
                        'raisehand', 'videoquality', 'filmstrip', 'participants-pane'
                    ]
                }}
                userInfo={{
                    displayName: user?.displayName || 'Anonymous',
                    email: user?.email
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                    iframeRef.style.position = 'absolute';
                    iframeRef.style.top = '0';
                    iframeRef.style.left = '0';
                }}
            />
        </div>
    );
} 
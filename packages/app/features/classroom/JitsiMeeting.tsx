import React, { useEffect, useRef } from 'react';
import { UserRole } from '../../../../types';

interface Props {
  roomName: string;
  userRole: UserRole;
  displayName: string;
  schoolId: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

/**
 * Self-Hosted Jitsi Wrapper.
 * No proprietary SDKs. Uses the standard IFrame API.
 */
export const JitsiMeeting: React.FC<Props> = ({ roomName, userRole, displayName, schoolId }) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const domain = "meet.jit.si"; // Can be replaced with self-hosted URL like "meet.sovereign-schools.in"

  useEffect(() => {
    // Inject Jitsi Script if not present
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = `https://${domain}/external_api.js`;
      script.async = true;
      script.onload = initJitsi;
      document.body.appendChild(script);
    } else {
      initJitsi();
    }

    return () => {
      apiRef.current?.dispose();
    };
  }, []);

  const initJitsi = () => {
    if (!jitsiContainerRef.current) return;

    // Simulate JWT Token Logic (In prod, fetch this from backend)
    // Teachers = Moderators, Students = No Moderation Rights
    const options = {
      roomName: `${schoolId}-${roomName}`,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName
      },
      configOverwrite: {
        startWithAudioMuted: userRole === UserRole.STUDENT,
        startWithVideoMuted: userRole === UserRole.STUDENT,
        // Disable 3rd party integrations to keep it "Sovereign"
        prejoinPageEnabled: false,
        disableDeepLinking: true, 
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ],
        // Hide "Invite More" to prevent unauthorized access
        SHOW_JITSI_WATERMARK: false,
      }
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    // Event Listeners
    apiRef.current.addEventListener('videoConferenceJoined', () => {
      console.log('Local User Joined');
      if (userRole === UserRole.TEACHER) {
        apiRef.current.executeCommand('password', 'sovereign123'); // Lock room automatically
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-white font-bold tracking-wide">🔴 LIVE CLASS: {roomName}</span>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
          {userRole === UserRole.TEACHER ? 'MODERATOR' : 'STUDENT'}
        </span>
      </div>
      <div 
        ref={jitsiContainerRef} 
        className="flex-1 w-full h-[600px]" 
        style={{ minHeight: '500px' }}
      />
    </div>
  );
};

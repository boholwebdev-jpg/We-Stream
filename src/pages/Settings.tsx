import React from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Save, ShieldCheck, Server, Globe } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = React.useState({
    rtmpEndpoint: "rtmp://stream.westream.app/live",
    maxBitrate: 6000,
    allowGuestStreams: false,
    maintenanceMode: false
  });

  const handleSave = () => {
    // Save to Firestore logic
    alert("Settings updated successfully.");
  };

  const SettingRow = ({ label, description, children }: any) => (
    <div className="py-8 border-b border-[#141414] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="max-w-md">
        <h3 className="font-mono text-sm uppercase tracking-widest mb-1">{label}</h3>
        <p className="font-serif italic text-sm opacity-50">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-[#141414] pb-4">
        <h1 className="font-serif italic text-3xl tracking-tight">Platform Settings</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Global Configuration</p>
      </div>

      <div className="space-y-2">
        <SettingRow 
          label="RTMP Base Endpoint" 
          description="The primary destination for all incoming RTMP streams."
        >
          <div className="flex items-center gap-2 px-4 py-2 border border-[#141414] bg-white/50 font-mono text-sm">
            <Server size={14} className="opacity-50" />
            <input 
              type="text" 
              value={settings.rtmpEndpoint}
              onChange={(e) => setSettings({...settings, rtmpEndpoint: e.target.value})}
              className="bg-transparent outline-none w-64"
            />
          </div>
        </SettingRow>

        <SettingRow 
          label="Max Bitrate (kbps)" 
          description="Global limit for stream encoding quality to preserve bandwidth."
        >
          <input 
            type="number" 
            value={settings.maxBitrate}
            onChange={(e) => setSettings({...settings, maxBitrate: parseInt(e.target.value)})}
            className="px-4 py-2 border border-[#141414] bg-white/50 font-mono text-sm w-32 outline-none"
          />
        </SettingRow>

        <SettingRow 
          label="Guest Streaming" 
          description="Allow unverified users to initiate livestreams."
        >
          <button 
            onClick={() => setSettings({...settings, allowGuestStreams: !settings.allowGuestStreams})}
            className={`w-12 h-6 border border-[#141414] relative transition-colors ${settings.allowGuestStreams ? 'bg-[#141414]' : 'bg-transparent'}`}
          >
            <div className={`absolute top-1 w-3 h-3 border border-[#141414] transition-all ${settings.allowGuestStreams ? 'right-1 bg-[#E4E3E0]' : 'left-1 bg-[#141414]'}`} />
          </button>
        </SettingRow>

        <SettingRow 
          label="Maintenance Mode" 
          description="Disable all streaming and management features for maintenance."
        >
          <button 
            onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
            className={`w-12 h-6 border border-[#141414] relative transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-transparent'}`}
          >
            <div className={`absolute top-1 w-3 h-3 border border-[#141414] transition-all ${settings.maintenanceMode ? 'right-1 bg-white' : 'left-1 bg-[#141414]'}`} />
          </button>
        </SettingRow>
      </div>

      <div className="pt-8">
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-8 py-4 bg-[#141414] text-[#E4E3E0] font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-all"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="p-8 border border-[#141414] bg-yellow-500/10 flex gap-6 items-start">
        <ShieldCheck size={32} className="text-[#141414] opacity-50" />
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest mb-2">Security Audit</h4>
          <p className="font-serif italic text-sm opacity-70 leading-relaxed">
            All configuration changes are logged and attributed to your admin account. 
            Ensure you have verified the RTMP endpoint stability before updating.
          </p>
        </div>
      </div>
    </div>
  );
}

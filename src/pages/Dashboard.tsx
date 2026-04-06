import React from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, limit, orderBy } from "firebase/firestore";
import { Users, Radio, Activity, Clock } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = React.useState({
    activeStreams: 0,
    totalUsers: 0,
    totalViewers: 0,
    avgDuration: "0h"
  });

  const [recentStreams, setRecentStreams] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Real-time listener for streams
    const q = query(collection(db, "streams"), orderBy("startTime", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const streams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentStreams(streams);
      
      const active = snapshot.docs.filter(d => d.data().status === "live").length;
      const viewers = snapshot.docs.reduce((acc, d) => acc + (d.data().viewerCount || 0), 0);
      
      setStats(prev => ({
        ...prev,
        activeStreams: active,
        totalViewers: viewers
      }));
    });

    return () => unsubscribe();
  }, []);

  const StatCard = ({ title, value, icon: Icon, subtext }: any) => (
    <div className="border border-[#141414] p-6 bg-white/50 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all duration-300 group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <span className="font-serif italic text-xs opacity-50 uppercase tracking-widest group-hover:opacity-100">{title}</span>
        <Icon size={18} className="opacity-30 group-hover:opacity-100" />
      </div>
      <div className="font-mono text-4xl tracking-tighter mb-1">{value}</div>
      <div className="font-mono text-[10px] opacity-40 group-hover:opacity-70 uppercase tracking-widest">{subtext}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Streams" value={stats.activeStreams} icon={Radio} subtext="Live Now" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} subtext="Registered" />
        <StatCard title="Total Viewers" value={stats.totalViewers} icon={Activity} subtext="Across all platforms" />
        <StatCard title="Avg Duration" value={stats.avgDuration} icon={Clock} subtext="Per session" />
      </div>

      <div className="border border-[#141414]">
        <div className="p-4 border-b border-[#141414] bg-[#141414] text-[#E4E3E0] flex justify-between items-center">
          <h2 className="font-serif italic text-lg tracking-tight">Recent Activity</h2>
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">Live Feed</span>
        </div>
        <div className="divide-y divide-[#141414]">
          {recentStreams.length > 0 ? recentStreams.map((stream) => (
            <div key={stream.id} className="p-4 flex items-center justify-between hover:bg-[#141414]/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  stream.status === "live" ? "bg-red-500 animate-pulse" : "bg-gray-400"
                )} />
                <div>
                  <div className="font-mono text-sm tracking-tight">{stream.title || "Untitled Stream"}</div>
                  <div className="font-mono text-[10px] opacity-50 uppercase tracking-widest">
                    {stream.platform} • {new Date(stream.startTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="font-mono text-sm">{stream.viewerCount || 0}</div>
                  <div className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Viewers</div>
                </div>
                <button className="px-3 py-1 border border-[#141414] font-mono text-[10px] uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all">
                  Monitor
                </button>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center opacity-30 font-serif italic">
              No recent activity detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

import React from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Trash2, ExternalLink, ShieldAlert } from "lucide-react";

export default function Streams() {
  const [streams, setStreams] = React.useState<any[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, "streams"), orderBy("startTime", "desc"));
    return onSnapshot(q, (snapshot) => {
      setStreams(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this stream record?")) {
      await deleteDoc(doc(db, "streams", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-[#141414] pb-4">
        <div>
          <h1 className="font-serif italic text-3xl tracking-tight">Streams Management</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Active and Past Sessions</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 border border-[#141414] font-mono text-[10px] uppercase tracking-widest">
            Total: {streams.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {streams.map((stream) => (
          <div key={stream.id} className="border border-[#141414] p-6 bg-white/50 flex items-center justify-between group hover:bg-[#141414]/5 transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-3 h-3 rounded-full ${stream.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-mono text-lg tracking-tight">{stream.title || "Untitled Stream"}</h3>
                <div className="flex gap-4 mt-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">ID: {stream.id.slice(0, 8)}...</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">User: {stream.userId.slice(0, 8)}...</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">Platform: {stream.platform}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right mr-8">
                <div className="font-mono text-sm">{stream.viewerCount || 0}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Viewers</div>
              </div>
              <button 
                onClick={() => handleDelete(stream.id)}
                className="p-2 border border-transparent hover:border-red-500 hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
              <button className="p-2 border border-transparent hover:border-[#141414] transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}

        {streams.length === 0 && (
          <div className="p-24 border border-dashed border-[#141414]/20 flex flex-col items-center justify-center text-[#141414]/30">
            <ShieldAlert size={48} strokeWidth={1} className="mb-4" />
            <p className="font-serif italic text-xl">No stream records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

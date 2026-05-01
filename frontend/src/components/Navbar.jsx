import { Activity } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-slate-800">MonitoringSite</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Radar } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/monitors", label: "Monitors", icon: Radar },
  { to: "/checks", label: "Checks", icon: ListChecks },
];

function Sidebar() {
  return (
    <aside className="w-full border-r border-slate-200 bg-white md:w-64">
      <div className="p-4">
        <Link to="/" className="text-lg font-bold text-slate-800">
          MonitoringSite
        </Link>
      </div>
      <nav className="space-y-1 px-3 pb-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

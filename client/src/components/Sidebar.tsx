import { Link, useLocation, useNavigate  } from "react-router-dom";

import {
  LayoutDashboard,
  Brain,
  CalendarCheck,
  Sparkles,
  User,
  History,
  LogOut,
} from "lucide-react";
import Logo from '../assets/HabitIQ.png'


const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Habits", path: "/habits", icon: CalendarCheck },
  { name: "AI Insights", path: "/insights", icon: Brain },
  { name: "Planner", path: "/planner", icon: Sparkles },
  { name: "Profile", path: "/profile", icon: User },
  { name: "AI Plans", path: "/plans", icon: History },
];

export default function Sidebar() {


const navigate = useNavigate();

function logout() {
  localStorage.removeItem("habitiq_token");
  localStorage.removeItem("habitiq_user");
  navigate("/login");
}


  const location = useLocation();

  return (
    <aside className="w-72 min-h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 hidden lg:block">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-11 w-11 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
           <img 
    src={Logo} 
    alt="HabitIQ Logo" 
    className="h-full w-full object-cover"
  />
        </div>
        <div>
          <h1 className="text-xl font-bold">HabitIQ</h1>
          <p className="text-xs text-gray-400">AI Habit Tracker</p>
        </div>
      </div>

      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                active
                  ? "bg-cyan-400 text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <button
  onClick={logout}
  className="mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl text-red-300 hover:bg-red-500/10 w-full"
>
  <LogOut size={20} />
  Logout
</button>
    </aside>
  );
}
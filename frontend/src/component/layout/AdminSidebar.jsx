import {
    LayoutDashboard,
    BookOpen,
    BookMarked,
    CircleDollarSign,
    CalendarCheck,
    Tags,
    CreditCard,
    Users,
    WalletCards,
    LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/auth";

const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Books", path: "/admin/books", icon: BookOpen },
    { label: "Loans", path: "/admin/loans", icon: BookMarked },
    { label: "Fines", path: "/admin/fines", icon: CircleDollarSign },
    { label: "Reservations", path: "/admin/reservations", icon: CalendarCheck },
    { label: "Genres", path: "/admin/genres", icon: Tags },
    { label: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Payments", path: "/admin/payments", icon: WalletCards },
];

function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login", { replace: true });
    };

    return (
        <aside className="admin-sidebar w-[225px] h-screen shrink-0 bg-[#111a2d] text-white flex flex-col">
            <div className="h-[86px] px-5 flex items-center border-b border-white/5 shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#f45b78] flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <BookOpen size={22} />
                </div>
                <div className="ml-3">
                    <h1 className="text-[18px] font-semibold tracking-wide">Admin Panel</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Control Center</p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-5 overflow-y-auto admin-sidebar-scroll">
                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Management
                </p>

                <div className="space-y-1.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3.5 rounded-lg text-[14px] font-medium transition ${
                                        isActive
                                            ? "bg-[#4b1828] text-white shadow-sm ring-1 ring-[#7b2940]/40"
                                            : "text-gray-300 hover:bg-[#1b2741] hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={20} strokeWidth={1.9} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="px-3 py-4 border-t border-white/5 shrink-0">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-[14px] font-medium text-gray-200 bg-[#4b1828] hover:bg-[#5b1e31] hover:text-white transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;

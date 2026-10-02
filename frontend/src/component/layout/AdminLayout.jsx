import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Search,
    Bell,
    ChevronDown,
    User,
    X,
    ShieldCheck,
    Mail,
    Hash,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getCurrentUser } from "../../utils/auth";

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");

    const pageTitles = {
        "/admin/dashboard": "Dashboard",
        "/admin/books": "Books",
        "/admin/loans": "Book Loans",
        "/admin/fines": "Fines",
        "/admin/reservations": "Reservations",
        "/admin/genres": "Genres",
        "/admin/subscriptions": "Subscriptions",
        "/admin/users": "Users",
        "/admin/payments": "Payments",
    };

    const currentTitle = pageTitles[location.pathname] || "Admin Dashboard";

    const getAdminName = () =>
        currentUser?.fullName || currentUser?.userName || currentUser?.email || "Administrator";

    const getAdminInitial = () => getAdminName().charAt(0).toUpperCase();

    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/admin/books${searchText.trim() ? `?search=${encodeURIComponent(searchText.trim())}` : ""}`);
        setShowSearch(false);
    };

    const toggleProfile = () => {
        setShowProfile((value) => !value);
        setShowNotifications(false);
    };

    const toggleNotifications = () => {
        setShowNotifications((value) => !value);
        setShowProfile(false);
    };

    return (
        <div className="admin-shell flex h-screen overflow-hidden bg-[#f7f8fc]">
            <AdminSidebar />

            <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
                <header className="admin-header h-[68px] shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative z-50">
                    <div>
                        <h2 className="text-[16px] font-semibold text-gray-900">
                            {currentTitle}
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            BookNest Administration
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSearch((value) => !value);
                                    setShowNotifications(false);
                                    setShowProfile(false);
                                }}
                                className="admin-header-icon"
                                title="Search books"
                            >
                                <Search size={20} />
                            </button>

                            {showSearch && (
                                <form
                                    onSubmit={handleSearch}
                                    className="absolute right-0 top-12 z-[70] w-[320px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <Search size={18} className="text-gray-400 shrink-0" />
                                        <input
                                            autoFocus
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            placeholder="Search books..."
                                            className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSearch(false)}
                                            className="text-gray-400 hover:text-gray-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <p className="mt-2 text-[11px] text-gray-400">
                                        Press Enter to open Book Management.
                                    </p>
                                </form>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                className="admin-header-icon relative"
                                title="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-12 z-[70] w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                    <p className="mt-2 text-xs text-gray-500">No new notifications.</p>
                                </div>
                            )}
                        </div>

                        {/* Admin account selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={toggleProfile}
                                className="h-10 px-4 border border-gray-200 rounded-lg bg-white flex items-center gap-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                                title="Admin account"
                            >
                                <span>Admin</span>
                                <ChevronDown size={16} className={showProfile ? "rotate-180 transition" : "transition"} />
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 top-12 z-[70] w-80 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                                    <div className="bg-[#111a2d] px-5 py-5 text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#f45b78] flex items-center justify-center text-lg font-bold">
                                                {getAdminInitial()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-base truncate">{getAdminName()}</p>
                                                <p className="text-xs text-white/60">Administrator</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail size={17} className="text-gray-400" />
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-gray-400">Email</p>
                                                <p className="text-sm text-gray-800 truncate">{currentUser?.email || "Not available"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Hash size={17} className="text-gray-400" />
                                            <div>
                                                <p className="text-[11px] text-gray-400">User ID</p>
                                                <p className="text-sm text-gray-800">{currentUser?.id ?? "Not available"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <ShieldCheck size={17} className="text-gray-400" />
                                            <div>
                                                <p className="text-[11px] text-gray-400">Role</p>
                                                <p className="text-sm font-semibold text-gray-800">{currentUser?.role || "ROLE_ADMIN"}</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowProfile(false);
                                                navigate("/admin/users");
                                            }}
                                            className="w-full h-10 mt-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Open User Management
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Admin avatar */}
                        <button
                            type="button"
                            onClick={toggleProfile}
                            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition font-semibold text-sm"
                            title="Admin profile"
                        >
                            {getAdminInitial() || <User size={19} />}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

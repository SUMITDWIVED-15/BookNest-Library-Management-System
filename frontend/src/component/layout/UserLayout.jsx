import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./sidebar";

import {
    Search,
    Bell,
    ChevronDown,
    User,
} from "lucide-react";

import { getCurrentUser } from "../../utils/auth";


function UserLayout() {

    const location = useLocation();
    const navigate = useNavigate();

    const currentUser = getCurrentUser();
    const [showNotifications, setShowNotifications] = useState(false);


    const pageNames = {
        "/dashboard": "Dashboard",
        "/books": "Browse Books",
        "/loans": "My Loans",
        "/reservations": "My Reservations",
        "/fines": "My Fines",
        "/subscription": "My Subscription",
        "/wishlist": "Wishlist",
        "/profile": "Profile",
        "/settings": "Settings",
    };


    const pageName =
        pageNames[location.pathname] || "Dashboard";


    const getUserInitial = () => {

        if (!currentUser) {
            return null;
        }

        const name =
            currentUser.fullName ||
            currentUser.userName ||
            currentUser.email ||
            "";

        return name.charAt(0).toUpperCase();
    };


    const userInitial = getUserInitial();


    return (

        <div className="flex h-screen overflow-hidden bg-[#f7f8fc]">


            {/* ================= SIDEBAR ================= */}

            <div className="h-screen shrink-0">

                <Sidebar />

            </div>


            {/* ================= RIGHT SIDE ================= */}

            <div className="flex-1 h-screen flex flex-col overflow-hidden">


                {/* ================= TOP HEADER ================= */}

                <header
                    className="
                        h-[68px]
                        shrink-0
                        bg-white
                        border-b border-gray-200
                        flex items-center
                        justify-between
                        px-6
                    "
                >

                    {/* Page Name */}

                    <div>

                        <h2 className="text-[16px] font-semibold text-gray-900">
                            {pageName}
                        </h2>

                    </div>


                    {/* Header Actions */}

                    <div className="flex items-center gap-5">


                        {/* Search */}

                        <button
                            type="button"
                            onClick={() => navigate("/books")}
                            className="text-gray-600 hover:text-gray-900 transition"
                            title="Search books"
                        >

                            <Search size={20} />

                        </button>


                        {/* Notification */}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowNotifications((value) => !value)}
                                className="text-gray-600 hover:text-gray-900 transition"
                                title="Notifications"
                            >
                                <Bell size={19} />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-8 z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                                    <p className="text-xs font-semibold text-gray-900">Notifications</p>
                                    <p className="mt-2 text-[11px] text-gray-500">No new notifications.</p>
                                </div>
                            )}
                        </div>


                        {/* Main */}

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="h-9 px-4 border border-gray-200 rounded-lg bg-white flex items-center gap-3 text-[13px] font-medium text-gray-800 hover:bg-gray-50 transition"
                            title="Go to dashboard"
                        >

                            <span>
                                Main
                            </span>

                            <ChevronDown size={15} />

                        </button>


                        {/* User Circle */}

                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="
                                w-9 h-9
                                rounded-full
                                bg-gray-200
                                flex items-center
                                justify-center
                                text-gray-600
                                hover:bg-gray-300
                                transition
                                font-semibold
                                text-[13px]
                            "
                            title="Profile"
                        >

                            {userInitial ? (
                                userInitial
                            ) : (
                                <User size={18} />
                            )}

                        </button>

                    </div>

                </header>


                {/* ================= ROUTER CONTENT ================= */}

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                    "
                >

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default UserLayout;
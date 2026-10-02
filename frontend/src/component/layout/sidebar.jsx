import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    CalendarDays,
    Receipt,
    CreditCard,
    Heart,
    User,
    Settings,
    LogOut
} from "lucide-react";

import { logoutUser } from "../../utils/auth";


function Sidebar() {

    const navigate = useNavigate();


    const mainItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Browse Books",
            path: "/books",
            icon: BookOpen
        },
        {
            name: "My Loans",
            path: "/loans",
            icon: ClipboardList
        },
        {
            name: "My Reservations",
            path: "/reservations",
            icon: CalendarDays
        },
        {
            name: "My Fines",
            path: "/fines",
            icon: Receipt
        },
        {
            name: "My Subscription",
            path: "/subscription",
            icon: CreditCard
        },
        {
            name: "Wishlist",
            path: "/wishlist",
            icon: Heart
        }
    ];


    const accountItems = [
        {
            name: "Profile",
            path: "/profile",
            icon: User
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings
        }
    ];


    const handleLogout = () => {

        logoutUser();

        navigate("/login");

    };


    return (

        <aside className="w-[225px] h-screen bg-[#111a2d] text-white flex flex-col">


            {/* LOGO */}

            <div className="px-5 pt-6 pb-7 shrink-0">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">

                        <BookOpen size={21} />

                    </div>

                    <div>

                        <h1 className="text-[18px] font-semibold tracking-wide">
                            BookNest
                        </h1>

                        <p className="text-[10px] text-gray-400 tracking-wider mt-1">
                            LIBRARY HUB
                        </p>

                    </div>

                </div>

            </div>


            {/* NAVIGATION */}

            <nav className="px-3 flex-1 overflow-y-auto">


                {/* MAIN ITEMS */}

                {mainItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition
                                ${
                                    isActive
                                        ? "bg-[#1b2741] border border-[#303b5a] text-white"
                                        : "text-gray-300 hover:bg-[#1b2741] hover:text-white"
                                }`
                            }
                        >

                            {({ isActive }) => (

                                <>

                                    {/* ACTIVE PURPLE LINE */}

                                    {isActive && (

                                        <span
                                            className="
                                                absolute
                                                left-0
                                                top-1/2
                                                -translate-y-1/2
                                                w-[3px]
                                                h-7
                                                bg-purple-500
                                                rounded-r-full
                                            "
                                        />

                                    )}


                                    <Icon size={19} />

                                    <span className="text-[13px] font-medium">
                                        {item.name}
                                    </span>


                                    {isActive && (

                                        <span
                                            className="
                                                ml-auto
                                                w-1.5
                                                h-1.5
                                                rounded-full
                                                bg-purple-400
                                            "
                                        />

                                    )}

                                </>

                            )}

                        </NavLink>

                    );

                })}


                {/* DIVIDER */}

                <div className="border-t border-[#202b42] my-5" />


                {/* ACCOUNT ITEMS */}

                {accountItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition
                                ${
                                    isActive
                                        ? "bg-[#1b2741] text-white"
                                        : "text-gray-300 hover:bg-[#1b2741] hover:text-white"
                                }`
                            }
                        >

                            <Icon size={19} />

                            <span className="text-[13px] font-medium">
                                {item.name}
                            </span>

                        </NavLink>

                    );

                })}

            </nav>


            {/* LOGOUT */}

            <div className="px-3 pb-4 shrink-0">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-4
                        px-4
                        py-3
                        rounded-lg
                        bg-[#351e32]
                        border border-[#542744]
                        text-[#ef8ca5]
                        hover:bg-[#42233b]
                        transition
                    "
                >

                    <LogOut size={19} />

                    <span className="text-[13px] font-medium">
                        Logout
                    </span>

                </button>


                <p className="text-center text-[9px] text-gray-500 mt-7">
                    © 2026 BookNest. All rights reserved.
                </p>

            </div>

        </aside>
    );
}


export default Sidebar;
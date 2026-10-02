import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="h-[72px] flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#5b3df5] to-[#7c3aed] flex items-center justify-center">
                            <BookOpen size={16} className="text-white" />
                        </div>

                        <span className="text-[15px] font-bold text-[#5b3df5]">
                            BookNest
                        </span>
                    </Link>


                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-7 text-[13px] text-gray-700">

                        <a
                            href="#home"
                            className="hover:text-[#5b3df5] transition"
                        >
                            Home
                        </a>

                        <Link
                            to="/books"
                            className="hover:text-[#5b3df5] transition"
                        >
                            Browse Books
                        </Link>

                        <a
                            href="#about"
                            className="hover:text-[#5b3df5] transition"
                        >
                            About
                        </a>

                        <a
                            href="#contact"
                            className="hover:text-[#5b3df5] transition"
                        >
                            Contact
                        </a>

                    </nav>


                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">

                        <Link
                            to="/login"
                            className="text-[13px] text-gray-700 hover:text-[#5b3df5] transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-md bg-[#5b3df5] text-white text-[12px] font-medium hover:bg-[#4c2fe0] transition shadow-sm"
                        >
                            Sign Up
                        </Link>

                    </div>

                </div>
            </div>
        </header>
    );
}

export default Navbar;
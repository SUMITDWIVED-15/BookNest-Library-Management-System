import { ArrowRight, BookOpen, Mouse } from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-[#f8f9ff]"
        >
            {/* Soft background glow */}
            <div className="absolute -left-32 top-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute right-0 top-20 w-80 h-80 bg-pink-200/15 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">

                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eeebff] text-[#5b3df5] text-[11px] font-medium mb-6">
                            <span>✦</span>
                            Welcome to BookNest
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-[52px] leading-[1.08] font-bold text-[#111827]">
                            Your Gateway to
                            <span className="block text-[#6637ed]">
                                Endless Knowledge
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-[14px] leading-6 text-gray-600">
                            Discover, reserve, and enjoy thousands of books from our
                            extensive collection. Join our community of readers and
                            experience seamless library management.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3 mt-7">

                            <Link
                                to="/books"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#5635ed] text-white text-[12px] font-semibold hover:bg-[#4829d8] transition shadow-md"
                            >
                                Explore Books
                                <ArrowRight size={15} />
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[#6543e9] text-[#5635ed] text-[12px] font-semibold hover:bg-[#f5f2ff] transition"
                            >
                                <BookOpen size={14} />
                                Login
                            </Link>

                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mt-7">

                            <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                10,000+ Books
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                5,000+ Members
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                24/7 Access
                            </div>

                        </div>

                    </div>


                    {/* RIGHT ILLUSTRATION */}
                    <div className="relative flex justify-center">

                        {/* Rotated background card */}
                        <div className="absolute w-[340px] h-[220px] bg-[#dfe3ff] rounded-2xl rotate-3" />

                        {/* Main card */}
                        <div className="relative w-[350px] h-[215px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                            {/* New Arrivals clickable badge */}
                            <Link
                                to="/books"
                                className="absolute right-4 top-4 z-10 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[9px] font-semibold hover:bg-yellow-200 transition cursor-pointer"
                            >
                                📚 New Arrivals
                            </Link>

                            {/* Centered books */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2">

                                <div className="w-9 h-28 rounded-md bg-[#6366f1]" />

                                <div className="w-9 h-36 rounded-md bg-[#a855f7]" />

                                <div className="w-9 h-24 rounded-md bg-[#ec4899]" />

                                <div className="w-9 h-32 rounded-md bg-[#3b82f6]" />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Scroll indicator */}
                <div className="flex justify-center mt-14">
                    <Mouse
                        size={21}
                        className="text-[#5635ed]"
                    />
                </div>

            </div>
        </section>
    );
}

export default HeroSection;
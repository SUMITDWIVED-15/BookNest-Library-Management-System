import { useState } from "react";

import {
    Mail,
    Phone,
    MapPin,
    Send,
    Globe,
    MessageCircle,
} from "lucide-react";

function Footer() {
    const [email, setEmail] = useState("");
    const [newsletterMessage, setNewsletterMessage] = useState("");

    const handleNewsletter = () => {
        if (!email.trim()) {
            setNewsletterMessage("Enter your email address.");
            return;
        }
        setNewsletterMessage("Thanks! You are subscribed to BookNest updates.");
        setEmail("");
    };

    return (
        <footer id="contact" className="bg-[#111827] text-gray-300">

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Library */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-5">
                            BookNest
                        </h3>

                        <p className="text-sm leading-7 text-gray-400">
                            Your gateway to endless knowledge. Discover,
                            borrow, reserve and enjoy thousands of books
                            from our digital library.
                        </p>

                        <div className="flex gap-3 mt-6">

                            <a
                                href="/"
                                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition"
                                title="Website"
                            >
                                <Globe size={17} />
                            </a>

                            <a
                                href="/signup"
                                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition"
                                title="Join community"
                            >
                                <MessageCircle size={17} />
                            </a>

                            <a
                                href="mailto:support@booknest.com"
                                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition"
                                title="Email BookNest"
                            >
                                <Mail size={17} />
                            </a>

                        </div>
                    </div>


                    {/* Library Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-5">
                            Library
                        </h4>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="/books"
                                    className="hover:text-purple-400 transition"
                                >
                                    Browse Books
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/reservations"
                                    className="hover:text-purple-400 transition"
                                >
                                    Reservations
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/wishlist"
                                    className="hover:text-purple-400 transition"
                                >
                                    Wishlist
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/loans"
                                    className="hover:text-purple-400 transition"
                                >
                                    My Loans
                                </a>
                            </li>
                        </ul>
                    </div>


                    {/* Membership */}
                    <div>
                        <h4 className="text-white font-semibold mb-5">
                            Membership
                        </h4>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="/subscription"
                                    className="hover:text-purple-400 transition"
                                >
                                    Membership Plans
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/signup"
                                    className="hover:text-purple-400 transition"
                                >
                                    Join the Community
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/login"
                                    className="hover:text-purple-400 transition"
                                >
                                    Member Login
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/profile"
                                    className="hover:text-purple-400 transition"
                                >
                                    My Profile
                                </a>
                            </li>
                        </ul>
                    </div>


                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-5">
                            Contact Us
                        </h4>

                        <div className="space-y-4 text-sm">

                            <div className="flex items-start gap-3">
                                <MapPin
                                    size={18}
                                    className="text-purple-400 mt-0.5 shrink-0"
                                />

                                <span>
                                    123 Knowledge Street,
                                    <br />
                                    New Delhi, India
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone
                                    size={17}
                                    className="text-purple-400 shrink-0"
                                />

                                <span>
                                    +91 98765 43210
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail
                                    size={17}
                                    className="text-purple-400 shrink-0"
                                />

                                <span>
                                    support@booknest.com
                                </span>
                            </div>

                        </div>
                    </div>

                </div>


                {/* Newsletter */}
                <div className="border-t border-gray-800 mt-12 pt-10">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div>
                            <h4 className="text-white font-semibold text-lg">
                                Stay Updated
                            </h4>

                            <p className="text-sm text-gray-400 mt-1">
                                Get updates about new books and library
                                announcements.
                            </p>
                        </div>

                        <div className="flex w-full lg:w-auto">

                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full lg:w-72 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                            />

                            <button
                                type="button"
                                onClick={handleNewsletter}
                                className="px-5 py-3 rounded-r-lg bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <Send size={17} />
                                Subscribe
                            </button>

                        </div>

                        {newsletterMessage && (
                            <p className="text-xs text-purple-300">{newsletterMessage}</p>
                        )}

                    </div>

                </div>

            </div>


            {/* Bottom Footer */}
            <div className="border-t border-gray-800">

                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

                    <p className="text-sm text-gray-500">
                        © 2026 BookNest. All rights reserved.
                    </p>

                    <div className="flex gap-5 text-sm">
                        <a
                            href="#"
                            className="hover:text-purple-400 transition"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className="hover:text-purple-400 transition"
                        >
                            Terms of Service
                        </a>

                        <a
                            href="#"
                            className="hover:text-purple-400 transition"
                        >
                            Help
                        </a>
                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
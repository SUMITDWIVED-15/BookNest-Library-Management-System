import {
    Search,
    CalendarCheck,
    CreditCard,
    Users,
    Bookmark,
    ShieldCheck
} from "lucide-react";

import { Link } from "react-router-dom";

const features = [
    {
        title: "Smart Book Search",
        description:
            "Find your perfect book with our advanced search filters. Search by title, author, genre, or ISBN.",
        icon: Search,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        link: "/books"
    },
    {
        title: "Online Reservation",
        description:
            "Reserve books online and pick them up at your convenience. Get instant notifications.",
        icon: CalendarCheck,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        link: "/reservations"
    },
    {
        title: "Secure Payments",
        description:
            "Integrated payment gateway for membership fees and fines. Multiple payment options available.",
        icon: CreditCard,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
        link: "/subscription"
    },
    {
        title: "Digital Membership",
        description:
            "Manage your membership digitally. Track borrowed books, due dates, and reading history.",
        icon: Users,
        iconBg: "bg-pink-50",
        iconColor: "text-pink-600",
        link: "/subscription"
    },
    {
        title: "Personal Library",
        description:
            "Create your reading lists, save favorites, and get personalized recommendations.",
        icon: Bookmark,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
        link: "/wishlist"
    },
    {
        title: "Secure & Private",
        description:
            "Your data is encrypted and secure. We respect your privacy and protect your information.",
        icon: ShieldCheck,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
        link: "/settings"
    }
];

function FeaturesSection() {
    return (
        <section
            id="about"
            className="bg-white py-20"
        >
            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-12">

                    <h2 className="text-3xl font-bold text-[#111827]">
                        Why Choose{" "}
                        <span className="text-[#6637ed]">
                            BookNest
                        </span>
                    </h2>

                    <p className="mt-3 text-[13px] text-gray-500">
                        Experience modern library management designed for readers.
                    </p>

                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {features.map((feature) => {

                        const Icon = feature.icon;

                        return (
                            <Link
                                key={feature.title}
                                to={feature.link}
                                className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                            >

                                <div
                                    className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center`}
                                >
                                    <Icon
                                        size={19}
                                        className={feature.iconColor}
                                    />
                                </div>

                                <h3 className="mt-4 text-[14px] font-bold text-gray-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-[11px] leading-5 text-gray-500">
                                    {feature.description}
                                </p>

                            </Link>
                        );

                    })}

                </div>


                <div className="text-center mt-10">

                    <p className="text-[12px] text-gray-500 mb-4">
                        Ready to explore our features?
                    </p>

                    <Link
                        to="/signup"
                        className="inline-flex px-6 py-3 rounded-md bg-[#5b35ed] text-white text-[12px] font-semibold hover:bg-[#492bd8] transition shadow-md"
                    >
                        Get Started Today
                    </Link>

                </div>

            </div>
        </section>
    );
}

export default FeaturesSection;
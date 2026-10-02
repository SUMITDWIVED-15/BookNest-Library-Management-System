import { Link } from "react-router-dom";

function CommunitySection() {
    return (
        <section className="py-16 bg-white">

            <div className="max-w-6xl mx-auto px-6">

                <div className="rounded-2xl bg-gradient-to-r from-[#f0f2ff] via-[#f7f4ff] to-[#fff3ff] border border-purple-100 px-6 py-12 text-center">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Join Our Community of Readers
                    </h2>

                    <p className="max-w-xl mx-auto mt-3 text-[12px] leading-5 text-gray-500">
                        Become a member today and start your reading journey
                        with access to thousands of books and exclusive benefits.
                    </p>


                    <div className="flex justify-center flex-wrap gap-3 mt-6">

                        <Link
                            to="/signup"
                            className="px-6 py-3 rounded-md bg-[#5b35ed] text-white text-[11px] font-semibold hover:bg-[#492bd8] transition shadow-md"
                        >
                            Start Free Trial
                        </Link>

                        <Link
                            to="/subscription"
                            className="px-6 py-3 rounded-md border border-[#5b35ed] text-[#5b35ed] text-[11px] font-semibold hover:bg-white transition"
                        >
                            View Membership Plans
                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default CommunitySection;
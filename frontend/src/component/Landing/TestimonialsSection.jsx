import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Teacher",
        text:
            "BookNest has transformed the way I discover and access books. The online reservation system is incredibly convenient, and the collection is outstanding!",
        avatar: "SJ"
    },
    {
        name: "Michael Chen",
        role: "Software Engineer",
        text:
            "As a busy professional, I love how easy it is to manage my reading list and renewals online. The digital membership feature is a game-changer!",
        avatar: "MC"
    },
    {
        name: "Emily Rodriguez",
        role: "Student",
        text:
            "The book search feature is amazing! I can quickly find research materials for my studies. The smart recommendations have helped me discover so many great books.",
        avatar: "ER"
    }
];

function TestimonialsSection() {
    return (
        <section className="py-20 bg-white">

            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-12">

                    <h2 className="text-3xl font-bold text-gray-900">
                        What Our Members{" "}
                        <span className="text-[#6637ed]">
                            Say
                        </span>
                    </h2>

                    <p className="mt-3 text-[12px] text-gray-500">
                        Don't just take our word for it - hear from our community
                        of passionate readers.
                    </p>

                </div>


                <div className="grid md:grid-cols-3 gap-5">

                    {testimonials.map((item) => (

                        <div
                            key={item.name}
                            className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                        >

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={12}
                                        fill="#f5b942"
                                        className="text-[#f5b942]"
                                    />
                                ))}
                            </div>


                            <Quote
                                size={25}
                                className="absolute right-5 top-5 text-gray-100"
                            />


                            <p className="mt-4 text-[11px] leading-5 text-gray-600">
                                "{item.text}"
                            </p>


                            <div className="flex items-center gap-3 mt-5">

                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#4f46e5] flex items-center justify-center text-white text-[10px] font-bold">
                                    {item.avatar}
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold text-gray-900">
                                        {item.name}
                                    </p>

                                    <p className="text-[10px] text-gray-500">
                                        {item.role}
                                    </p>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default TestimonialsSection;
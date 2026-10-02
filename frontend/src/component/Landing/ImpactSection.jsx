import {
    BookOpen,
    Users,
    Trophy,
    TrendingUp,
    UserPlus
} from "lucide-react";

const stats = [
    {
        value: "2,833+",
        label: "Books Available",
        icon: BookOpen,
        bg: "bg-blue-50",
        color: "text-blue-600"
    },
    {
        value: "1,416+",
        label: "Active Members",
        icon: Users,
        bg: "bg-green-50",
        color: "text-green-600"
    },
    {
        value: "14+",
        label: "Award Winning",
        icon: Trophy,
        bg: "bg-purple-50",
        color: "text-purple-600"
    },
    {
        value: "27%",
        label: "Satisfaction Rate",
        icon: TrendingUp,
        bg: "bg-pink-50",
        color: "text-pink-600"
    }
];

function ImpactSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-[#f7f8ff] via-white to-[#fff9ff]">

            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center">

                    <h2 className="text-3xl font-bold text-[#111827]">
                        Our Impact in{" "}
                        <span className="text-[#6637ed]">
                            Numbers
                        </span>
                    </h2>

                    <p className="mt-3 text-[12px] text-gray-500">
                        Join thousands of satisfied readers who trust BookNest
                        for their reading journey.
                    </p>

                </div>


                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

                    {stats.map((stat) => {

                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center"
                            >

                                <div
                                    className={`mx-auto w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                                >
                                    <Icon
                                        size={19}
                                        className={stat.color}
                                    />
                                </div>

                                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </h3>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    {stat.label}
                                </p>

                            </div>
                        );

                    })}

                </div>


                <div className="flex justify-center mt-8">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-4 flex items-center gap-5">

                        <div className="flex -space-x-2">

                            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-violet-400 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                                +
                            </div>

                        </div>

                        <div>
                            <div className="flex items-center gap-1">
                                <UserPlus
                                    size={14}
                                    className="text-purple-600"
                                />
                                <span className="text-[16px] font-bold text-gray-900">
                                    1,200+
                                </span>
                            </div>

                            <p className="text-[10px] text-gray-500">
                                New members joined this month
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default ImpactSection;
import { FC } from "react";

const CareTypesSection: FC = () => {
    const careTypes = [
        {
            title: "Visiting care.",
            description:
                "Flexible visits for support as you need it—perfect for daily routines such as bathing, meals, household tasks, or companionship, whether for regular visits or one-off help.",
            image: "/visiting_care.png",
        },
        {
            title: "Overnight care.",
            description:
                "A trusted carer provides assistance, reassurance, and safety during nighttime hours. Ideal for those needing help with medication, bathroom trips, or simply a comforting presence.",
            image: "/overnight_care.png",
        },
        {
            title: "Live-in care.",
            description:
                "Comprehensive, round-the-clock support with a dedicated carer living at home. Ensures continuity, companionship, and personalised care tailored to your needs.",
            image: "/live_in_care.png",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {careTypes.map((type, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative w-full aspect-square mb-10 overflow-hidden rounded-[2.5rem] transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src={type.image}
                                    alt={type.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight">
                                {type.title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                                {type.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareTypesSection;

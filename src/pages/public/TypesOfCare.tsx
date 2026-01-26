import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Brain, Heart, Coffee, Moon, User, ArrowRight, ShieldCheck } from "lucide-react";

const careTypes = [
    {
        title: "Live-in Care",
        icon: Home,
        description: "24/7 support from a dedicated carer who lives with you, providing constant companionship and assistance.",
        color: "bg-emerald-100 text-emerald-700"
    },
    {
        title: "Dementia Care",
        icon: Brain,
        description: "Specialist support for those living with dementia, focused on maintaining routine, safety, and dignity.",
        color: "bg-purple-100 text-purple-700"
    },
    {
        title: "Palliative Care",
        icon: Heart,
        description: "Compassionate end-of-life care that prioritizes comfort, pain management, and emotional support for the whole family.",
        color: "bg-rose-100 text-rose-700"
    },
    {
        title: "Respite Care",
        icon: Coffee,
        description: "Short-term relief for primary caregivers. Take a break knowing your loved one is in safe, professional hands.",
        color: "bg-amber-100 text-amber-700"
    },
    {
        title: "Overnight Care",
        icon: Moon,
        description: "Reassurance through the night. Whether it's waking support or just someone being there, we have you covered.",
        color: "bg-indigo-100 text-indigo-700"
    },
    {
        title: "Visiting Care",
        icon: User,
        description: "Flexible visits from as little as one hour. Perfect for medication prompts, meal prep, or simply a friendly chat.",
        color: "bg-blue-100 text-blue-700"
    }
];

const TypesOfCare = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-xs font-bold uppercase tracking-widest mb-8">
                            <ShieldCheck className="w-3 h-3" />
                            Comprehensive Support
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-[#111827] mb-8 tracking-tighter leading-[0.95]">
                            Care tailored to <br />
                            <span className="text-[#1a9e8c]">your specific needs.</span>
                        </h1>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                            From hourly visits to full-time live-in support, Heems connects you with specialist carers vetted for every situation.
                        </p>
                    </div>
                </section>

                {/* Care Types Grid */}
                <section className="bg-slate-50 py-24 border-y border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {careTypes.map((type, index) => (
                                <div key={index} className="bg-white p-10 rounded-3xl border border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-xl transition-all duration-500 group">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${type.color}`}>
                                        <type.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4 group-hover:text-[#1a9e8c] transition-colors">{type.title}</h3>
                                    <p className="text-lg text-[#4B5563] font-medium leading-relaxed mb-8">
                                        {type.description}
                                    </p>
                                    <Link to="/marketplace" className="inline-flex items-center text-sm font-bold text-[#111827] group-hover:text-[#1a9e8c] transition-colors cursor-pointer">
                                        Find {type.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 lg:py-32">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="bg-[#111827] rounded-[3rem] p-12 lg:p-24 text-white text-center relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter">Not sure what you need?</h2>
                                <p className="text-white/60 text-xl font-medium mb-12">Our care experts are here to guide you through the options and help you find the perfect match.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button className="h-16 px-12 rounded-2xl bg-[#1a9e8c] text-white font-black hover:bg-[#15806c] shadow-2xl transition-all text-lg" asChild>
                                        <Link to="/marketplace">Browse Carers</Link>
                                    </Button>
                                    <Button variant="outline" className="h-16 px-12 rounded-2xl bg-transparent border-white/20 text-white font-black hover:bg-white hover:text-[#111827] transition-all text-lg" asChild>
                                        <Link to="/contact">Speak to an Advisor</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default TypesOfCare;

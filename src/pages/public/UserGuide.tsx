import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Play, Book, Lightbulb, CheckCircle2, ChevronRight } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";

const UserGuide = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl">
                            <Badge className="mb-6 bg-[#1a9e8c]/10 text-[#1a9e8c] border-[#1a9e8c]/20 py-1 px-4 text-xs font-black uppercase tracking-widest">Mastering Heems</Badge>
                            <h1 className="text-6xl font-black text-[#111827] mb-8 leading-tight">Everything you need to <span className="text-[#1a9e8c]">get started</span>.</h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                                From creating your first care plan to managing complex specialist bookings, our guide covers everything you need to know.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Getting Started Grid */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Setting up your account",
                                    steps: ["Verify your email", "Complete your profile", "Add payment method"],
                                    icon: Book
                                },
                                {
                                    title: "Finding the right carer",
                                    steps: ["Use precise filters", "Review profile & docs", "Initial message"],
                                    icon: Search
                                },
                                {
                                    title: "Managing Bookings",
                                    steps: ["Calendar sync", "Review submissions", "Emergency contacts"],
                                    icon: CheckCircle2
                                }
                            ].map((card, i) => (
                                <Card key={i} className="group border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 rounded-[2.5rem] p-8">
                                    <CardContent className="p-0">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] group-hover:text-white transition-colors">
                                            <card.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-black text-[#111827] mb-6">{card.title}</h3>
                                        <ul className="space-y-4 mb-8">
                                            {card.steps.map((step, si) => (
                                                <li key={si} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button variant="ghost" className="p-0 hover:bg-transparent text-[#111827] hover:text-[#1a9e8c] font-black group">
                                            READ CHAPTER <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Guide Placeholder Section */}
                <section className="py-32 bg-[#111827] text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-8 leading-tight">Watch: A Day in the Life with Heems</h2>
                                <p className="text-white/60 text-lg font-medium mb-10 leading-relaxed">See how Heems simplifies management for both families and carers. Our platform handles the details so you can handle the care.</p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <div className="h-12 w-12 rounded-2xl bg-[#1a9e8c] flex items-center justify-center shrink-0">
                                            <Lightbulb className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">Pro Tip</h4>
                                            <p className="text-sm text-white/40">Enable platform notifications to receive real-time updates on care session completions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="aspect-video bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                                    <div className="h-20 w-20 rounded-full bg-[#1a9e8c] flex items-center justify-center shadow-2xl shadow-[#1a9e8c]/40 group-hover:scale-110 transition-transform">
                                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60 rounded-[3rem]" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Style guide */}
                <section className="py-32">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-[#111827] mb-4">Common Scenarios</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: "How do I update a care plan mid-session?", a: "You can update care notes in real-time through the dashboard. Carers will receive an instant notification on their mobile interface." },
                                { q: "What happens if a carer needs to cancel?", a: "If a carer cancels, our automated priority system will notify other vetted carers in your area with similar skills immediately." },
                                { q: "Managing multiple patients for one family?", a: "The 'Primary Client' account can manage multiple 'Members' profiles, each with an independent care plan and documentation." }
                            ].map((faq, i) => (
                                <Card key={i} className="border-black/5 rounded-3xl hover:bg-slate-50 transition-colors">
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-black text-[#111827] mb-4">{faq.q}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default UserGuide;

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    Search,
    MessageCircle,
    Phone,
    Mail,
    Book,
    HelpCircle,
    FileText,
    Shield,
    CreditCard,
    Calendar,
    Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Link } from "react-router-dom";

const faqs = [
    {
        category: "Getting Started",
        icon: Book,
        questions: [
            {
                q: "How do I book a carer?",
                a: "Navigate to the Search page, browse verified carers, and click 'Book Now' on your preferred carer's profile. Fill in the booking details and confirm your appointment.",
            },
            {
                q: "What information do I need to provide?",
                a: "You'll need to provide basic contact information, the type of care needed, preferred dates and times, and any special requirements or medical notes.",
            },
            {
                q: "How long does it take to get matched with a carer?",
                a: "Most bookings are confirmed within 24 hours. For urgent care needs, you can filter for carers with immediate availability.",
            },
        ],
    },
    {
        category: "Payments",
        icon: CreditCard,
        questions: [
            {
                q: "How do payments work?",
                a: "Payments are processed securely through Stripe. You'll be charged after the care session is completed. A 10% platform fee is added to the carer's hourly rate.",
            },
            {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) and bank transfers for regular clients.",
            },
            {
                q: "Can I get a refund?",
                a: "Refunds are available if you cancel at least 24 hours before the scheduled appointment. Contact support for cancellations within 24 hours.",
            },
        ],
    },
    {
        category: "Bookings",
        icon: Calendar,
        questions: [
            {
                q: "How do I cancel a booking?",
                a: "Go to your Bookings page, select the booking you want to cancel, and click 'Cancel Booking'. Cancellations made 24+ hours in advance receive a full refund.",
            },
            {
                q: "Can I reschedule an appointment?",
                a: "Yes, you can reschedule by cancelling the current booking and creating a new one, or by contacting the carer directly through our messaging system.",
            },
            {
                q: "What if my carer doesn't show up?",
                a: "Contact our support team immediately. We'll help you find a replacement carer and issue a full refund for the missed appointment.",
            },
        ],
    },
    {
        category: "Safety & Verification",
        icon: Shield,
        questions: [
            {
                q: "Are all carers verified?",
                a: "Yes, all carers undergo a rigorous verification process including DBS checks, right-to-work verification, professional references, and insurance validation.",
            },
            {
                q: "What if I'm not satisfied with the care?",
                a: "Contact our support team within 24 hours of the appointment. We take all complaints seriously and will work to resolve any issues.",
            },
            {
                q: "How is my data protected?",
                a: "We are GDPR compliant and use bank-grade encryption for all data. Your information is never shared without your explicit consent.",
            },
        ],
    },
    {
        category: "Communication",
        icon: MessageCircle,
        questions: [
            {
                q: "How do I message my carer?",
                a: "Use the Messages page in your dashboard to communicate with your carers. All messages are monitored for compliance.",
            },
            {
                q: "Can I share my phone number?",
                a: "Yes, but we recommend using our secure messaging system for all initial communications. You can share contact details once you're comfortable.",
            },
        ],
    },
];

const Help = () => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string>("client");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user || null;
            setUser(user);
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setRole(profile?.role || "client");
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const content = (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">How can we help?</h1>
                <p className="text-muted-foreground">
                    Search our help center or browse categories below
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for help articles..."
                            className="pl-10 h-12"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
                <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                        // Find and click the chat widget button
                        const chatButton = document.querySelector('[data-chat-widget-trigger]') as HTMLButtonElement;
                        if (chatButton) chatButton.click();
                    }}
                >
                    <CardContent className="pt-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Chat with our support team</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">Email Support</h3>
                        <p className="text-sm text-muted-foreground">support@heemscare.com</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">Phone Support</h3>
                        <p className="text-sm text-muted-foreground">+44 20 1234 5678</p>
                    </CardContent>
                </Card>
            </div>

            {/* FAQs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                    {faqs.map((category, idx) => (
                        <div key={idx} className="mb-6 last:mb-0">
                            <div className="flex items-center gap-2 mb-3">
                                <category.icon className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">{category.category}</h3>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                {category.questions.map((item, qIdx) => (
                                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                                        <AccordionTrigger className="text-left">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Resources */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Helpful Resources
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/user-guide">
                            <Book className="h-4 w-4 mr-2" />
                            User Guide
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/safety-guidelines">
                            <Shield className="h-4 w-4 mr-2" />
                            Safety Guidelines
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/terms">
                            <FileText className="h-4 w-4 mr-2" />
                            Terms of Service
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/privacy">
                            <FileText className="h-4 w-4 mr-2" />
                            Privacy Policy
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                    <p className="text-muted-foreground mb-4">
                        Our support team is available 9am - 5pm to assist you
                    </p>
                    <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Support
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    if (loading) return null;

    if (user) {
        return (
            <DashboardLayout role={role as any}>
                {content}
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="pt-24 pb-12">
                {content}
            </div>
            <Footer />
        </div>
    );
};

export default Help;

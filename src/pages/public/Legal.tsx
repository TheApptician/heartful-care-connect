import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Lock, AlertCircle } from "lucide-react";

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState("terms");

    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />
            <div className="bg-slate-50 min-h-screen pt-24 pb-10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Center</h1>
                        <p className="text-slate-500">Terms of Service, Privacy Policy, and Community Guidelines</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <Card>
                                <CardContent className="p-4">
                                    <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="h-full space-y-2">
                                        <TabsList className="flex flex-col h-auto bg-transparent items-stretch space-y-1 p-0">
                                            <TabsTrigger value="terms" className="justify-start px-4 py-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Terms of Service
                                            </TabsTrigger>
                                            <TabsTrigger value="privacy" className="justify-start px-4 py-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                                                <Lock className="w-4 h-4 mr-2" />
                                                Privacy Policy
                                            </TabsTrigger>
                                            <TabsTrigger value="intro-agency" className="justify-start px-4 py-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                                                <Shield className="w-4 h-4 mr-2" />
                                                Introductory Agency
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-3">
                            <ScrollArea className="h-[800px] rounded-xl border bg-white shadow-sm">
                                <div className="p-8">
                                    <TabsContent value="terms" className="mt-0">
                                        <article className="prose prose-slate max-w-none">
                                            <h2>Terms of Service</h2>
                                            <p className="text-sm text-muted-foreground">Last Updated: January 26, 2026</p>

                                            <h3>1. Acceptance of Terms</h3>
                                            <p>
                                                By accessing and using the Heems platform ("Platform"), you agree to accept and be bound by these Terms of Service. If you do not agree to these terms, you should not access or use our services.
                                            </p>

                                            <h3>2. Platform Overview</h3>
                                            <p>
                                                Heems operates as an "Introductory Agency". We provide an online marketplace connecting self-employed carers ("Carers") with individuals seeking care services ("Clients"). Heems is not a regulated care experience provider but facilitates the introduction and management of these relationships.
                                            </p>

                                            <h3>3. User Responsibilities</h3>
                                            <ul>
                                                <li><strong>For Carers:</strong> You agree that you are a self-employed individual responsibly for your own tax and national insurance contributions. You must maintain valid DBS checks and insurance.</li>
                                                <li><strong>For Clients:</strong> You are responsible for selecting the carer that best meets your needs and for providing a safe working environment.</li>
                                            </ul>

                                            <h3>4. Payments & Fees</h3>
                                            <p>
                                                Heems uses Stripe for payment processing. Clients pay fees into a secure escrow-like system. Funds are released to carers typically 2-3 days after service delivery to ensure satisfaction and dispute resolution if necessary. Heems charges a platform fee which is deducted from the total transaction.
                                            </p>

                                            <h3>5. Background Checks</h3>
                                            <p>
                                                While Heems performs rigorous vetting including identity and DBS verification, we act as a facilitator. Users are encouraged to verify details independently if they wish.
                                            </p>
                                        </article>
                                    </TabsContent>

                                    <TabsContent value="privacy" className="mt-0">
                                        <article className="prose prose-slate max-w-none">
                                            <h2>Privacy Policy</h2>
                                            <p className="text-sm text-muted-foreground">Last Updated: January 26, 2026</p>

                                            <h3>1. Data Collection</h3>
                                            <p>We collect personal data necessary to facilitate care services, including:</p>
                                            <ul>
                                                <li>Identity data (Name, DOB, ID documents)</li>
                                                <li>Contact information (Address, email, phone)</li>
                                                <li>Health data (where necessary for care planning)</li>
                                                <li>Financial data (for processing payments)</li>
                                            </ul>

                                            <h3>2. How We Use Your Data</h3>
                                            <p>
                                                Your data is used to:
                                                <ul>
                                                    <li>Verify identities and qualifications</li>
                                                    <li>Match clients with suitable carers</li>
                                                    <li>Process payments specifically via Stripe</li>
                                                    <li>Comply with legal obligations</li>
                                                </ul>
                                            </p>

                                            <h3>3. Data Security</h3>
                                            <p>
                                                We employ industry-standard encryption and security measures. Your sensitive documents (like DBS certs) are stored securely and access is strictly controlled.
                                            </p>
                                        </article>
                                    </TabsContent>

                                    <TabsContent value="intro-agency" className="mt-0">
                                        <article className="prose prose-slate max-w-none">
                                            <h2>Introductory Agency Statement</h2>
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 my-4 flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                                                <div className="text-sm text-amber-800">
                                                    Heems operates as an Introductory Agency, not a regulated care provider.
                                                </div>
                                            </div>

                                            <p>
                                                As an Introductory Agency, Heems facilitates the direct engagement of self-employed carers by clients. This model means:
                                            </p>
                                            <ul>
                                                <li><strong>Control:</strong> The Client (or their representative) is responsible for directing the care and supervising the Carer.</li>
                                                <li><strong>Employment Status:</strong> Carers are self-employed, not employees of Heems.</li>
                                                <li><strong>Regulation:</strong> Heems is not registered with the Care Quality Commission because we do not directly manage the care. However, we adhere to strict voluntary standards for vetting and safety.</li>
                                            </ul>
                                        </article>
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

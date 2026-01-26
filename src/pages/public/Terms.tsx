import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32 pb-16">
                <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    <h1 className="text-4xl lg:text-5xl font-black text-[#111827] mb-8">Terms and Conditions</h1>
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="font-bold">Last updated: January 2026</p>

                        <h3>1. Agreement to Terms</h3>
                        <p>
                            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Heems ("we," "us" or "our"), concerning your access to and use of the Heems platform.
                        </p>

                        <h3>2. Intellectual Property Rights</h3>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                        </p>

                        <h3>3. User Representations</h3>
                        <p>
                            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.
                        </p>

                        <h3>4. Prohibited Activities</h3>
                        <p>
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>

                        <h3>5. User Data</h3>
                        <p>
                            We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site.
                        </p>

                        <h3>6. Contact Us</h3>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@heems.com.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;

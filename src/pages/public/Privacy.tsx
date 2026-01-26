import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32 pb-16">
                <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    <h1 className="text-4xl lg:text-5xl font-black text-[#111827] mb-8">Privacy Policy</h1>
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="font-bold">Last updated: January 2026</p>

                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to Heems ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website and use our platform.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform, or otherwise when you contact us.
                        </p>
                        <p>
                            The personal information that we collect depends on the context of your interactions with us and the platform, the choices you make, and the products and features you use.
                        </p>

                        <h3>3. How We Use Your Information</h3>
                        <p>
                            We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>

                        <h3>4. Sharing Your Information</h3>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>

                        <h3>5. Security</h3>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>

                        <h3>6. Contact Us</h3>
                        <p>
                            If you have questions or comments about this policy, you may email us at privacy@heems.com.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;

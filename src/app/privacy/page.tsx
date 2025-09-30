
import { Header } from '@/components/layout/header';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none">
                <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to SwiftShop. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                    We may collect personal information such as your name, phone number, and address when you register and use our services. We also collect information about your purchase history and browsing behavior to improve your experience.
                </p>

                <h2>3. How We Use Your Information</h2>
                <p>
                    We use the information we collect to:
                </p>
                <ul>
                    <li>Provide, operate, and maintain our services.</li>
                    <li>Process and manage your orders, payments, and deliveries.</li>
                    <li>Improve, personalize, and expand our services.</li>
                    <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the app, and for marketing and promotional purposes.</li>
                    <li>Send you emails and notifications.</li>
                </ul>

                <h2>4. Sharing Your Information</h2>
                <p>
                    We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our application, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                </p>

                <h2>5. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
                 <h2>6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at support@swiftshop.com.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}


import { Header } from '@/components/layout/header';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Terms and Conditions</h1>
            <div className="prose prose-lg max-w-none">
                <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By using our application, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, do not use the application.
                </p>

                <h2>2. Use of the App</h2>
                <p>
                    You agree to use the SwiftShop app only for lawful purposes. You must not use the app in any way that is unlawful or fraudulent.
                </p>

                <h2>3. Accounts</h2>
                <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
                </p>

                <h2>4. Orders and Payments</h2>
                <p>
                    You are responsible for all charges incurred in connection with your account. We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order, or other reasons.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                    In no event shall SwiftShop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>

                 <h2>6. Governing Law</h2>
                <p>
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at support@swiftshop.com.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}

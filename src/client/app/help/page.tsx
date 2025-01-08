import React from "react";

const HelpPage: React.FC = () => {
    return (
        <div className="bg-gray-50 text-gray-800">
            {/* Header Section */}
            <header className="bg-blue-600 text-white py-6 text-center">
                <h1 className="text-3xl font-bold">How Can We Help?</h1>
                <p className="mt-2">Find answers to your questions or contact our support team.</p>
                <div className="mt-4 max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search for answers, FAQs, or topics..."
                        className="w-full p-3 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </header>

            {/* Categories Section */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-semibold text-center mb-8">Browse Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Getting Started</h3>
                        <p>Learn how to set up and begin using our services.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Account Management</h3>
                        <p>Manage your account settings, passwords, and more.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Billing and Payments</h3>
                        <p>Find information about pricing, refunds, and invoices.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Troubleshooting</h3>
                        <p>Resolve common technical problems quickly.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Advanced Features</h3>
                        <p>Explore guides for power users and advanced workflows.</p>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="bg-gray-100 py-10 px-6">
                <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold cursor-pointer">How do I reset my password?</summary>
                        <p className="mt-2">To reset your password, click the “Forgot Password” link on the login page and follow the instructions.</p>
                    </details>
                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold cursor-pointer">How can I contact support?</summary>
                        <p className="mt-2">You can contact our support team via live chat, email, or phone. Visit the Contact Us page for details.</p>
                    </details>
                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold cursor-pointer">Why is my account locked?</summary>
                        <p className="mt-2">Your account may be locked due to multiple failed login attempts. Contact support to unlock it.</p>
                    </details>
                </div>
            </section>

            {/* Support Options Section */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-semibold text-center mb-8">Need More Help?</h2>
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                    <a
                        href="#"
                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500"
                    >
                        Live Chat
                    </a>
                    <a
                        href="mailto:support@example.com"
                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500"
                    >
                        Email Support
                    </a>
                    <a
                        href="#"
                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500"
                    >
                        Phone Support
                    </a>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-6 text-center">
                <p>&copy; 2025 ABC Banking. All rights reserved.</p>
                <p>
                    <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a> |
                    <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> |
                    <a href="#" className="text-blue-400 hover:underline">Feedback</a>
                </p>
            </footer>
        </div>
    );
};

export default HelpPage;

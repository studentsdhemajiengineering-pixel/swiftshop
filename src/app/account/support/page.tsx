
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, LifeBuoy, MessageSquare, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/layout/header';

const SupportHeader = () => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b md:hidden">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">Help & Support</h1>
            </div>
        </header>
    );
};

const faqItems = [
    { question: "How do I track my order?", answer: "You can track your order from the 'Order' tab in the bottom navigation. It provides real-time updates on your delivery status." },
    { question: "What are the delivery charges?", answer: "Delivery charges are ₹50 for all orders. This fee is waived for orders above ₹500." },
    { question: "How do I cancel my order?", answer: "Orders can be canceled within 5 minutes of placing them. Go to your order details and you will find the cancellation option." },
    { question: "How do I return an item?", answer: "We have a no-questions-asked return policy for most items within 24 hours of delivery. Please contact our support team to initiate a return." }
]

const contactOptions = [
    { icon: MessageSquare, label: "Chat with us", description: "Get instant help from our support team.", href: "https://wa.me/919876543210?text=I%20need%20help" },
    { icon: Phone, label: "Call us", description: "+1 800 123 4567", href: "tel:+18001234567" }
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className='hidden md:block'><Header /></div>
      <SupportHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight mb-6 hidden md:block">Help & Support</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                    <div className="space-y-4">
                        {contactOptions.map(option => (
                             <Link href={option.href} key={option.label} target="_blank">
                                <div className="flex items-center p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/60 mr-4">
                                        <option.icon className="h-6 w-6 text-secondary-foreground" />
                                    </div>
                                   <div className="flex-grow">
                                        <p className="font-medium">{option.label}</p>
                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function PhonePePaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const { dispatch } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentStatus('success');
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed.",
      });
      dispatch({ type: 'CLEAR_CART' });
    }, 3000); // Simulate 3 second payment processing time

    return () => clearTimeout(timer);
  }, [dispatch, toast]);

  useEffect(() => {
    if (paymentStatus === 'success') {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(countdownTimer);
        router.push('/');
      }

      return () => clearInterval(countdownTimer);
    }
  }, [paymentStatus, countdown, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-purple-600 text-white p-4">
      <div className="text-center bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-sm max-w-sm w-full">
        <Image src="https://placehold.co/100x100/white/6d28d9?text=P" alt="PhonePe" width={80} height={80} className="mx-auto mb-6 rounded-full" />
        
        {paymentStatus === 'processing' && (
          <>
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-purple-200 mb-6">Please wait, do not close this window.</p>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-white" />
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-green-300">Payment Successful!</h1>
            <p className="text-purple-200 mb-6">Your order has been placed.</p>
            <p className="text-sm">Redirecting to home page in {countdown} seconds...</p>
            <Button onClick={() => router.push('/')} variant="ghost" className="mt-4 hover:bg-white/20">
              Go to Home Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

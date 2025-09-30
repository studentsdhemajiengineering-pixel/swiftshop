
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countries = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
]

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signInWithPhoneNumber, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    if (!/^\+\d{10,14}$/.test(fullPhoneNumber)) {
        toast({
            title: 'Invalid Phone Number',
            description: 'Please enter a valid phone number.',
            variant: 'destructive',
        });
        return;
    }
    setLoading(true);
    try {
      await signInWithPhoneNumber(fullPhoneNumber);
      setStep('otp');
      toast({ title: 'OTP Sent!', description: `An OTP has been sent to ${fullPhoneNumber}.` });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to send OTP',
        description: 'Please try again. You might need to refresh the page.',
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
         toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits.', variant: 'destructive' });
         return;
    }
    setLoading(true);
    try {
      await verifyOtp(otp);
      toast({ title: 'Login successful!' });
      router.push('/account');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'The OTP is incorrect. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/20">
      <Card className="w-full max-w-sm">
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Login or Sign Up</CardTitle>
              <CardDescription>
                Enter your phone number to receive an OTP. <br />
                <span className="text-xs text-muted-foreground">(For demo, use phone <b>9876543210</b> and OTP <b>123456</b>)</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => (
                                <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                    />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || !phoneNumber}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
              <CardDescription>Enter the 6-digit OTP sent to {fullPhoneNumber}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode='numeric'
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
              <Button variant="link" size="sm" onClick={() => setStep('phone')} disabled={loading}>
                Change phone number
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
      {/* This container is required for the invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

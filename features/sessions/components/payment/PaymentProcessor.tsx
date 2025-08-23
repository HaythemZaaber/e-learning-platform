"use client";

import React, { useState, useEffect } from 'react';
import { useLiveSessionsStore } from '@/stores/liveSessions.store';
import { BookingRequest, PaymentIntent } from '@/features/sessions/types/session.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentProcessorProps {
  bookingRequest: BookingRequest;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentFailure: (error: string) => void;
  onCancel: () => void;
}

export function PaymentProcessor({ 
  bookingRequest, 
  onPaymentSuccess, 
  onPaymentFailure, 
  onCancel 
}: PaymentProcessorProps) {
  const { createPaymentIntent, updatePaymentStatus, formatPrice } = useLiveSessionsStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  useEffect(() => {
    // Initialize payment intent when component mounts
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setIsProcessing(true);
      const intent = await createPaymentIntent(
        bookingRequest.id,
        bookingRequest.offeredPrice,
        'USD'
      );
      setPaymentIntent(intent);
    } catch (error) {
      onPaymentFailure('Failed to initialize payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentIntent) {
      onPaymentFailure('Payment not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status to succeeded
      updatePaymentStatus(paymentIntent.id, 'succeeded');
      
      toast.success("Payment Successful", {
        description: "Your session has been booked successfully!",
      });
      
      onPaymentSuccess(paymentIntent);
    } catch (error) {
      updatePaymentStatus(paymentIntent.id, 'canceled');
      onPaymentFailure('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </CardTitle>
          <CardDescription>
            Secure payment for your live session booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Session Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Session:</span>
                <span className="font-medium">Live Learning Session</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">
                  {bookingRequest.sessionDate?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{bookingRequest.sessionTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <Badge variant="outline" className="text-xs">
                  {bookingRequest.sessionType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(bookingRequest.offeredPrice, 'USD')}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </Button>
              <Button
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('paypal')}
                className="flex-1"
              >
                PayPal
              </Button>
            </div>

            {paymentMethod === 'card' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      number: formatCardNumber(e.target.value)
                    })}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expiry: formatExpiry(e.target.value)
                      })}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                      })}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      name: e.target.value
                    })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay {formatPrice(bookingRequest.offeredPrice, 'USD')}
                    </>
                  )}
                </Button>
              </form>
            )}

            {paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
                <Button 
                  onClick={handlePaymentSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Redirecting to PayPal...
                    </>
                  ) : (
                    'Continue with PayPal'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Shield className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Cancellation Policy</p>
              <p>Free cancellation up to 24 hours before the session. No refunds within 12 hours.</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

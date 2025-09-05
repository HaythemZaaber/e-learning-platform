"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePaymentIntent, useConfirmPayment, usePaymentMethods, usePaymentErrorHandler } from "../../hooks/usePayment";
import { getStripe, formatAmountForDisplay } from "../../services/api/paymentApi";
import { CreatePaymentIntentRequest, ConfirmPaymentRequest } from "../../services/api/paymentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  Calendar,
  Clock,
  User,
  DollarSign,
  CreditCard as CreditCardIcon,
  Banknote,
  Wallet,
  Zap,
  Star,
  Award,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Globe,
  Settings,
  HelpCircle,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  ArrowRight,
  ArrowLeft,
  Home,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  Copy,
  Share,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Report,
  Block,
  Unblock,
  Mute,
  Unmute,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryEmpty,
  Power,
  PowerOff,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume1,
  Volume3,
  Maximize,
  Minimize,
  Fullscreen,
  FullscreenExit,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Unlink,
  Image,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FilePresentation,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSearch,
  
} from "lucide-react";
import { toast } from "sonner";

interface PaymentFormProps {
  amount: number;
  currency: string;
  bookingId: string;
  instructorId: string;
  sessionTitle: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: any) => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name?: string;
    email?: string;
  };
}

export function PaymentForm({
  amount,
  currency,
  bookingId,
  instructorId,
  sessionTitle,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}: PaymentFormProps) {
  const { user } = useAuth();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "confirm" | "processing" | "success" | "error">("select");

  // Hooks
  const createPaymentIntentMutation = useCreatePaymentIntent();
  const confirmPaymentMutation = useConfirmPayment();
  const { data: savedPaymentMethods, isLoading: loadingPaymentMethods } = usePaymentMethods();
  const { handlePaymentError } = usePaymentErrorHandler();

  // Stripe elements
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await getStripe();
      if (stripeInstance) {
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);
        
        const cardElementInstance = elementsInstance.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        });
        
        setCardElement(cardElementInstance);
      }
    };

    initializeStripe();
  }, []);

  // Mount card element
  useEffect(() => {
    if (cardElement && elements) {
      cardElement.mount('#card-element');
      return () => {
        cardElement.destroy();
      };
    }
  }, [cardElement, elements]);

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowNewCardForm(false);
  };

  // Handle new card selection
  const handleNewCardSelect = () => {
    setSelectedPaymentMethod("");
    setShowNewCardForm(true);
  };

  // Create payment intent
  const handleCreatePaymentIntent = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      const paymentIntentData: CreatePaymentIntentRequest = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        bookingId,
        instructorId,
        studentId: user.id,
        sessionTitle,
        metadata: {
          bookingId,
          instructorId,
          studentId: user.id,
          sessionTitle,
        },
      };

      const paymentIntent = await createPaymentIntentMutation.mutateAsync(paymentIntentData);
      
      // Confirm payment
      await handleConfirmPayment(paymentIntent.id);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      handlePaymentError(error);
      setPaymentStep("error");
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm payment
  const handleConfirmPayment = async (paymentIntentId: string) => {
    try {
      let confirmData: ConfirmPaymentRequest = {
        paymentIntentId,
        returnUrl: `${window.location.origin}/payment/success`,
      };

      if (selectedPaymentMethod) {
        confirmData.paymentMethodId = selectedPaymentMethod;
      } else if (showNewCardForm && stripe && cardElement) {
        // Handle new card payment
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: user?.firstName + ' ' + user?.lastName,
            email: user?.email,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        confirmData.paymentMethodId = paymentMethod.id;
      }

      const result = await confirmPaymentMutation.mutateAsync(confirmData);
      
      if (result.success) {
        setPaymentStep("success");
        onPaymentSuccess(paymentIntentId);
        toast.success("Payment completed successfully!");
      } else {
        throw new Error("Payment confirmation failed");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      handlePaymentError(error);
      setPaymentStep("error");
      onPaymentError(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod && !showNewCardForm) {
      toast.error("Please select a payment method");
      return;
    }

    await handleCreatePaymentIntent();
  };

  // Render payment method option
  const renderPaymentMethodOption = (method: PaymentMethod) => {
    const isSelected = selectedPaymentMethod === method.id;
    
    return (
      <div
        key={method.id}
        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handlePaymentMethodSelect(method.id)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {method.card?.brand?.toUpperCase()} •••• {method.card?.last4}
              </span>
              <Badge variant="outline" className="text-xs">
                {method.card?.exp_month}/{method.card?.exp_year}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {method.billing_details.name}
            </p>
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-blue-600" />
          )}
        </div>
      </div>
    );
  };

  // Render payment steps
  const renderPaymentStep = () => {
    switch (paymentStep) {
      case "select":
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium">{sessionTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatAmountForDisplay(amount, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Processing fee:</span>
                  <span>Included</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatAmountForDisplay(amount, currency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Payment Methods */}
                {!loadingPaymentMethods && savedPaymentMethods && savedPaymentMethods.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Saved Payment Methods</h4>
                    {savedPaymentMethods.map(renderPaymentMethodOption)}
                  </div>
                )}

                {/* New Card Option */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    showNewCardForm 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={handleNewCardSelect}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">Use a new payment method</span>
                      <p className="text-sm text-gray-600">
                        Add a new credit or debit card
                      </p>
                    </div>
                    {showNewCardForm && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>

                {/* New Card Form */}
                {showNewCardForm && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <Label htmlFor="card-element" className="text-sm font-medium text-gray-700 mb-2 block">
                      Card Details
                    </Label>
                    <div id="card-element" className="p-3 border border-gray-300 rounded-md bg-white" />
                    <p className="text-xs text-gray-500 mt-2">
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  <span className="text-sm">
                    Your payment is secured with bank-level encryption
                  </span>
                </div>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing || (!selectedPaymentMethod && !showNewCardForm)}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatAmountForDisplay(amount, currency)}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        );

      case "processing":
        return (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mb-4" />
            <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
            <p className="text-gray-600">
              Please wait while we process your payment securely...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your session has been booked successfully. You'll receive a confirmation email shortly.
            </p>
            <Button onClick={() => window.location.href = '/student/sessions'}>
              View My Sessions
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact support.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setPaymentStep("select")}>
                Try Again
              </Button>
              <Button onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderPaymentStep()}
    </div>
  );
}

// Missing Separator component
const Separator = () => <div className="border-t border-gray-200 my-4" />;


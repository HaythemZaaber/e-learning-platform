"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Loader2,
  Shield,
  DollarSign,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Info
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { stripeConnectApi } from "../../services/api/stripeConnectApi";

interface StripeConnectSetupProps {
  onSetupComplete: () => void;
}

interface StripeAccountStatus {
  hasAccount: boolean;
  isComplete: boolean;
  accountId?: string;
  requirements?: any;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
}

export function StripeConnectSetup({ onSetupComplete }: StripeConnectSetupProps) {
  const { user, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    country: "US",
    email: user?.email || "",
    businessType: "individual" as "individual" | "company",
    individual: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      address: {
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US"
      },
      dob: {
        day: 1,
        month: 1,
        year: 1990
      }
    },
    company: {
      name: "",
      phone: "",
      address: {
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US"
      }
    }
  });

  // Check Stripe Connect account status on component mount
  useEffect(() => {
    checkStripeAccountStatus();
  }, []);

  const checkStripeAccountStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const token = await getAuthToken();
      
      if (!token) {
        setAccountStatus({
          hasAccount: false,
          isComplete: false
        });
        return;
      }

      const data = await stripeConnectApi.getStripeConnectAccount(token);
      
      if (data.success && data.account) {
        const isComplete = data.account.charges_enabled && 
                         data.account.payouts_enabled && 
                         data.account.details_submitted;
        
        setAccountStatus({
          hasAccount: true,
          isComplete,
          accountId: data.account.id,
          requirements: data.account.requirements,
          chargesEnabled: data.account.charges_enabled,
          payoutsEnabled: data.account.payouts_enabled,
          detailsSubmitted: data.account.details_submitted
        });

        if (isComplete) {
          onSetupComplete();
        }
      } else {
        setAccountStatus({
          hasAccount: false,
          isComplete: false
        });
      }
    } catch (error) {
      console.error("Error checking Stripe Connect status:", error);
      setAccountStatus({
        hasAccount: false,
        isComplete: false
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const getAuthToken = async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };



  const createStripeAccount = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      
      if (!token) {
        toast.error("Authentication token not available");
        return;
      }
      
      // Validate form data before sending
      if (!formData.businessType || !formData.email || !formData.country) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Ensure business type is valid
      if (formData.businessType === 'individual' && (!formData.individual.firstName || !formData.individual.lastName)) {
        toast.error("Please fill in your first and last name");
        return;
      }
      
      const data = await stripeConnectApi.createStripeConnectAccount(formData, token);

      if (data.success && data.accountLink) {
        // Redirect to Stripe Connect onboarding
        window.location.href = data.accountLink;
      } else {
        toast.error(data.error || "Failed to create Stripe Connect account");
      }
    } catch (error) {
      console.error("Error creating Stripe Connect account:", error);
      toast.error("Failed to create Stripe Connect account");
    } finally {
      setIsLoading(false);
    }
  };

  const continueOnboarding = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      
      if (!token) {
        toast.error("Authentication token not available");
        return;
      }

      const data = await stripeConnectApi.createStripeConnectAccountLink(token);

      if (data.success && data.accountLink) {
        // Redirect to Stripe Connect onboarding
        window.location.href = data.accountLink;
      } else {
        toast.error(data.error || "Failed to create onboarding link");
      }
    } catch (error) {
      console.error("Error creating onboarding link:", error);
      toast.error("Failed to create onboarding link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking payment setup status...</p>
        </div>
      </div>
    );
  }

  // Account is complete
  if (accountStatus?.isComplete) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            Payment Processing Set Up Complete
          </CardTitle>
          <CardDescription className="text-green-700">
            Your Stripe Connect account is fully configured and ready to receive payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Account Verified
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Payments Enabled
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Payouts Enabled
              </Badge>
            </div>
            
            <div className="text-sm text-green-700">
              <p>You can now receive payments from students for your sessions.</p>
              <p>Payouts will be automatically processed to your connected bank account.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Account exists but incomplete
  if (accountStatus?.hasAccount && !accountStatus?.isComplete) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-6 w-6" />
            Complete Your Payment Setup
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Your Stripe Connect account needs additional information to be fully activated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  accountStatus.chargesEnabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {accountStatus.chargesEnabled ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <p className="text-sm font-medium">Payments</p>
                <p className="text-xs text-gray-600">
                  {accountStatus.chargesEnabled ? 'Enabled' : 'Pending'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  accountStatus.payoutsEnabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {accountStatus.payoutsEnabled ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <p className="text-sm font-medium">Payouts</p>
                <p className="text-xs text-gray-600">
                  {accountStatus.payoutsEnabled ? 'Enabled' : 'Pending'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  accountStatus.detailsSubmitted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {accountStatus.detailsSubmitted ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <p className="text-sm font-medium">Details</p>
                <p className="text-xs text-gray-600">
                  {accountStatus.detailsSubmitted ? 'Submitted' : 'Required'}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-sm text-yellow-700">
              <p>To complete your setup, you need to provide additional information to Stripe.</p>
            </div>
            
            <Button 
              onClick={continueOnboarding}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No account exists - show creation form
  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Set Up Payment Processing
          </CardTitle>
          <CardDescription>
            Create your Stripe Connect account to start receiving payments from students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); createStripeAccount(); }} className="space-y-6">
            {/* Business Type Selection */}
            <div className="space-y-4">
              <Label>Business Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.businessType === 'individual' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, businessType: 'individual' }))}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Individual</p>
                      <p className="text-sm text-gray-600">Personal business or freelancer</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.businessType === 'company' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, businessType: 'company' }))}
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Company</p>
                      <p className="text-sm text-gray-600">Registered business entity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your-email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Individual Information */}
            {formData.businessType === 'individual' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.individual.firstName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        individual: { ...prev.individual, firstName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.individual.lastName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        individual: { ...prev.individual, lastName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.individual.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      individual: { ...prev.individual, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            )}

            {/* Company Information */}
            {formData.businessType === 'company' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={formData.company.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      company: { ...prev.company, name: e.target.value }
                    }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.company.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      company: { ...prev.company, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            )}

            {/* Security Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your information is securely transmitted to Stripe for account verification. 
                We never store your sensitive financial information.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Initial state - show setup prompt
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Payment Processing Setup Required
        </CardTitle>
        <CardDescription>
          Set up your payment processing account to start receiving payments from students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Receive Payments</h4>
              <p className="text-sm text-blue-600">Get paid directly to your bank account</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-green-800">Secure & Compliant</h4>
              <p className="text-sm text-green-600">PCI DSS compliant payment processing</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Automatic Payouts</h4>
              <p className="text-sm text-purple-600">Scheduled transfers to your account</p>
            </div>
          </div>

          {/* Setup Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Setup Process</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <span className="text-sm">Create your Stripe Connect account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <span className="text-sm">Complete identity verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <span className="text-sm">Connect your bank account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">4</span>
                </div>
                <span className="text-sm">Start receiving payments</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This process is handled securely by Stripe, a trusted payment processor used by millions of businesses worldwide.
            </AlertDescription>
          </Alert>

          {/* Action Button */}
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Set Up Payment Processing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

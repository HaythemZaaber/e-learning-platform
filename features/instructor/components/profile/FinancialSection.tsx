"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstructorProfile, PayoutSettings, TaxInformation, PaymentPreferences } from "@/types/instructorTypes";
import { 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Settings, 
  Shield,
  Bell,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  TrendingUp,
  PiggyBank,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FinancialSectionProps {
  profile: InstructorProfile;
  isEditMode: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<InstructorProfile>) => void;
}

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Building, description: "Direct bank deposit" },
  { value: "paypal", label: "PayPal", icon: CreditCard, description: "PayPal account" },
  { value: "stripe", label: "Stripe", icon: CreditCard, description: "Stripe account" }
];

const PAYOUT_FREQUENCIES = [
  { value: "weekly", label: "Weekly", description: "Every week" },
  { value: "monthly", label: "Monthly", description: "Once per month" },
  { value: "quarterly", label: "Quarterly", description: "Every 3 months" }
];

const CURRENCIES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY", "INR", "BRL", 
  "MXN", "SGD", "HKD", "NOK", "SEK", "DKK", "PLN", "CZK", "HUF", "RON"
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "SG", name: "Singapore" }
];

export default function FinancialSection({ 
  profile, 
  isEditMode, 
  isPreviewMode, 
  onUpdate
}: FinancialSectionProps) {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isValidatingBank, setIsValidatingBank] = useState(false);

  const currentPayoutSettings = profile.payoutSettings as PayoutSettings || {
    currency: "USD",
    minimumPayout: 50,
    preferredMethod: "bank_transfer"
  };

  const currentTaxInfo = profile.taxInformation as TaxInformation || {
    country: "US",
    taxStatus: "individual"
  };

  const currentPaymentPrefs = profile.paymentPreferences as PaymentPreferences || {
    autoPayout: false,
    payoutFrequency: "monthly",
    notificationEmail: ""
  };

  const updatePayoutSettings = (field: keyof PayoutSettings, value: any) => {
    const updated = { ...currentPayoutSettings, [field]: value };
    onUpdate({ payoutSettings: updated });
    
    if (field === 'preferredMethod') {
      toast.success(`Payment method updated to ${PAYMENT_METHODS.find(m => m.value === value)?.label}`);
    }
  };

  const updateTaxInformation = (field: keyof TaxInformation, value: any) => {
    const updated = { ...currentTaxInfo, [field]: value };
    onUpdate({ taxInformation: updated });
    toast.success("Tax information updated");
  };

  const updatePaymentPreferences = (field: keyof PaymentPreferences, value: any) => {
    const updated = { ...currentPaymentPrefs, [field]: value };
    onUpdate({ paymentPreferences: updated });
    
    if (field === 'autoPayout') {
      toast.success(value ? "Auto-payout enabled" : "Auto-payout disabled");
    }
  };

  const updateRevenueSharing = (value: string) => {
    const numValue = parseFloat(value);
    onUpdate({ revenueSharing: numValue });
  };

  const validateBankDetails = async () => {
    setIsValidatingBank(true);
    toast.loading("Validating bank details...", { id: "bank-validation" });
    
    // Simulate bank validation
    setTimeout(() => {
      setIsValidatingBank(false);
      toast.success("Bank details validated successfully", { id: "bank-validation" });
    }, 2000);
  };

  const getFinancialHealthScore = () => {
    let score = 0;
    if (currentPayoutSettings.preferredMethod) score += 25;
    if (currentTaxInfo.country && currentTaxInfo.taxStatus) score += 25;
    if (currentPaymentPrefs.notificationEmail) score += 25;
    if (profile.revenueSharing && profile.revenueSharing >= 70) score += 25;
    return score;
  };

  const financialHealthScore = getFinancialHealthScore();

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {profile.revenueSharing || 70}%
                </div>
                <div className="text-sm text-gray-600">Revenue Share</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  ${currentPayoutSettings.minimumPayout}
                </div>
                <div className="text-sm text-gray-600">Min Payout</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {currentPayoutSettings.currency}
                </div>
                <div className="text-sm text-gray-600">Currency</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  ${(profile.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Financial Setup Completion</span>
                <span className="text-sm font-bold text-green-600">{financialHealthScore}%</span>
              </div>
              <Progress value={financialHealthScore} className="h-2" />
              <p className="text-xs text-gray-600">
                {financialHealthScore === 100 
                  ? "Your financial setup is complete!" 
                  : "Complete your financial setup to receive payments"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Sharing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-blue-600" />
              Revenue Sharing Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="revenue-sharing" className="text-sm font-medium">
                    Your Revenue Share Percentage
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      id="revenue-sharing"
                      type="number"
                      value={profile.revenueSharing || 70}
                      onChange={(e) => updateRevenueSharing(e.target.value)}
                      min="50"
                      max="90"
                      step="5"
                      className="w-24"
                    />
                    <span className="text-lg font-medium">%</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Platform fee: {100 - (profile.revenueSharing || 70)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Higher percentages may be available based on performance and volume
                  </p>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Revenue sharing changes take effect from your next payout cycle.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{profile.revenueSharing || 70}%</div>
                    <div className="text-sm text-blue-700">You keep this percentage</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-600">{100 - (profile.revenueSharing || 70)}%</div>
                    <div className="text-sm text-gray-500">Platform fee</div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    💡 Excellent revenue share! You're keeping more of what you earn.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payout Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-purple-600" />
              Payout Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Payout Currency
                    </Label>
                    <Select 
                      value={currentPayoutSettings.currency} 
                      onValueChange={(value) => updatePayoutSettings('currency', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="minimum-payout" className="text-sm font-medium">
                      Minimum Payout Amount
                    </Label>
                    <Input
                      id="minimum-payout"
                      type="number"
                      value={currentPayoutSettings.minimumPayout}
                      onChange={(e) => updatePayoutSettings('minimumPayout', parseInt(e.target.value))}
                      min="10"
                      step="10"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum amount before payout is processed
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Preferred Payment Method</Label>
                  <div className="grid gap-3 mt-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      const isSelected = currentPayoutSettings.preferredMethod === method.value;
                      
                      return (
                        <motion.div
                          key={method.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50 shadow-md' 
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                            }`}
                            onClick={() => updatePayoutSettings('preferredMethod', method.value)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Icon className={`h-6 w-6 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                                <div className="flex-1">
                                  <div className="font-medium">{method.label}</div>
                                  <div className="text-sm text-gray-500">{method.description}</div>
                                </div>
                                {isSelected && <CheckCircle className="h-5 w-5 text-purple-600" />}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {currentPayoutSettings.preferredMethod === "bank_transfer" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Bank Account Details
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label htmlFor="account-holder" className="text-sm">Account Holder Name</Label>
                        <Input
                          id="account-holder"
                          value={currentPayoutSettings.bankDetails?.accountHolderName || ""}
                          onChange={(e) => updatePayoutSettings('bankDetails', {
                            ...currentPayoutSettings.bankDetails,
                            accountHolderName: e.target.value
                          })}
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-number" className="text-sm">Account Number</Label>
                        <div className="relative mt-1">
                          <Input
                            id="account-number"
                            type={showSensitiveData ? "text" : "password"}
                            value={currentPayoutSettings.bankDetails?.accountNumber || ""}
                            onChange={(e) => updatePayoutSettings('bankDetails', {
                              ...currentPayoutSettings.bankDetails,
                              accountNumber: e.target.value
                            })}
                            placeholder="1234567890"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => setShowSensitiveData(!showSensitiveData)}
                          >
                            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="routing-number" className="text-sm">Routing Number</Label>
                        <Input
                          id="routing-number"
                          value={currentPayoutSettings.bankDetails?.routingNumber || ""}
                          onChange={(e) => updatePayoutSettings('bankDetails', {
                            ...currentPayoutSettings.bankDetails,
                            routingNumber: e.target.value
                          })}
                          placeholder="021000021"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={validateBankDetails}
                          disabled={isValidatingBank}
                          className="w-full"
                        >
                          {isValidatingBank ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          {isValidatingBank ? "Validating..." : "Validate Details"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Currency:</span>
                    <Badge variant="outline">{currentPayoutSettings.currency}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Minimum Payout:</span>
                    <span className="font-medium">${currentPayoutSettings.minimumPayout}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const method = PAYMENT_METHODS.find(m => m.value === currentPayoutSettings.preferredMethod);
                      const Icon = method?.icon || CreditCard;
                      return (
                        <>
                          <Icon className="h-6 w-6 text-purple-600" />
                          <div>
                            <div className="font-medium text-purple-900">{method?.label || "Bank Transfer"}</div>
                            <div className="text-sm text-purple-700">{method?.description || "Direct bank deposit"}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-orange-600" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-orange-800">
                    Tax information is encrypted and securely stored. We use this for tax reporting compliance.
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="tax-country" className="text-sm font-medium">Tax Country</Label>
                    <Select 
                      value={currentTaxInfo.country} 
                      onValueChange={(value) => updateTaxInformation('country', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tax-status" className="text-sm font-medium">Tax Status</Label>
                    <Select 
                      value={currentTaxInfo.taxStatus} 
                      onValueChange={(value) => updateTaxInformation('taxStatus', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="tax-id" className="text-sm font-medium">Tax ID / SSN</Label>
                    <div className="relative mt-1">
                      <Input
                        id="tax-id"
                        type={showSensitiveData ? "text" : "password"}
                        value={currentTaxInfo.taxId || ""}
                        onChange={(e) => updateTaxInformation('taxId', e.target.value)}
                        placeholder="123-45-6789"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowSensitiveData(!showSensitiveData)}
                      >
                        {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="vat-number" className="text-sm font-medium">VAT Number (if applicable)</Label>
                    <Input
                      id="vat-number"
                      value={currentTaxInfo.vatNumber || ""}
                      onChange={(e) => updateTaxInformation('vatNumber', e.target.value)}
                      placeholder="VAT123456789"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Country:</span>
                    <Badge variant="outline">
                      {COUNTRIES.find(c => c.code === currentTaxInfo.country)?.name || currentTaxInfo.country}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {currentTaxInfo.taxStatus}
                    </Badge>
                  </div>
                </div>
                
                {currentTaxInfo.taxId && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-800 font-medium">Tax ID on file</span>
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-xs text-orange-700 mt-1">Your tax information is securely stored</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-teal-600" />
              Payment Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div>
                    <Label htmlFor="auto-payout" className="text-sm font-medium text-teal-900">
                      Automatic Payouts
                    </Label>
                    <p className="text-sm text-teal-700 mt-1">
                      Automatically process payouts when minimum amount is reached
                    </p>
                  </div>
                  <Switch
                    id="auto-payout"
                    checked={currentPaymentPrefs.autoPayout}
                    onCheckedChange={(checked) => updatePaymentPreferences('autoPayout', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payout-frequency" className="text-sm font-medium">
                    Payout Frequency
                  </Label>
                  <Select 
                    value={currentPaymentPrefs.payoutFrequency} 
                    onValueChange={(value) => updatePaymentPreferences('payoutFrequency', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYOUT_FREQUENCIES.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          <div>
                            <div>{freq.label}</div>
                            <div className="text-xs text-gray-500">{freq.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notification-email" className="text-sm font-medium">
                    Payout Notification Email
                  </Label>
                  <Input
                    id="notification-email"
                    type="email"
                    value={currentPaymentPrefs.notificationEmail}
                    onChange={(e) => updatePaymentPreferences('notificationEmail', e.target.value)}
                    placeholder="payouts@yourcompany.com"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Get notified when payouts are processed
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Auto Payouts:</span>
                    <Badge variant={currentPaymentPrefs.autoPayout ? "default" : "secondary"}>
                      {currentPaymentPrefs.autoPayout ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Frequency:</span>
                    <Badge variant="outline" className="capitalize">
                      {currentPaymentPrefs.payoutFrequency}
                    </Badge>
                  </div>
                </div>
                
                {currentPaymentPrefs.notificationEmail && (
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-medium text-teal-900">Notifications enabled</span>
                    </div>
                    <p className="text-xs text-teal-700 mt-1">{currentPaymentPrefs.notificationEmail}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
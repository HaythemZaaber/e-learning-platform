"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
  Eye,
  EyeOff,
  Info,
  Lock,
  Users,
  Scale,
  Globe,
  FileText,
  CheckSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface BackgroundCheckProps {
  data : any;
  updateData: (data: any) => void;
}

const backgroundCheckTypes = [
  {
    id: "backgroundCheck",
    title: "General Background Check",
    description:
      "Comprehensive background check including employment history, education verification, and professional references.",
    icon: Shield,
    required: true,
    processingTime: "3-5 business days",
    severity: "medium",
  },
  {
    id: "criminalHistory",
    title: "Criminal History Check",
    description:
      "Criminal background check to ensure student safety. Includes checking for any criminal convictions.",
    icon: AlertTriangle,
    required: true,
    processingTime: "2-4 business days",
    severity: "high",
  },
  {
    id: "childProtection",
    title: "Child Protection Screening",
    description:
      "Additional screening required if you plan to teach students under 18. Includes specialized background checks for child safety.",
    icon: Users,
    required: false,
    processingTime: "5-7 business days",
    severity: "high",
  },
  {
    id: "socialMedia",
    title: "Social Media Background Check",
    description:
      "Review of publicly available social media profiles to ensure alignment with platform values and professional standards.",
    icon: Globe,
    required: true,
    processingTime: "1-2 business days",
    severity: "low",
  },
  {
    id: "dataProcessing",
    title: "Data Processing Consent",
    description:
      "Consent to process your personal data for verification purposes in accordance with our privacy policy and applicable data protection laws.",
    icon: Lock,
    required: true,
    processingTime: "Immediate",
    severity: "medium",
  },
];

const platformAgreements = [
  {
    id: "termsOfService",
    title: "Terms of Service Agreement",
    description:
      "Platform's Terms of Service, including instructor responsibilities and platform usage guidelines.",
    icon: FileText,
    category: "Legal",
    lastUpdated: "March 2024",
    pages: 12,
  },
  {
    id: "contentGuidelines",
    title: "Content Creation Guidelines",
    description:
      "Content creation guidelines, including quality standards, appropriate content policies, and copyright compliance.",
    icon: FileCheck,
    category: "Content",
    lastUpdated: "February 2024",
    pages: 8,
  },
  {
    id: "revenueSharing",
    title: "Revenue Sharing Agreement",
    description:
      "Revenue sharing model, payment terms, and fee structure for course sales and subscriptions.",
    icon: Scale,
    category: "Financial",
    lastUpdated: "January 2024",
    pages: 6,
  },
  {
    id: "codeOfConduct",
    title: "Instructor Code of Conduct",
    description:
      "Professional standards, student respect guidelines, and platform's values and ethical guidelines.",
    icon: CheckSquare,
    category: "Ethics",
    lastUpdated: "March 2024",
    pages: 4,
  },
  {
    id: "intellectualProperty",
    title: "Intellectual Property Rights",
    description:
      "Rights and responsibilities regarding course content ownership, licensing, and intellectual property protection.",
    icon: Shield,
    category: "Legal",
    lastUpdated: "February 2024",
    pages: 10,
  },
  {
    id: "privacyPolicy",
    title: "Privacy Policy Acknowledgment",
    description:
      "How personal data and student data will be collected, used, and protected according to the privacy policy.",
    icon: Lock,
    category: "Privacy",
    lastUpdated: "March 2024",
    pages: 14,
  },
];

export function BackgroundCheck({ data, updateData }: BackgroundCheckProps) {
  const [activeTab, setActiveTab] = useState("consent");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [processingEstimate, setProcessingEstimate] =
    useState("3-7 business days");

  const [consents, setConsents] = useState({
    backgroundCheck: false,
    criminalHistory: false,
    childProtection: false,
    socialMedia: false,
    dataProcessing: false,
    ...data.consents,
  });

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    contentGuidelines: false,
    revenueSharing: false,
    codeOfConduct: false,
    intellectualProperty: false,
    privacyPolicy: false,
    ...data.agreements,
  });

  const handleConsentChange = (key: string, checked: boolean) => {
    const updatedConsents = { ...consents, [key]: checked };
    setConsents(updatedConsents);
    updateData({
      consents: updatedConsents,
      verificationStatus:
        allConsentsGiven && allAgreementsAccepted ? "completed" : "in-progress",
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAgreementChange = (key: string, checked: boolean) => {
    const updatedAgreements = { ...agreements, [key]: checked };
    setAgreements(updatedAgreements);
    updateData({
      agreements: updatedAgreements,
      verificationStatus:
        allConsentsGiven && allAgreementsAccepted ? "completed" : "in-progress",
      lastUpdated: new Date().toISOString(),
    });
  };

  const toggleDetails = (id: string) => {
    setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);
  const allAgreementsAccepted = Object.values(agreements).every(Boolean);
  const consentProgress =
    (Object.values(consents).filter(Boolean).length /
      Object.values(consents).length) *
    100;
  const agreementProgress =
    (Object.values(agreements).filter(Boolean).length /
      Object.values(agreements).length) *
    100;

  useEffect(() => {
    // Calculate processing time estimate based on selected checks
    const maxTime = Math.max(
      ...backgroundCheckTypes
        .filter((check) => consents[check.id as keyof typeof consents])
        .map((check) => {
          const days = check.processingTime.match(/\d+/g);
          return days ? Math.max(...days.map(Number)) : 1;
        })
    );
    setProcessingEstimate(
      `${maxTime > 1 ? maxTime : 3}-${maxTime + 2} business days`
    );
  }, [consents]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Background Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">
                  {Math.round(consentProgress)}%
                </span>
              </div>
              <Progress value={consentProgress} className="h-2" />
              <p className="text-xs text-gray-600">
                {Object.values(consents).filter(Boolean).length} of{" "}
                {Object.values(consents).length} consents provided
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="h-5 w-5 text-green-600" />
              Platform Agreements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">
                  {Math.round(agreementProgress)}%
                </span>
              </div>
              <Progress value={agreementProgress} className="h-2" />
              <p className="text-xs text-gray-600">
                {Object.values(agreements).filter(Boolean).length} of{" "}
                {Object.values(agreements).length} agreements accepted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Time Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Processing Time:</strong> Background verification typically
          takes {processingEstimate} to complete. You'll receive email
          notifications at each step of the process.
        </AlertDescription>
      </Alert>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 h-12">
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Background Checks
            {allConsentsGiven && (
              <CheckCircle className="h-3 w-3 text-green-600" />
            )}
          </TabsTrigger>
          <TabsTrigger value="agreements" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Platform Agreements
            {allAgreementsAccepted && (
              <CheckCircle className="h-3 w-3 text-green-600" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Background Check Consent
              </CardTitle>
              <CardDescription>
                We require your consent to perform necessary background checks
                to ensure platform safety and maintain trust in our community.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {backgroundCheckTypes.map((check) => {
                  const Icon = check.icon;
                  const isChecked = consents[check.id as keyof typeof consents];

                  return (
                    <div
                      key={check.id}
                      className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                        isChecked
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={check.id}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleConsentChange(check.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={check.id}
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  isChecked ? "text-green-600" : "text-gray-500"
                                }`}
                              />
                              {check.title}
                              {check.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Required
                                </Badge>
                              )}
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleDetails(check.id)}
                              className="h-6 px-2"
                            >
                              {showDetails[check.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          <p className="text-sm text-gray-600">
                            {check.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {check.processingTime}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getSeverityColor(
                                check.severity
                              )}`}
                            >
                              {check.severity} priority
                            </Badge>
                          </div>

                          {showDetails[check.id] && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                              <h5 className="font-medium text-xs mb-2">
                                What this check includes:
                              </h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {check.id === "backgroundCheck" && (
                                  <>
                                    <li>• Employment history verification</li>
                                    <li>• Educational credentials check</li>
                                    <li>• Professional reference contacts</li>
                                    <li>• Identity document verification</li>
                                  </>
                                )}
                                {check.id === "criminalHistory" && (
                                  <>
                                    <li>• National criminal database search</li>
                                    <li>• Sex offender registry check</li>
                                    <li>• County court records review</li>
                                    <li>• Federal criminal records search</li>
                                  </>
                                )}
                                {check.id === "childProtection" && (
                                  <>
                                    <li>• Child abuse registry check</li>
                                    <li>• Specialized background screening</li>
                                    <li>• Additional reference verification</li>
                                    <li>• Teaching credential validation</li>
                                  </>
                                )}
                                {check.id === "socialMedia" && (
                                  <>
                                    <li>
                                      • Public social media profile review
                                    </li>
                                    <li>• Professional conduct assessment</li>
                                    <li>• Content appropriateness check</li>
                                    <li>• Platform values alignment review</li>
                                  </>
                                )}
                                {check.id === "dataProcessing" && (
                                  <>
                                    <li>• Personal data collection consent</li>
                                    <li>• GDPR compliance acknowledgment</li>
                                    <li>• Data retention policy agreement</li>
                                    <li>• Third-party sharing limitations</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">
                      Important Information
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Background checks are conducted by certified
                        third-party providers
                      </li>
                      <li>
                        • All data is processed securely and in compliance with
                        privacy laws
                      </li>
                      <li>
                        • Results are used solely for platform safety and
                        instructor verification
                      </li>
                      <li>
                        • You have the right to access and correct your
                        information
                      </li>
                      <li>
                        • Additional documentation may be requested during the
                        process
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {allConsentsGiven && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>All consents provided!</strong> Your background
                    check will begin processing after you submit your
                    verification. You'll receive email updates throughout the
                    process.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-600" />
                Platform Agreements
              </CardTitle>
              <CardDescription>
                Please review and accept all platform policies and agreements to
                complete your verification process.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {platformAgreements.map((agreement) => {
                  const Icon = agreement.icon;
                  const isChecked =
                    agreements[agreement.id as keyof typeof agreements];

                  return (
                    <div
                      key={agreement.id}
                      className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                        isChecked
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={agreement.id}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleAgreementChange(
                              agreement.id,
                              checked as boolean
                            )
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={agreement.id}
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  isChecked ? "text-green-600" : "text-gray-500"
                                }`}
                              />
                              {agreement.title}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {agreement.category}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Read
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600">
                            {agreement.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Last updated: {agreement.lastUpdated}</span>
                            <span>{agreement.pages} pages</span>
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">
                      Agreement Summary
                    </h4>
                    <p className="text-sm text-blue-800">
                      By accepting these agreements, you commit to maintaining
                      high standards as an instructor on our platform. These
                      agreements protect both instructors and students, ensuring
                      a safe and professional learning environment. All
                      agreements are legally binding and form part of your
                      instructor contract.
                    </p>
                  </div>
                </div>
              </div>

              {allAgreementsAccepted && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>All agreements accepted!</strong> You've
                    successfully completed the platform agreements section. You
                    can now proceed to submit your verification.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Verification Summary */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Verification Summary
              </CardTitle>
              <CardDescription>
                Review your progress before final submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-medium text-sm">
                        Background Check Consents
                      </span>
                      <p className="text-xs text-gray-600">
                        {Object.values(consents).filter(Boolean).length} of{" "}
                        {Object.values(consents).length} consents provided
                      </p>
                    </div>
                  </div>
                  {allConsentsGiven ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-medium text-sm">
                        Platform Agreements
                      </span>
                      <p className="text-xs text-gray-600">
                        {Object.values(agreements).filter(Boolean).length} of{" "}
                        {Object.values(agreements).length} agreements accepted
                      </p>
                    </div>
                  </div>
                  {allAgreementsAccepted ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                </div>

                {allConsentsGiven && allAgreementsAccepted && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Ready for Submission</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      All requirements completed. Your background check and
                      compliance verification is ready for final submission.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

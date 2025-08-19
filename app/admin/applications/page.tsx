"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SUBMITTED_APPLICATIONS } from '@/graphql/queries/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Search,
  Filter,
  Eye,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Zap,
  Award,
  AlertCircle,
  Timer,
  ArrowRight
} from 'lucide-react';
import { showToast } from '@/utils/toast';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  submittedAt: string;
  lastSavedAt: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  subjectsToTeach: string[];
  teachingMotivation: string;
  applicationDocuments: Array<{
    id: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadDate: string;
    verificationStatus: string;
  }>;
  aiVerification?: {
    id: string;
    overallScore: number;
    confidence: number;
    verificationResults: any;
    reviewedAt: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
}

// Enhanced Application Card Component (same as dashboard)
const ApplicationCard = ({ application, onViewClick, isLoading = false }: { 
  application: Application; 
  onViewClick: (id: string) => void;
  isLoading?: boolean;
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <FileText className="w-4 h-4" />,
          label: 'New Submission'
        };
      case 'UNDER_REVIEW':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Under Review'
        };
      case 'APPROVED':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Approved'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Rejected'
        };
      case 'REQUIRES_MORE_INFO':
        return {
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Needs Info'
        };
      default:
        return {
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <FileText className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(application.status);
  const daysSinceSubmission = application.submittedAt 
    ? Math.ceil((new Date().getTime() - new Date(application.submittedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const urgencyLevel = daysSinceSubmission > 7 ? 'high' : daysSinceSubmission > 3 ? 'medium' : 'low';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600 mb-4">
      <CardContent className="p-6 py-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                {application.user?.profileImage ? (
                  <img
                    src={application.user.profileImage}
                    alt={application.fullName || 'User'}
                    className="w-14 h-14 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <Users className={`w-7 h-7 text-blue-600 ${application.user?.profileImage ? 'hidden' : ''}`} />
              </div>
              {urgencyLevel === 'high' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {application.fullName || `${application.user?.firstName || ''} ${application.user?.lastName || ''}`.trim() || 'Unknown User'}
                </h3>
                <Badge className={`${statusInfo.color} border`}>
                  {statusInfo.icon}
                  <span className="ml-1.5">{statusInfo.label}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="truncate">{application.email || 'No email'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{application.phoneNumber || 'No phone'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                  <span className="truncate">{application.currentJobTitle || 'No job title'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Award className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{application.yearsOfExperience || 0} years exp.</span>
                </div>
              </div>

              {application.subjectsToTeach && Array.isArray(application.subjectsToTeach) && application.subjectsToTeach.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center text-sm text-slate-600 mb-2">
                    <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-medium">Teaching Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {application.subjectsToTeach.slice(0, 3).map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {subject}
                      </Badge>
                    ))}
                    {application.subjectsToTeach.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        +{application.subjectsToTeach.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {application.aiVerification && (
                <div className="flex items-center text-sm text-slate-600">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>AI Score: </span>
                  <span className={`ml-1 font-medium ${
                    application.aiVerification.overallScore >= 80 ? 'text-emerald-600' :
                    application.aiVerification.overallScore >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {application.aiVerification.overallScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              size="sm" 
              onClick={() => onViewClick(application.id)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-1.5" />
              )}
              {isLoading ? 'Loading...' : 'Review'}
            </Button>
            
            {application.status === 'SUBMITTED' && (
              <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <Timer className="w-3 h-3 mr-1" />
                Urgent
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Submitted {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
            <span>•</span>
            <span className={`${urgencyLevel === 'high' ? 'text-red-600 font-medium' : ''}`}>
              {daysSinceSubmission} days ago
            </span>
          </div>
          
          {application.applicationDocuments && application.applicationDocuments.length > 0 && (
            <div className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              <span>{application.applicationDocuments.length} documents</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ApplicationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [displayLimit, setDisplayLimit] = useState(5); // Limit for dashboard view
  const [reviewingApplicationId, setReviewingApplicationId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_SUBMITTED_APPLICATIONS, {
    variables: {
      filters: {
        search: searchTerm || undefined,
        // Remove status filtering from query to get all applications for accurate tab counts
        // status: activeTab === 'all' ? undefined : 
        //         activeTab === 'pending' ? 'SUBMITTED' : 
        //         activeTab === 'review' ? 'UNDER_REVIEW' : 
        //         activeTab === 'completed' ? ['APPROVED', 'REJECTED'] : 
        //         activeTab === 'info' ? 'REQUIRES_MORE_INFO' : undefined
      }
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  });

  const applications: Application[] = data?.getSubmittedApplications || [];

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Filter by status based on active tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'pending':
          filtered = filtered.filter(app => app.status === 'SUBMITTED');
          break;
        case 'review':
          filtered = filtered.filter(app => app.status === 'UNDER_REVIEW');
          break;
        case 'completed':
          filtered = filtered.filter(app => ['APPROVED', 'REJECTED'].includes(app.status));
          break;
        case 'info':
          filtered = filtered.filter(app => app.status === 'REQUIRES_MORE_INFO');
          break;
      }
    }

    // Sort applications
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'submittedAt':
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case 'fullName':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'yearsOfExperience':
          aValue = a.yearsOfExperience;
          bValue = b.yearsOfExperience;
          break;
        case 'aiScore':
          aValue = a.aiVerification?.overallScore || 0;
          bValue = b.aiVerification?.overallScore || 0;
          break;
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [applications, activeTab, sortBy, sortOrder]);

  // Limit displayed applications
  const displayedApplications = filteredApplications.slice(0, displayLimit);
  const hasMoreApplications = filteredApplications.length > displayLimit;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setLastUpdated(new Date());
      showToast('success', 'Applications Refreshed', 'Applications list has been updated successfully.');
    } catch (error) {
      console.error('Failed to refresh applications:', error);
      showToast('error', 'Refresh Failed', 'Failed to refresh applications list.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewApplication = (applicationId: string) => {
    setReviewingApplicationId(applicationId);
    // Navigation will be handled by Link component
    console.log('Viewing application:', applicationId);
    // Clear the reviewing state after a short delay to allow navigation
    setTimeout(() => setReviewingApplicationId(null), 1000);
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all':
        return applications.length;
      case 'pending':
        return applications.filter(app => app.status === 'SUBMITTED').length;
      case 'review':
        return applications.filter(app => app.status === 'UNDER_REVIEW').length;
      case 'completed':
        return applications.filter(app => ['APPROVED', 'REJECTED'].includes(app.status)).length;
      case 'info':
        return applications.filter(app => app.status === 'REQUIRES_MORE_INFO').length;
      default:
        return 0;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Error Loading Applications</h2>
          <p className="text-gray-600">Failed to load applications data.</p>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full mx-auto px-4  ">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
                <p className="text-slate-600 mt-1">Review and manage instructor applications</p>
                <p className="text-xs text-slate-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button onClick={handleRefresh} disabled={loading || isRefreshing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading || isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Applications Management */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Applications Management</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="submittedAt">Sort by Date</option>
                  <option value="fullName">Sort by Name</option>
                  <option value="yearsOfExperience">Sort by Experience</option>
                  <option value="aiScore">Sort by AI Score</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  All Applications
                  <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">
                    {getTabCount('all')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Pending Review
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
                    {getTabCount('pending')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="review"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Under Review
                  <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                    {getTabCount('review')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Completed
                  <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">
                    {getTabCount('completed')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="info"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
                >
                  Needs Info
                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                    {getTabCount('info')}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {(loading || isRefreshing) ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-slate-600">
                      {isRefreshing ? 'Refreshing data...' : 
                       `Loading ${activeTab === 'all' ? 'all' :
                                 activeTab === 'pending' ? 'pending' : 
                                 activeTab === 'review' ? 'under review' : 
                                 activeTab === 'completed' ? 'completed' : 
                                 'needs info'} applications...`}
                    </span>
                  </div>
                ) : displayedApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No applications found
                    </h3>
                    <p className="text-slate-600">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : `No applications in ${activeTab} status`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedApplications.map((application) => (
                      <Link key={application.id} href={`/admin/applications/${application.id}`}>
                        <ApplicationCard
                          application={application}
                          onViewClick={handleViewApplication}
                          isLoading={reviewingApplicationId === application.id}
                        />
                      </Link>
                    ))}
                    
                    {/* See More Button */}
                    {hasMoreApplications && (
                      <div className="flex justify-center pt-6">
                        <Link href="/admin/applications/all">
                          <Button variant="outline" size="lg" className="group">
                            <span>View All Applications</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && !isRefreshing && (
          <div className="mt-6 text-center text-sm text-slate-500">
            {displayedApplications.length > 0 ? (
              <>
                Showing {displayedApplications.length} of {filteredApplications.length} applications
                {searchTerm && ` matching "${searchTerm}"`}
                {activeTab !== 'all' && ` in ${activeTab === 'pending' ? 'pending review' : 
                                         activeTab === 'review' ? 'under review' : 
                                         activeTab === 'completed' ? 'completed' : 
                                         'needs info'} status`}
                {hasMoreApplications && ` (${filteredApplications.length - displayedApplications.length} more available)`}
              </>
            ) : (
              `No applications found${searchTerm ? ` matching "${searchTerm}"` : ''}`
            )}
          </div>
        )}
      </div>
    </div>
  );
}

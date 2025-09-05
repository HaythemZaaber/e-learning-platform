import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Video, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  X,
  Edit,
  Eye,
  UserPlus,
  BarChart3,
  ExternalLink,
  RefreshCw,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Timer,
  Star,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isFuture, differenceInMinutes, parseISO } from 'date-fns';

// Mock data structure based on your response
const mockSessions = [
  {
    "id": "cmf1djqz50003idfg1sk6o9yr",
    "bookingRequestId": "cmf1dj92e0001idfgc4m7ledf",
    "offeringId": "cmem6vi3w000bidzc0febzd1c",
    "instructorId": "cme07oj8x0000idqozg52wxqx",
    "sessionType": "CUSTOM",
    "title": "Advanced React Patterns",
    "description": "Deep dive into advanced React patterns including compound components, render props, and custom hooks",
    "format": "INDIVIDUAL",
    "sessionFormat": "ONLINE",
    "sessionMode": "LIVE",
    "maxParticipants": 4,
    "minParticipants": 1,
    "currentParticipants": 1,
    "scheduledStart": "2025-09-07T21:00:00.000Z",
    "scheduledEnd": "2025-09-07T22:00:00.000Z",
    "actualStart": null,
    "actualEnd": null,
    "duration": 60,
    "status": "SCHEDULED",
    "meetingRoomId": "session-cmf1djqz50003idfg1sk6o9yr-1756746567779-zn1dy4",
    "meetingLink": "https://meet.jit.si/session-cmf1djqz50003idfg1sk6o9yr-1756746567779-zn1dy4",
    "recordingEnabled": true,
    "materials": ["React documentation", "Code examples"],
    "pricePerPerson": 10,
    "totalPrice": 10,
    "totalRevenue": 10,
    "platformFee": 2,
    "instructorPayout": 8,
    "currency": "USD",
    "payoutStatus": "PENDING",
    "createdAt": "2025-09-01T17:09:27.762Z",
    "updatedAt": "2025-09-01T17:09:27.781Z",
    "instructor": {
      "id": "cme07oj8x0000idqozg52wxqx",
      "firstName": "Haythem",
      "lastName": "Zaaber",
      "profileImage": "http://localhost:3001/uploads/image/1755625281486-haythem.jpg",
      "teachingRating": 4.8
    },
    "offering": {
      "id": "cmem6vi3w000bidzc0febzd1c",
      "title": "React Development Sessions",
      "sessionType": "INDIVIDUAL",
      "cancellationPolicy": "MODERATE"
    },
    "participants": [
      {
        "id": "cmf1djqzb0005idfgob08otto",
        "sessionId": "cmf1djqz50003idfg1sk6o9yr",
        "userId": "cmejgu2ls0000idxwh8a367z8",
        "role": "STUDENT",
        "status": "ENROLLED",
        "deviceType": "DESKTOP",
        "paidAmount": 10,
        "currency": "USD",
        "paymentDate": "2025-09-01T17:09:27.766Z",
        "user": {
          "id": "cmejgu2ls0000idxwh8a367z8",
          "firstName": "Haythem",
          "lastName": "Student",
          "profileImage": null,
          "email": "student@example.com"
        }
      }
    ],
    "reviews": [],
    "attendance": []
  },
  {
    "id": "cmf1d3tb30003idtgwbfds5sd",
    "title": "JavaScript Fundamentals",
    "description": "Master the core concepts of JavaScript programming",
    "status": "IN_PROGRESS",
    "scheduledStart": "2025-09-01T18:00:00.000Z",
    "scheduledEnd": "2025-09-01T19:30:00.000Z",
    "actualStart": "2025-09-01T18:05:00.000Z",
    "duration": 90,
    "currentParticipants": 3,
    "maxParticipants": 6,
    "pricePerPerson": 15,
    "currency": "USD",
    "sessionFormat": "ONLINE",
    "meetingLink": "https://meet.jit.si/js-fundamentals-session",
    "recordingEnabled": true,
    "instructor": {
      "firstName": "Haythem",
      "lastName": "Zaaber",
      "profileImage": "http://localhost:3001/uploads/image/1755625281486-haythem.jpg",
      "teachingRating": 4.8
    },
    "participants": [
      { "user": { "firstName": "Alice", "lastName": "Johnson" }, "status": "ENROLLED" },
      { "user": { "firstName": "Bob", "lastName": "Smith" }, "status": "ENROLLED" },
      { "user": { "firstName": "Carol", "lastName": "Davis" }, "status": "ENROLLED" }
    ]
  },
  {
    "id": "completed-session-1",
    "title": "Python for Beginners",
    "description": "Introduction to Python programming language",
    "status": "COMPLETED",
    "scheduledStart": "2025-08-30T14:00:00.000Z",
    "scheduledEnd": "2025-08-30T15:00:00.000Z",
    "actualStart": "2025-08-30T14:02:00.000Z",
    "actualEnd": "2025-08-30T15:05:00.000Z",
    "duration": 60,
    "actualDuration": 63,
    "currentParticipants": 2,
    "maxParticipants": 4,
    "pricePerPerson": 20,
    "currency": "USD",
    "sessionFormat": "ONLINE",
    "recordingUrl": "https://example.com/recording/123",
    "instructor": {
      "firstName": "Haythem",
      "lastName": "Zaaber",
      "teachingRating": 4.8
    },
    "participants": [
      { "user": { "firstName": "David", "lastName": "Wilson" }, "status": "COMPLETED" },
      { "user": { "firstName": "Eva", "lastName": "Brown" }, "status": "COMPLETED" }
    ],
    "reviews": [
      { "rating": 5, "comment": "Excellent session!" },
      { "rating": 4, "comment": "Very helpful" }
    ]
  }
];

const mockStats = {
  totalSessions: 29,
  scheduledSessions: 19,
  completedSessions: 5,
  cancelledSessions: 5,
  inProgressSessions: 0,
  totalRevenue: 290,
  averageRating: 4.6,
  completionRate: 17.24,
  cancellationRate: 17.24
};

function SessionStatusBadge({ status, startTime, className = "" }) {
  const getStatusConfig = () => {
    const now = new Date();
    const sessionStart = parseISO(startTime);
    const minutesToStart = differenceInMinutes(sessionStart, now);

    switch (status) {
      case 'SCHEDULED':
        if (minutesToStart <= 5 && minutesToStart > 0) {
          return {
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            icon: <Timer className="w-3 h-3" />,
            text: 'Starting Soon'
          };
        }
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Calendar className="w-3 h-3" />,
          text: 'Scheduled'
        };
      case 'CONFIRMED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle2 className="w-3 h-3" />,
          text: 'Confirmed'
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-green-100 text-green-800 border-green-200 animate-pulse',
          icon: <Video className="w-3 h-3" />,
          text: 'Live Now'
        };
      case 'COMPLETED':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <CheckCircle2 className="w-3 h-3" />,
          text: 'Completed'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-3 h-3" />,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={`${config.color} ${className}`}>
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </Badge>
  );
}

function EnhancedLiveSessionCard({ session, onAction, isLoading }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeDisplay = () => {
    const startTime = parseISO(session.scheduledStart);
    const now = new Date();
    
    if (isToday(startTime)) {
      return `Today at ${format(startTime, 'HH:mm')}`;
    } else if (isTomorrow(startTime)) {
      return `Tomorrow at ${format(startTime, 'HH:mm')}`;
    } else {
      return format(startTime, 'MMM dd, yyyy \'at\' HH:mm');
    }
  };

  const getUrgencyLevel = () => {
    const startTime = parseISO(session.scheduledStart);
    const now = new Date();
    const minutesToStart = differenceInMinutes(startTime, now);

    if (session.status === 'IN_PROGRESS') return 'live';
    if (minutesToStart <= 5 && minutesToStart > 0) return 'urgent';
    if (minutesToStart <= 30 && minutesToStart > 0) return 'soon';
    if (isPast(startTime) && session.status === 'SCHEDULED') return 'overdue';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();
  const urgencyClasses = {
    live: 'border-green-500 bg-green-50/50 shadow-lg',
    urgent: 'border-orange-500 bg-orange-50/50 shadow-md',
    soon: 'border-yellow-500 bg-yellow-50/50',
    overdue: 'border-red-500 bg-red-50/50',
    normal: 'border-border bg-background'
  };

  const getActionButtons = () => {
    const buttons = [];
    
    switch (session.status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        buttons.push(
          <Button
            key="start"
            size="sm"
            onClick={() => onAction('start', session.id)}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Start
          </Button>
        );
        buttons.push(
          <Button
            key="edit"
            size="sm"
            variant="outline"
            onClick={() => onAction('edit', session.id)}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
        );
        buttons.push(
          <Button
            key="cancel"
            size="sm"
            variant="outline"
            onClick={() => onAction('cancel', session.id)}
            disabled={isLoading}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <X className="w-3 h-3" />
            Cancel
          </Button>
        );
        break;
        
      case 'IN_PROGRESS':
        buttons.push(
          <Button
            key="join"
            size="sm"
            onClick={() => window.open(session.meetingLink, '_blank')}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
          >
            <Video className="w-3 h-3" />
            Join Live
          </Button>
        );
        buttons.push(
          <Button
            key="end"
            size="sm"
            variant="destructive"
            onClick={() => onAction('end', session.id)}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Pause className="w-3 h-3" />
            End
          </Button>
        );
        break;
        
      case 'COMPLETED':
        if (session.recordingUrl) {
          buttons.push(
            <Button
              key="recording"
              size="sm"
              variant="outline"
              onClick={() => window.open(session.recordingUrl, '_blank')}
              className="flex items-center gap-1"
            >
              <Video className="w-3 h-3" />
              Recording
            </Button>
          );
        }
        break;
    }

    // Always show manage participants and view details
    buttons.push(
      <Button
        key="participants"
        size="sm"
        variant="outline"
        onClick={() => onAction('participants', session.id)}
        className="flex items-center gap-1"
      >
        <UserPlus className="w-3 h-3" />
        Participants
      </Button>
    );

    return buttons;
  };

  const averageRating = session.reviews?.length > 0 
    ? session.reviews.reduce((acc, review) => acc + review.rating, 0) / session.reviews.length 
    : null;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${urgencyClasses[urgencyLevel]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {session.title}
              </CardTitle>
              {urgencyLevel === 'live' && (
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {session.description}
            </CardDescription>
          </div>
          <SessionStatusBadge 
            status={session.status} 
            startTime={session.scheduledStart}
            className="ml-2 flex-shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{getTimeDisplay()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>{formatDuration(session.duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>
              {session.currentParticipants}/{session.maxParticipants}
              {session.currentParticipants === session.maxParticipants && (
                <Badge variant="secondary" className="ml-1 text-xs">Full</Badge>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">
              {formatCurrency(session.pricePerPerson, session.currency)}
            </span>
          </div>
        </div>

        {/* Session Type & Format */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {session.format || 'INDIVIDUAL'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {session.sessionFormat || 'ONLINE'}
          </Badge>
          {session.sessionType && (
            <Badge variant="outline" className="text-xs">
              {session.sessionType}
            </Badge>
          )}
          {session.recordingEnabled && (
            <Badge variant="outline" className="text-xs text-red-600">
              Recording
            </Badge>
          )}
        </div>

        {/* Participants Preview */}
        {session.participants && session.participants.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Participants</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-auto p-1 text-xs"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            
            {showDetails ? (
              <div className="space-y-2">
                {session.participants.slice(0, 3).map((participant, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={participant.user?.profileImage} />
                      <AvatarFallback className="text-xs">
                        {participant.user?.firstName?.[0]}{participant.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate">
                      {participant.user?.firstName} {participant.user?.lastName}
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {participant.status}
                    </Badge>
                  </div>
                ))}
                {session.participants.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{session.participants.length - 3} more participants
                  </div>
                )}
              </div>
            ) : (
              <div className="flex -space-x-2">
                {session.participants.slice(0, 4).map((participant, index) => (
                  <Avatar key={index} className="w-8 h-8 border-2 border-background">
                    <AvatarImage src={participant.user?.profileImage} />
                    <AvatarFallback className="text-xs">
                      {participant.user?.firstName?.[0]}{participant.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {session.participants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      +{session.participants.length - 4}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reviews & Rating */}
        {session.status === 'COMPLETED' && averageRating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({session.reviews.length} review{session.reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Revenue Info */}
        {session.totalRevenue && (
          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
            <span className="text-green-800">Total Revenue:</span>
            <span className="font-semibold text-green-900">
              {formatCurrency(session.totalRevenue, session.currency)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {getActionButtons()}
          
          {session.meetingLink && session.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(session.meetingLink, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Meeting Link
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction('details', session.id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Details
          </Button>
        </div>

        {/* Progress for in-progress sessions */}
        {session.status === 'IN_PROGRESS' && session.actualStart && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Session Progress</span>
              <span>
                {Math.round(differenceInMinutes(new Date(), parseISO(session.actualStart)))} / {session.duration} min
              </span>
            </div>
            <Progress 
              value={Math.min(
                (differenceInMinutes(new Date(), parseISO(session.actualStart)) / session.duration) * 100,
                100
              )}
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SessionsGrid({ sessions, onAction, isLoading, title, icon: Icon, emptyMessage }) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
          <p className="text-muted-foreground text-sm">
            {title === 'Scheduled Sessions' ? 'Create your first session to get started' : 'No sessions in this category'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title} ({sessions.length})
        </h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sessions.map((session) => (
          <EnhancedLiveSessionCard
            key={session.id}
            session={session}
            onAction={onAction}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

function SessionsStatsCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Sessions',
      value: stats.scheduledSessions + stats.inProgressSessions,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Avg Rating',
      value: stats.averageRating ? `${stats.averageRating.toFixed(1)} ⭐` : 'N/A',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function EnhancedInstructorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('scheduledStart');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate loading state
  const [dataLoading] = useState(false);

  const handleAction = async (action, sessionId) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Action: ${action} for session: ${sessionId}`);
    
    // Add toast notifications here
    switch (action) {
      case 'start':
        console.log('Starting session...');
        break;
      case 'end':
        console.log('Ending session...');
        break;
      case 'cancel':
        console.log('Cancelling session...');
        break;
      case 'edit':
        console.log('Opening edit modal...');
        break;
      case 'participants':
        console.log('Managing participants...');
        break;
      case 'details':
        console.log('Viewing details...');
        break;
    }
    
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Refreshing data...');
    setRefreshing(false);
  };

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = mockSessions.filter((session) => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort sessions
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'scheduledStart':
          aValue = new Date(a.scheduledStart);
          bValue = new Date(b.scheduledStart);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'participants':
          aValue = a.currentParticipants;
          bValue = b.currentParticipants;
          break;
        case 'revenue':
          aValue = a.totalRevenue || 0;
          bValue = b.totalRevenue || 0;
          break;
        default:
          aValue = new Date(a.scheduledStart);
          bValue = new Date(b.scheduledStart);
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Group sessions by status
  const sessionsByStatus = useMemo(() => {
    const grouped = {
      scheduled: [],
      confirmed: [],
      inProgress: [],
      completed: [],
      cancelled: []
    };

    filteredAndSortedSessions.forEach(session => {
      switch (session.status) {
        case 'SCHEDULED':
          grouped.scheduled.push(session);
          break;
        case 'CONFIRMED':
          grouped.confirmed.push(session);
          break;
        case 'IN_PROGRESS':
          grouped.inProgress.push(session);
          break;
        case 'COMPLETED':
          grouped.completed.push(session);
          break;
        case 'CANCELLED':
          grouped.cancelled.push(session);
          break;
      }
    });

    return grouped;
  }, [filteredAndSortedSessions]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground">
            Manage your live teaching sessions and track performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Session
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <SessionsStatsCards stats={mockStats} isLoading={dataLoading} />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sessions by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduledStart">Date & Time</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => toggleSort(sortBy)}
              className="flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions by Status */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live" className="relative">
            Live
            {sessionsByStatus.inProgress.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                {sessionsByStatus.inProgress.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming
            {sessionsByStatus.scheduled.length + sessionsByStatus.confirmed.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs px-1 py-0">
                {sessionsByStatus.scheduled.length + sessionsByStatus.confirmed.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* In Progress Sessions - Priority */}
          {sessionsByStatus.inProgress.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.inProgress}
              onAction={handleAction}
              isLoading={isLoading}
              title="Live Sessions"
              icon={Video}
              emptyMessage="No live sessions"
            />
          )}

          {/* Upcoming Sessions Today/Tomorrow */}
          {sessionsByStatus.scheduled.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.scheduled.filter(s => {
                const startTime = parseISO(s.scheduledStart);
                return isToday(startTime) || isTomorrow(startTime);
              })}
              onAction={handleAction}
              isLoading={isLoading}
              title="Upcoming Soon"
              icon={Timer}
              emptyMessage="No sessions coming up today or tomorrow"
            />
          )}

          {/* Confirmed Sessions */}
          {sessionsByStatus.confirmed.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.confirmed.slice(0, 4)}
              onAction={handleAction}
              isLoading={isLoading}
              title="Confirmed Sessions"
              icon={CheckCircle2}
              emptyMessage="No confirmed sessions"
            />
          )}

          {/* Recent Completed */}
          {sessionsByStatus.completed.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.completed.slice(0, 3)}
              onAction={handleAction}
              isLoading={isLoading}
              title="Recently Completed"
              icon={BookOpen}
              emptyMessage="No completed sessions"
            />
          )}
        </TabsContent>

        {/* Live Sessions Tab */}
        <TabsContent value="live" className="space-y-6">
          <SessionsGrid
            sessions={sessionsByStatus.inProgress}
            onAction={handleAction}
            isLoading={isLoading}
            title="Live Sessions"
            icon={Video}
            emptyMessage="No live sessions at the moment"
          />
        </TabsContent>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          {/* Scheduled Sessions */}
          {sessionsByStatus.scheduled.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.scheduled}
              onAction={handleAction}
              isLoading={isLoading}
              title="Scheduled Sessions"
              icon={Calendar}
              emptyMessage="No scheduled sessions"
            />
          )}

          {/* Confirmed Sessions */}
          {sessionsByStatus.confirmed.length > 0 && (
            <SessionsGrid
              sessions={sessionsByStatus.confirmed}
              onAction={handleAction}
              isLoading={isLoading}
              title="Confirmed Sessions"
              icon={CheckCircle2}
              emptyMessage="No confirmed sessions"
            />
          )}

          {sessionsByStatus.scheduled.length === 0 && sessionsByStatus.confirmed.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Create new sessions or check your availability settings
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Completed Sessions Tab */}
        <TabsContent value="completed" className="space-y-6">
          <SessionsGrid
            sessions={sessionsByStatus.completed}
            onAction={handleAction}
            isLoading={isLoading}
            title="Completed Sessions"
            icon={BookOpen}
            emptyMessage="No completed sessions yet"
          />
        </TabsContent>

        {/* Cancelled Sessions Tab */}
        <TabsContent value="cancelled" className="space-y-6">
          <SessionsGrid
            sessions={sessionsByStatus.cancelled}
            onAction={handleAction}
            isLoading={isLoading}
            title="Cancelled Sessions"
            icon={XCircle}
            emptyMessage="No cancelled sessions"
          />
        </TabsContent>

        {/* All Sessions Tab */}
        <TabsContent value="all" className="space-y-6">
          {filteredAndSortedSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No sessions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'ALL' 
                    ? 'Try adjusting your search or filters'
                    : 'Create your first live session to get started'
                  }
                </p>
                {!searchTerm && statusFilter === 'ALL' && (
                  <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Session
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedSessions.length} of {mockSessions.length} sessions
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredAndSortedSessions.map((session) => (
                  <EnhancedLiveSessionCard
                    key={session.id}
                    session={session}
                    onAction={handleAction}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions Sidebar */}
      <Card className="fixed bottom-6 right-6 w-80 shadow-lg border-2 z-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Session
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => console.log('Opening availability setup')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Manage Availability
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => console.log('Opening session templates')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Session Templates
          </Button>
          {sessionsByStatus.inProgress.length > 0 && (
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              onClick={() => window.open(sessionsByStatus.inProgress[0].meetingLink, '_blank')}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Live Session
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
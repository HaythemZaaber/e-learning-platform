// features/sessions/components/instructor/SessionOfferings.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Target,
  Settings,
  Save,
  X
} from "lucide-react";
import { useSessionOfferings, useCreateSessionOffering, useUpdateSessionOffering, useDeleteSessionOffering } from "@/features/sessions/hooks/useLiveSessions";
import { SessionOffering, SessionType, SessionFormat, SessionTopicType, CancellationPolicy } from "@/features/sessions/types/session.types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface OfferingForm {
  title: string;
  description: string;
  shortDescription?: string;
  sessionType: SessionType;
  format: SessionFormat;
  topicType: SessionTopicType;
  duration: number;
  maxParticipants: number;
  minParticipants?: number;
  price: number;
  currency: string;
  isActive: boolean;
  cancellationPolicy: CancellationPolicy;
  requirements?: string;
  learningOutcomes?: string[];
  tags?: string[];
  // Topic-specific fields
  topicId?: string;
  fixedTopic?: string;
  domain?: string;
  // Additional settings
  isPublic: boolean;
  requiresApproval: boolean;
  recordingEnabled: boolean;
  whiteboardEnabled: boolean;
  screenShareEnabled: boolean;
  chatEnabled: boolean;
  materials?: string[];
  equipment?: string[];
}

const SESSION_TYPES = [
  { value: SessionType.INDIVIDUAL, label: "One-on-One" },
  { value: SessionType.SMALL_GROUP, label: "Small Group" },
  { value: SessionType.LARGE_GROUP, label: "Large Group" },
  { value: SessionType.WORKSHOP, label: "Workshop" },
  { value: SessionType.MASTERCLASS, label: "Masterclass" }
];

const SESSION_FORMATS = [
  { value: SessionFormat.ONLINE, label: "Online" },
  { value: SessionFormat.OFFLINE, label: "Offline" },
  { value: SessionFormat.HYBRID, label: "Hybrid" }
];

const TOPIC_TYPES = [
  { value: SessionTopicType.FIXED, label: "Fixed Topic" },
  { value: SessionTopicType.FLEXIBLE, label: "Flexible Topic" },
  { value: SessionTopicType.HYBRID, label: "Hybrid" }
];

const CANCELLATION_POLICIES = [
  { value: CancellationPolicy.FLEXIBLE, label: "Flexible", description: "Free cancellation up to 24h before" },
  { value: CancellationPolicy.MODERATE, label: "Moderate", description: "Free cancellation up to 12h before" },
  { value: CancellationPolicy.STRICT, label: "Strict", description: "Free cancellation up to 6h before" }
];

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" }
];

export function SessionOfferings() {
  const { user } = useAuth();
  const { data: offerings, isLoading, refetch } = useSessionOfferings({ instructorId: user?.id });
  const createOfferingMutation = useCreateSessionOffering();
  const updateOfferingMutation = useUpdateSessionOffering();
  const deleteOfferingMutation = useDeleteSessionOffering();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<SessionOffering | null>(null);
  const [formData, setFormData] = useState<OfferingForm>({
    title: "",
    description: "",
    shortDescription: "",
    sessionType: SessionType.INDIVIDUAL,
    format: SessionFormat.ONLINE,
    topicType: SessionTopicType.FIXED,
    duration: 60,
    maxParticipants: 1,
    minParticipants: 1,
    price: 0,
    currency: "USD",
    isActive: true,
    cancellationPolicy: CancellationPolicy.MODERATE,
    requirements: "",
    learningOutcomes: [],
    tags: [],
    topicId: "",
    fixedTopic: "",
    domain: "",
    isPublic: true,
    requiresApproval: false,
    recordingEnabled: true,
    whiteboardEnabled: true,
    screenShareEnabled: true,
    chatEnabled: true,
    materials: [],
    equipment: []
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      sessionType: SessionType.INDIVIDUAL,
      format: SessionFormat.ONLINE,
      topicType: SessionTopicType.FIXED,
      duration: 60,
      maxParticipants: 1,
      minParticipants: 1,
      price: 0,
      currency: "USD",
      isActive: true,
      cancellationPolicy: CancellationPolicy.MODERATE,
      requirements: "",
      learningOutcomes: [],
      tags: [],
      topicId: "",
      fixedTopic: "",
      domain: "",
      isPublic: true,
      requiresApproval: false,
      recordingEnabled: true,
      whiteboardEnabled: true,
      screenShareEnabled: true,
      chatEnabled: true,
      materials: [],
      equipment: []
    });
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Title is required");
    }

    if (!formData.description.trim()) {
      errors.push("Description is required");
    }

    if (formData.duration < 15 || formData.duration > 480) {
      errors.push("Duration must be between 15 and 480 minutes");
    }

    if (formData.maxParticipants < 1) {
      errors.push("Maximum participants must be at least 1");
    }

    if (formData.minParticipants && formData.minParticipants > formData.maxParticipants) {
      errors.push("Minimum participants cannot exceed maximum participants");
    }

    if (formData.price < 0) {
      errors.push("Price cannot be negative");
    }

    // Topic type validation
    if (formData.topicType === SessionTopicType.FIXED && !formData.fixedTopic && !formData.topicId) {
      errors.push("Fixed topic or topic ID is required for FIXED topic type");
    }

    if (formData.topicType === SessionTopicType.FLEXIBLE && !formData.domain) {
      errors.push("Domain is required for FLEXIBLE topic type");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleCreateOffering = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    try {
      const offeringData = {
        instructorId: user?.id || "",
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        topicType: formData.topicType,
        topicId: formData.topicId || undefined,
        fixedTopic: formData.fixedTopic || undefined,
        domain: formData.domain || undefined,
        tags: formData.tags || [],
        sessionType: formData.sessionType,
        sessionFormat: formData.format,
        duration: formData.duration,
        capacity: formData.maxParticipants,
        minParticipants: formData.minParticipants,
        basePrice: formData.price,
        currency: formData.currency,
        cancellationPolicy: formData.cancellationPolicy,
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        materials: formData.materials || [],
        prerequisites: formData.requirements ? [formData.requirements] : [],
        equipment: formData.equipment || [],
        recordingEnabled: formData.recordingEnabled,
        whiteboardEnabled: formData.whiteboardEnabled,
        screenShareEnabled: formData.screenShareEnabled,
        chatEnabled: formData.chatEnabled
      };

      await createOfferingMutation.mutateAsync(offeringData);
      setIsCreateDialogOpen(false);
      resetForm();
      // Refetch offerings to get the latest data
      await refetch();
    } catch (error) {
      console.error("Create offering error:", error);
      toast.error("Failed to create session offering");
    }
  };

  const handleUpdateOffering = async () => {
    if (!editingOffering) return;
    
    const validation = validateForm();
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    try {
      const updateData = {
        id: editingOffering.id,
        updates: {
          title: formData.title,
          description: formData.description,
          shortDescription: formData.shortDescription,
          topicType: formData.topicType,
          topicId: formData.topicId || undefined,
          fixedTopic: formData.fixedTopic || undefined,
          domain: formData.domain || undefined,
          tags: formData.tags || [],
          sessionType: formData.sessionType,
          sessionFormat: formData.format,
          duration: formData.duration,
          capacity: formData.maxParticipants,
          minParticipants: formData.minParticipants,
          basePrice: formData.price,
          currency: formData.currency,
          cancellationPolicy: formData.cancellationPolicy,
          isActive: formData.isActive,
          isPublic: formData.isPublic,
          requiresApproval: formData.requiresApproval,
          materials: formData.materials || [],
          prerequisites: formData.requirements ? [formData.requirements] : [],
          equipment: formData.equipment || [],
          recordingEnabled: formData.recordingEnabled,
          whiteboardEnabled: formData.whiteboardEnabled,
          screenShareEnabled: formData.screenShareEnabled,
          chatEnabled: formData.chatEnabled
        }
      };

      await updateOfferingMutation.mutateAsync(updateData);
      setEditingOffering(null);
      resetForm();
      // Refetch offerings to get the latest data
      await refetch();
    } catch (error) {
      console.error("Update offering error:", error);
      toast.error("Failed to update session offering");
    }
  };

  const [deletingOfferingId, setDeletingOfferingId] = useState<string | null>(null);

  const handleDeleteOffering = async (offeringId: string) => {
    setDeletingOfferingId(offeringId);
  };

  const confirmDeleteOffering = async () => {
    if (!deletingOfferingId) return;
    
    try {
      await deleteOfferingMutation.mutateAsync(deletingOfferingId);
      // Refetch offerings to get the latest data
      await refetch();
    } catch (error) {
      console.error("Delete offering error:", error);
      toast.error("Failed to delete session offering");
    } finally {
      setDeletingOfferingId(null);
    }
  };

  const handleEditOffering = (offering: SessionOffering) => {
    setEditingOffering(offering);
    setFormData({
      title: offering.title,
      description: offering.description,
      shortDescription: offering.shortDescription || "",
      sessionType: offering.sessionType,
      format: offering.sessionFormat,
      topicType: offering.topicType,
      duration: offering.duration,
      maxParticipants: offering.capacity,
      minParticipants: offering.minParticipants || 1,
      price: offering.basePrice,
      currency: offering.currency,
      isActive: offering.isActive,
      cancellationPolicy: offering.cancellationPolicy,
      requirements: offering.prerequisites?.join(", ") || "",
      learningOutcomes: [],
      tags: offering.tags || [],
      topicId: offering.topicId || "",
      fixedTopic: offering.fixedTopic || "",
      domain: offering.domain || "",
      isPublic: offering.isPublic,
      requiresApproval: offering.requiresApproval,
      recordingEnabled: offering.recordingEnabled,
      whiteboardEnabled: offering.whiteboardEnabled,
      screenShareEnabled: offering.screenShareEnabled,
      chatEnabled: offering.chatEnabled,
      materials: offering.materials || [],
      equipment: offering.equipment || []
    });
  };

  const addLearningOutcome = () => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...(prev.learningOutcomes || []), ""]
    }));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes?.map((outcome, i) => 
        i === index ? value : outcome
      ) || []
    }));
  };

  const removeLearningOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Session Offerings</h2>
          <p className="text-muted-foreground">
            Create and manage your live session offerings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Offering
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create New Session Offering</DialogTitle>
              <DialogDescription>
                Set up a new session offering for students to book
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <OfferingForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateOffering}
                isSubmitting={createOfferingMutation.isPending}
                onCancel={() => setIsCreateDialogOpen(false)}
                addLearningOutcome={addLearningOutcome}
                updateLearningOutcome={updateLearningOutcome}
                removeLearningOutcome={removeLearningOutcome}
                addTag={addTag}
                removeTag={removeTag}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Offerings List */}
      <div className="grid gap-6">
        {offerings?.map((offering) => (
          <Card key={offering.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{offering.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={offering.isActive ? "default" : "secondary"} className="text-xs">
                            {offering.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {SESSION_TYPES.find(t => t.value === offering.sessionType)?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {SESSION_FORMATS.find(f => f.value === offering.sessionFormat)?.label}
                          </Badge>
                        </div>
                      </div>
                      
                      {offering.shortDescription && (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          "{offering.shortDescription}"
                        </p>
                      )}
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {offering.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 bg-gray-50/50 rounded-lg px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{offering.duration} min</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {offering.minParticipants || 1}-{offering.capacity}
                        </p>
                        <p className="text-xs text-gray-500">Participants</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${offering.basePrice}
                        </p>
                        <p className="text-xs text-gray-500">Price</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {offering.totalBookings || 0}
                        </p>
                        <p className="text-xs text-gray-500">Bookings</p>
                      </div>
                    </div>
                  </div>

                  {/* Topic Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Topic Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {TOPIC_TYPES.find(t => t.value === offering.topicType)?.label}
                      </Badge>
                    </div>
                    
                    {offering.topicType === SessionTopicType.FIXED && offering.fixedTopic && (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">Fixed Topic:</span>
                        <span className="text-gray-600">{offering.fixedTopic}</span>
                      </div>
                    )}
                    
                    {offering.topicType === SessionTopicType.FLEXIBLE && offering.domain && (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">Domain:</span>
                        <span className="text-gray-600">{offering.domain}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {offering.recordingEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Recording
                        </Badge>
                      )}
                      {offering.whiteboardEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Whiteboard
                        </Badge>
                      )}
                      {offering.screenShareEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Screen Share
                        </Badge>
                      )}
                      {offering.chatEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Chat
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {offering.tags && offering.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {offering.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancellation Policy */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Cancellation:</span>
                    <span className="text-gray-600">
                      {CANCELLATION_POLICIES.find(p => p.value === offering.cancellationPolicy)?.label}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditOffering(offering)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                                     <AlertDialog open={deletingOfferingId === offering.id} onOpenChange={(open) => !open && setDeletingOfferingId(null)}>
                     <AlertDialogTrigger asChild>
                       <Button
                         variant="outline"
                         size="sm"
                         className="text-destructive hover:text-destructive w-full"
                         onClick={() => handleDeleteOffering(offering.id)}
                       >
                         <Trash2 className="h-4 w-4 mr-2" />
                         Delete
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Delete Session Offering</AlertDialogTitle>
                         <AlertDialogDescription>
                           Are you sure you want to delete "{offering.title}"? This action cannot be undone and will remove all associated data.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel onClick={() => setDeletingOfferingId(null)}>Cancel</AlertDialogCancel>
                         <AlertDialogAction
                           onClick={confirmDeleteOffering}
                           className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                         >
                           Delete
                         </AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!offerings || offerings.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium">No session offerings yet</h3>
                  <p className="text-muted-foreground">
                    Create your first session offering to start accepting bookings
                  </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Offering
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      {editingOffering && (
        <Dialog open={!!editingOffering} onOpenChange={() => setEditingOffering(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit Session Offering</DialogTitle>
              <DialogDescription>
                Update your session offering details
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <OfferingForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleUpdateOffering}
                isSubmitting={updateOfferingMutation.isPending}
                onCancel={() => setEditingOffering(null)}
                addLearningOutcome={addLearningOutcome}
                updateLearningOutcome={updateLearningOutcome}
                removeLearningOutcome={removeLearningOutcome}
                addTag={addTag}
                removeTag={removeTag}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface OfferingFormProps {
  formData: OfferingForm;
  setFormData: (data: OfferingForm) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
  addLearningOutcome: () => void;
  updateLearningOutcome: (index: number, value: string) => void;
  removeLearningOutcome: (index: number) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

function OfferingForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  addLearningOutcome,
  updateLearningOutcome,
  removeLearningOutcome,
  addTag,
  removeTag
}: OfferingFormProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="topic">Topic</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="space-y-4">
                     <div>
             <Label htmlFor="title" className="text-sm font-medium">
               Title <span className="text-red-500">*</span>
             </Label>
             <Input
               id="title"
               value={formData.title}
               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               placeholder="e.g., Advanced JavaScript Workshop"
               className={!formData.title ? "border-red-300 focus:border-red-500" : ""}
             />
           </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description for previews..."
            />
          </div>

                     <div>
             <Label htmlFor="description" className="text-sm font-medium">
               Description <span className="text-red-500">*</span>
             </Label>
             <Textarea
               id="description"
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               placeholder="Describe what students will learn in this session..."
               rows={4}
               className={!formData.description ? "border-red-300 focus:border-red-500" : ""}
             />
           </div>

          <div className="grid grid-cols-2 gap-4">
                         <div>
               <Label htmlFor="sessionType" className="text-sm font-medium">
                 Session Type <span className="text-red-500">*</span>
               </Label>
               <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value as SessionType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                         <div>
               <Label htmlFor="format" className="text-sm font-medium">
                 Format <span className="text-red-500">*</span>
               </Label>
               <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value as SessionFormat })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="topic" className="space-y-4">
                 <div>
           <Label htmlFor="topicType" className="text-sm font-medium">
             Topic Type <span className="text-red-500">*</span>
           </Label>
           <Select value={formData.topicType} onValueChange={(value) => setFormData({ ...formData, topicType: value as SessionTopicType })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.topicType === SessionTopicType.FIXED && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fixedTopic">Fixed Topic</Label>
              <Input
                id="fixedTopic"
                value={formData.fixedTopic}
                onChange={(e) => setFormData({ ...formData, fixedTopic: e.target.value })}
                placeholder="e.g., React Hooks Deep Dive"
              />
            </div>
            <div>
              <Label htmlFor="topicId">Or Select Existing Topic ID</Label>
              <Input
                id="topicId"
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                placeholder="Enter topic ID (optional)"
              />
            </div>
          </div>
        )}

        {formData.topicType === SessionTopicType.FLEXIBLE && (
          <div>
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
        )}

        {formData.topicType === SessionTopicType.HYBRID && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fixedTopic">Default Topic</Label>
              <Input
                id="fixedTopic"
                value={formData.fixedTopic}
                onChange={(e) => setFormData({ ...formData, fixedTopic: e.target.value })}
                placeholder="Default topic for the session"
              />
            </div>
            <div>
              <Label htmlFor="domain">Flexible Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
                     <div>
             <Label htmlFor="duration" className="text-sm font-medium">
               Duration <span className="text-red-500">*</span>
             </Label>
             <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value.toString()}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

                     <div>
             <Label htmlFor="maxParticipants" className="text-sm font-medium">
               Max Participants <span className="text-red-500">*</span>
             </Label>
             <Input
               id="maxParticipants"
               type="number"
               min="1"
               max="50"
               value={formData.maxParticipants}
               onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
               className={!formData.maxParticipants ? "border-red-300 focus:border-red-500" : ""}
             />
           </div>
        </div>

        <div>
          <Label htmlFor="minParticipants">Min Participants</Label>
          <Input
            id="minParticipants"
            type="number"
            min="1"
            max={formData.maxParticipants}
            value={formData.minParticipants}
            onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label>Learning Outcomes</Label>
          <div className="space-y-2">
            {formData.learningOutcomes?.map((outcome, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={outcome}
                  onChange={(e) => updateLearningOutcome(index, e.target.value)}
                  placeholder={`Learning outcome ${index + 1}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeLearningOutcome(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addLearningOutcome}>
              <Plus className="h-4 w-4 mr-2" />
              Add Learning Outcome
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
                   <div>
           <Label htmlFor="price" className="text-sm font-medium">
             Price <span className="text-red-500">*</span>
           </Label>
           <Input
             id="price"
             type="number"
             min="0"
             step="0.01"
             value={formData.price}
             onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
             className={!formData.price && formData.price !== 0 ? "border-red-300 focus:border-red-500" : ""}
           />
         </div>

                     <div>
             <Label htmlFor="currency" className="text-sm font-medium">
               Currency <span className="text-red-500">*</span>
             </Label>
             <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

                 <div>
           <Label htmlFor="cancellationPolicy" className="text-sm font-medium">
             Cancellation Policy <span className="text-red-500">*</span>
           </Label>
           <Select value={formData.cancellationPolicy} onValueChange={(value) => setFormData({ ...formData, cancellationPolicy: value as CancellationPolicy })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CANCELLATION_POLICIES.map((policy) => (
                <SelectItem key={policy.value} value={policy.value}>
                  <div>
                    <div>{policy.label}</div>
                    <div className="text-xs text-muted-foreground">{policy.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="Any prerequisites or requirements for students..."
            rows={3}
          />
        </div>

        <div>
          <Label>Tags</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active (Available for booking)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
            <Label htmlFor="isPublic">Public (Visible to students)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requiresApproval"
              checked={formData.requiresApproval}
              onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
            />
            <Label htmlFor="requiresApproval">Requires Approval</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recordingEnabled"
              checked={formData.recordingEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, recordingEnabled: checked })}
            />
            <Label htmlFor="recordingEnabled">Enable Recording</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="whiteboardEnabled"
              checked={formData.whiteboardEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, whiteboardEnabled: checked })}
            />
            <Label htmlFor="whiteboardEnabled">Enable Whiteboard</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="screenShareEnabled"
              checked={formData.screenShareEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, screenShareEnabled: checked })}
            />
            <Label htmlFor="screenShareEnabled">Enable Screen Share</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="chatEnabled"
              checked={formData.chatEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
            />
            <Label htmlFor="chatEnabled">Enable Chat</Label>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Offering
            </>
          )}
        </Button>
      </div>
    </Tabs>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Video,
  ImageIcon,
  Trash2,
  Eye,
  Heart,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateStoryModal } from "@/features/stories-reels/components/CreateStoryModal";
import { CreateReelModal } from "@/features/stories-reels/components/CreateReelModal";
import { StoryViewer } from "@/features/stories-reels/components/StoryViewer";
import { ReelsFeed } from "@/features/stories-reels/components/ReelsFeed";
import { storiesReelsService } from "@/features/stories-reels/services/storiesReelsService";
import { useAuth } from "@/hooks/useAuth";
import { Story, Reel } from "@/types/storiesReelsTypes";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ContentManagementPage() {
  const { user, getToken } = useAuth();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [isLoadingReels, setIsLoadingReels] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "story" | "reel";
    id: string;
  } | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isReelViewerOpen, setIsReelViewerOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);

  const loadStories = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStories(true);
      const token = await getToken();
      const data = await storiesReelsService.getStories(
        user.id,
        token || undefined
      );
      setStories(data);
    } catch (error) {
      console.error("Failed to load stories:", error);
      toast.error("Failed to load stories");
    } finally {
      setIsLoadingStories(false);
    }
  };

  const loadReels = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingReels(true);
      const token = await getToken();
      const response = await storiesReelsService.getInstructorReels(
        user.id,
        1,
        50,
        token || undefined
      );
      setReels(response.data);
    } catch (error) {
      console.error("Failed to load reels:", error);
      toast.error("Failed to load reels");
    } finally {
      setIsLoadingReels(false);
    }
  };

  useEffect(() => {
    loadStories();
    loadReels();
  }, [user?.id]);

  const handleDeleteStory = async (storyId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await storiesReelsService.deleteStory(storyId, token);
      toast.success("Story deleted successfully");
      loadStories();
    } catch (error) {
      console.error("Failed to delete story:", error);
      toast.error("Failed to delete story");
    }
  };

  const handleDeleteReel = async (reelId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await storiesReelsService.deleteReel(reelId, token);
      toast.success("Reel deleted successfully");
      loadReels();
    } catch (error) {
      console.error("Failed to delete reel:", error);
      toast.error("Failed to delete reel");
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "story") {
      handleDeleteStory(deleteTarget.id);
    } else {
      handleDeleteReel(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="container py-2 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Content Management</h1>
        <p className="text-gray-600">
          Create and manage your stories and reels to engage with your followers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Stories</p>
                <p className="text-3xl font-bold">{stories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reels</p>
                <p className="text-3xl font-bold">{reels.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold">
                  {(
                    stories.reduce((sum, s) => sum + s.views, 0) +
                    reels.reduce((sum, r) => sum + r.views, 0)
                  ).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                <p className="text-3xl font-bold">
                  {(
                    stories.reduce((sum, s) => sum + s.likesCount, 0) +
                    reels.reduce((sum, r) => sum + r.likesCount, 0)
                  ).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="stories" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsStoryModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Story
            </Button>
            <Button
              onClick={() => setIsReelModalOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Reel
            </Button>
          </div>
        </div>

        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Stories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStories ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : stories.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No stories yet</p>
                  <Button onClick={() => setIsStoryModalOpen(true)}>
                    Create Your First Story
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stories.map((story, index) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={() => {
                        setSelectedStoryIndex(index);
                        setIsStoryViewerOpen(true);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: "story", id: story.id });
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Reels</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReels ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : reels.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No reels yet</p>
                  <Button onClick={() => setIsReelModalOpen(true)}>
                    Create Your First Reel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {reels.map((reel, index) => (
                    <ReelCard
                      key={reel.id}
                      reel={reel}
                      onClick={() => {
                        setSelectedReelIndex(index);
                        setIsReelViewerOpen(true);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: "reel", id: reel.id });
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onSuccess={() => {
          loadStories();
          setIsStoryModalOpen(false);
        }}
      />

      <CreateReelModal
        isOpen={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
        onSuccess={() => {
          loadReels();
          setIsReelModalOpen(false);
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {deleteTarget?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Story Viewer */}
      {isStoryViewerOpen && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setIsStoryViewerOpen(false)}
        />
      )}

      {/* Reel Viewer */}
      <Dialog open={isReelViewerOpen} onOpenChange={setIsReelViewerOpen}>
        <DialogContent className="max-w-full w-full h-full p-0 border-0 bg-black">
          <VisuallyHidden>
            <DialogTitle>Reels Viewer</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsReelViewerOpen(false)}
              className="absolute top-4 right-4 z-[60] text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Reels Feed */}
            {reels.length > 0 && (
              <ReelsFeed
                initialReels={reels}
                instructorId={user?.id}
                initialIndex={selectedReelIndex}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StoryCard({
  story,
  onClick,
  onDelete,
}: {
  story: Story;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
    >
      {story.mediaType === "VIDEO" ? (
        <video src={story.mediaUrl} className="w-full h-full object-cover" />
      ) : (
        <img
          src={story.mediaUrl}
          alt="Story"
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-[5]">
          {story.caption && (
            <p className="text-xs line-clamp-2 mb-2 font-medium">
              {story.caption}
            </p>
          )}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              <span>{story.views}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3" />
              <span>{story.likesCount}</span>
            </div>
          </div>
          {story.duration && (
            <div className="flex items-center gap-1 text-xs mb-1">
              <Clock className="h-3 w-3" />
              <span>{story.duration}s</span>
            </div>
          )}
          <p className="text-xs opacity-80">
            {formatDistanceToNow(new Date(story.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => onDelete(e)}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {story.expiresAt && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Expires{" "}
          {formatDistanceToNow(new Date(story.expiresAt), { addSuffix: true })}
        </div>
      )}
    </div>
  );
}

function ReelCard({
  reel,
  onClick,
  onDelete,
}: {
  reel: Reel;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
    >
      {reel.mediaType === "VIDEO" ? (
        <video src={reel.mediaUrl} className="w-full h-full object-cover" />
      ) : (
        <img
          src={reel.mediaUrl}
          alt="Reel"
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Video className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-[5]">
          {reel.caption && (
            <p className="text-xs line-clamp-2 mb-2 font-medium">
              {reel.caption}
            </p>
          )}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              <span>{reel.views}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3" />
              <span>{reel.likesCount}</span>
            </div>
          </div>
          {reel.duration && (
            <div className="flex items-center gap-1 text-xs mb-1">
              <Clock className="h-3 w-3" />
              <span>{reel.duration}s</span>
            </div>
          )}
          <p className="text-xs opacity-80">
            {formatDistanceToNow(new Date(reel.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => onDelete(e)}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

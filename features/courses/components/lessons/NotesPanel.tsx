"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Save, 
  X, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  MoreVertical,
  Copy,
  Share2,
  Download,
  Upload,
  BookOpen,
  Lightbulb,
  Star,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useLectureNotes, LectureNote } from '@/features/courses/hooks/useLectureNotes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotesPanelProps {
  lectureId: string;
  courseId: string;
  currentTime?: number;
  onNoteClick?: (timestamp: number) => void;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'timestamp';
type FilterOption = 'all' | 'recent' | 'favorites';

export function NotesPanel({ 
  lectureId, 
  courseId,
  currentTime = 0,
  onNoteClick,
  className 
}: NotesPanelProps) {
  const {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    isAdding,
    isUpdating,
    isDeleting,
    refetch,
  } = useLectureNotes({ lectureId, courseId });

  // State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingContent, setEditingContent] = useState('');

  // Refs
  const newNoteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Format timestamp to readable time
  const formatTimestamp = useCallback((timestamp: number) => {
    if (timestamp === 0) return 'No timestamp';
    
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Filter and sort notes
  const filteredAndSortedNotes = useCallback(() => {
    let filtered = notes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    switch (filterBy) {
      case 'recent':
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        filtered = filtered.filter(note => 
          new Date(note.createdAt) > oneDayAgo
        );
        break;
      case 'favorites':
        // TODO: Implement favorites functionality
        break;
    }

    // Sort notes
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'timestamp':
        filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        break;
    }

    return filtered;
  }, [notes, searchTerm, filterBy, sortBy]);

  // Handle adding new note
  const handleAddNote = useCallback(async () => {
    if (!newNoteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    const success = await addNote(newNoteContent.trim(), currentTime);
    if (success) {
      setNewNoteContent('');
      setIsAddingNew(false);
      setNewNoteContent('');
    }
  }, [addNote, newNoteContent, currentTime]);

  // Handle updating note
  const handleUpdateNote = useCallback(async (noteId: string) => {
    if (!editingContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    const success = await updateNote(noteId, editingContent.trim());
    if (success) {
      setEditingNoteId(null);
      setEditingContent('');
    }
  }, [updateNote, editingContent]);

  // Handle deleting note
  const handleDeleteNote = useCallback(async () => {
    if (!deletingNoteId) return;

    const success = await deleteNote(deletingNoteId);
    if (success) {
      setDeletingNoteId(null);
    }
  }, [deleteNote, deletingNoteId]);

  // Handle note click (jump to timestamp)
  const handleNoteClick = useCallback((note: LectureNote) => {
    if (note.timestamp && note.timestamp > 0 && onNoteClick) {
      // Scroll to video first
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Show feedback
        toast.success(`Jumping to ${formatTimestamp(note.timestamp)}`);
      }
      
      // Small delay to ensure scroll completes before seeking
      setTimeout(() => {
        onNoteClick(note.timestamp!);
      }, 300);
    }
  }, [onNoteClick, formatTimestamp]);

  // Handle copy note content
  const handleCopyNote = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Note copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy note');
    }
  }, []);

  // Auto-focus textarea when adding/editing
  useEffect(() => {
    if (isAddingNew && newNoteTextareaRef.current) {
      newNoteTextareaRef.current.focus();
    }
  }, [isAddingNew]);

  useEffect(() => {
    if (editingNoteId && editingTextareaRef.current) {
      editingTextareaRef.current.focus();
    }
  }, [editingNoteId]);

  // Start editing a note
  const startEditing = useCallback((note: LectureNote) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingNoteId(null);
    setEditingContent('');
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Failed to load notes</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayNotes = filteredAndSortedNotes();

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes ({displayNotes.length})
          </CardTitle>
          <Button
            onClick={() => setIsAddingNew(true)}
            size="sm"
            className="h-8 px-3"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 hover:bg-blue-500 hover:text-white">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBy('all')}>
                All Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('recent')}>
                Recent (24h)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('favorites')}>
                Favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 hover:bg-blue-500 hover:text-white">
                {sortBy === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('timestamp')}>
                By Timestamp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Add New Note Form */}
        {isAddingNew && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-900">New Note</h4>
                  <Button
                    onClick={() => setIsAddingNew(false)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  ref={newNoteTextareaRef}
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) {
                      handleAddNote();
                    }
                    if (e.key === 'Escape') {
                      setIsAddingNew(false);
                      setNewNoteContent('');
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(currentTime)}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewNoteContent('');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNote}
                      disabled={isAdding || !newNoteContent.trim()}
                      size="sm"
                    >
                      {isAdding ? 'Adding...' : 'Save Note'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {displayNotes.length === 0 ? (
          <div className="text-center py-8">
            <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {searchTerm ? 'No notes found matching your search' : 'No notes yet'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddingNew(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayNotes.map((note) => (
              <Card
                key={note.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  editingNoteId === note.id && "ring-2 ring-blue-500"
                )}
              >
                <CardContent className="p-4">
                  {editingNoteId === note.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <Textarea
                        ref={editingTextareaRef}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="min-h-[100px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.metaKey) {
                            handleUpdateNote(note.id);
                          }
                          if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(note.timestamp || 0)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            onClick={cancelEditing}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleUpdateNote(note.id)}
                            disabled={isUpdating || !editingContent.trim()}
                            size="sm"
                          >
                            {isUpdating ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                    
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white"
                            >
                              

                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditing(note)} className="hover:bg-blue-500 hover:text-white">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyNote(note.content)} className="hover:bg-blue-500 hover:text-white">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </DropdownMenuItem>
                            {note.timestamp && note.timestamp > 0 && (
                              <DropdownMenuItem onClick={() => handleNoteClick(note)} className="hover:bg-blue-500 hover:text-white">
                                <Clock className="w-4 h-4 mr-2" />
                                Jump to Time
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingNoteId(note.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {note.timestamp && note.timestamp > 0 && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-blue-100"
                              onClick={() => handleNoteClick(note)}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(note.timestamp)}
                            </Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(note?.createdAt || new Date()), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingNoteId} onOpenChange={() => setDeletingNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

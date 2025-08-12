import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_LECTURE_NOTES } from '@/features/courses/services/graphql/courseQueries';
import { 
  ADD_LECTURE_NOTE, 
  UPDATE_LECTURE_NOTE, 
  DELETE_LECTURE_NOTE 
} from '@/features/courses/services/graphql/courseMutations';
import { toast } from 'sonner';

export interface LectureNote {
  id: string;
  content: string;
  timestamp?: number;
  createdAt: string;
  updatedAt?: string;
}

interface UseLectureNotesOptions {
  lectureId: string;
  courseId: string;
  enabled?: boolean;
}

interface UseLectureNotesReturn {
  // Data
  notes: LectureNote[];
  isLoading: boolean;
  error: any;
  
  // Actions
  addNote: (content: string, timestamp?: number) => Promise<LectureNote | null>;
  updateNote: (noteId: string, content: string) => Promise<boolean>;
  deleteNote: (noteId: string) => Promise<boolean>;
  
  // State
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Utilities
  refetch: () => Promise<void>;
  getNoteById: (noteId: string) => LectureNote | undefined;
  getNotesByTimestamp: (timestamp: number) => LectureNote[];
}

export const useLectureNotes = ({ 
  lectureId, 
  courseId,
  enabled = true 
}: UseLectureNotesOptions): UseLectureNotesReturn => {
  const client = useApolloClient();
  const [optimisticNotes, setOptimisticNotes] = useState<LectureNote[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const optimisticIdRef = useRef(0);

  // Query for fetching notes
  const { 
    data, 
    loading: isLoading, 
    error, 
    refetch 
  } = useQuery(GET_LECTURE_NOTES, {
    variables: { lectureId },
    skip: !enabled,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Mutations
  const [addNoteMutation] = useMutation(ADD_LECTURE_NOTE, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.addLectureNote?.success) {
        const newNote = mutationData.addLectureNote.note;
        
        // Update cache
        try {
          const existingData = cache.readQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
          }) as any;

          const existingNotes = existingData?.getLectureNotes?.notes || [];
          
          cache.writeQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
            data: {
              getLectureNotes: {
                ...existingData?.getLectureNotes,
                notes: [...existingNotes, newNote]
              }
            },
          });
        } catch (e) {
          console.log('Cache update failed for add note:', e);
        }
      }
    },
  });

  const [updateNoteMutation] = useMutation(UPDATE_LECTURE_NOTE, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.updateLectureNote?.success) {
        const updatedNote = mutationData.updateLectureNote.note;
        
        // Update cache
        try {
          const existingData = cache.readQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
          }) as any;

          const existingNotes = existingData?.getLectureNotes?.notes || [];
          const updatedNotes = existingNotes.map((note: LectureNote) =>
            note.id === updatedNote.id ? updatedNote : note
          );

          cache.writeQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
            data: {
              getLectureNotes: {
                ...existingData?.getLectureNotes,
                notes: updatedNotes
              }
            },
          });
        } catch (e) {
          console.log('Cache update failed for update note:', e);
        }
      }
    },
  });

  const [deleteNoteMutation] = useMutation(DELETE_LECTURE_NOTE, {
    update: (cache, { data: mutationData }, { variables }) => {
      if (mutationData?.deleteLectureNote?.success) {
        const deletedNoteId = variables?.noteId;
        
        // Update cache
        try {
          const existingData = cache.readQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
          }) as any;

          const existingNotes = existingData?.getLectureNotes?.notes || [];
          const updatedNotes = existingNotes.filter(
            (note: LectureNote) => note.id !== deletedNoteId
          );

          cache.writeQuery({
            query: GET_LECTURE_NOTES,
            variables: { lectureId },
            data: {
              getLectureNotes: {
                ...existingData?.getLectureNotes,
                notes: updatedNotes
              }
            },
          });
        } catch (e) {
          console.log('Cache update failed for delete note:', e);
        }
      }
    },
  });

  // Combine server data with optimistic updates
  const notes = useCallback(() => {
    const serverNotes = data?.getLectureNotes?.notes || [];
    
    // Remove optimistic notes that have been confirmed (by content and timestamp)
    const filteredOptimisticNotes = optimisticNotes.filter(optimisticNote => 
      !serverNotes.some((serverNote: LectureNote) => 
        serverNote.content === optimisticNote.content && 
        serverNote.timestamp === optimisticNote.timestamp
      )
    );
    
    return [...serverNotes, ...filteredOptimisticNotes].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [data?.getLectureNotes?.notes, optimisticNotes]);

  // Add note with optimistic update
  const addNote = useCallback(async (content: string, timestamp?: number): Promise<LectureNote | null> => {
    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return null;
    }

    setIsAdding(true);
    
    // Create optimistic note
    const optimisticId = `optimistic-${Date.now()}-${optimisticIdRef.current++}`;
    const optimisticNote: LectureNote = {
      id: optimisticId,
      content: content.trim(),
      timestamp: timestamp || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add optimistic update
    setOptimisticNotes(prev => [...prev, optimisticNote]);

    try {
      const { data: mutationData } = await addNoteMutation({
        variables: {
          courseId,
          lectureId,
          content: content.trim(),
          timestamp: timestamp || 0,
        },
      });

      if (mutationData?.addLectureNote?.success) {
        const newNote = mutationData.addLectureNote.note;
        
        // Remove optimistic note and add real note
        setOptimisticNotes(prev => prev.filter(note => note.id !== optimisticId));
        
        toast.success('Note added successfully');
        return newNote;
      } else {
        // Remove optimistic note on failure
        setOptimisticNotes(prev => prev.filter(note => note.id !== optimisticId));
        
        const errors = mutationData?.addLectureNote?.errors || ['Failed to add note'];
        toast.error(errors[0]);
        return null;
      }
    } catch (error) {
      // Remove optimistic note on error
      setOptimisticNotes(prev => prev.filter(note => note.id !== optimisticId));
      
      console.error('Error adding note:', error);
      toast.error('Failed to add note. Please try again.');
      return null;
    } finally {
      setIsAdding(false);
    }
  }, [addNoteMutation, lectureId, courseId]);

  // Update note with optimistic update
  const updateNote = useCallback(async (noteId: string, content: string): Promise<boolean> => {
    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return false;
    }

    setIsUpdating(true);
    
    // Create optimistic update
    const optimisticUpdate: Partial<LectureNote> = {
      id: noteId,
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };

    // Add optimistic update
    setOptimisticNotes(prev => [
      ...prev,
      optimisticUpdate as LectureNote
    ]);

    try {
      const { data: mutationData } = await updateNoteMutation({
        variables: {
          noteId,
          content: content.trim(),
        },
      });

      if (mutationData?.updateLectureNote?.success) {
        // Remove optimistic update
        setOptimisticNotes(prev => prev.filter(note => note.id !== noteId));
        
        toast.success('Note updated successfully');
        return true;
      } else {
        // Remove optimistic update on failure
        setOptimisticNotes(prev => prev.filter(note => note.id !== noteId));
        
        const errors = mutationData?.updateLectureNote?.errors || ['Failed to update note'];
        toast.error(errors[0]);
        return false;
      }
    } catch (error) {
      // Remove optimistic update on error
      setOptimisticNotes(prev => prev.filter(note => note.id !== noteId));
      
      console.error('Error updating note:', error);
      toast.error('Failed to update note. Please try again.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [updateNoteMutation]);

  // Delete note with optimistic update
  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    setIsDeleting(true);
    
    // Store the note for potential rollback
    const noteToDelete = notes().find(note => note.id === noteId);
    
    // Add optimistic delete
    setOptimisticNotes(prev => [
      ...prev,
      { ...noteToDelete!, id: `delete-${noteId}` } as LectureNote
    ]);

    try {
      const { data: mutationData } = await deleteNoteMutation({
        variables: { noteId },
      });

      if (mutationData?.deleteLectureNote?.success) {
        // Remove optimistic delete
        setOptimisticNotes(prev => prev.filter(note => note.id !== `delete-${noteId}`));
        
        toast.success('Note deleted successfully');
        return true;
      } else {
        // Remove optimistic delete on failure
        setOptimisticNotes(prev => prev.filter(note => note.id !== `delete-${noteId}`));
        
        const errors = mutationData?.deleteLectureNote?.errors || ['Failed to delete note'];
        toast.error(errors[0]);
        return false;
      }
    } catch (error) {
      // Remove optimistic delete on error
      setOptimisticNotes(prev => prev.filter(note => note.id !== `delete-${noteId}`));
      
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [deleteNoteMutation, notes]);

  // Utility functions
  const getNoteById = useCallback((noteId: string): LectureNote | undefined => {
    return notes().find(note => note.id === noteId);
  }, [notes]);

  const getNotesByTimestamp = useCallback((timestamp: number): LectureNote[] => {
    return notes().filter(note => Math.abs(note.timestamp - timestamp) < 30); // Within 30 seconds
  }, [notes]);

  // Clear optimistic notes when component unmounts or lecture changes
  useEffect(() => {
    return () => {
      setOptimisticNotes([]);
    };
  }, [lectureId]);

  return {
    // Data
    notes: notes(),
    isLoading,
    error,
    
    // Actions
    addNote,
    updateNote,
    deleteNote,
    
    // State
    isAdding,
    isUpdating,
    isDeleting,
    
    // Utilities
    refetch: () => refetch() as unknown as Promise<void>,
    getNoteById,
    getNotesByTimestamp,
  };
};

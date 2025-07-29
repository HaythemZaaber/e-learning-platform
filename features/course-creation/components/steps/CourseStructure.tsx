"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Grip,
  Plus,
  Trash2,
  Video,
  FileText,
  FileQuestion,
  FileSpreadsheet,
  FileArchive,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Copy,
  Move,
  Loader2,
} from "lucide-react";
import { CourseData, Lecture, Section, LESSON_TYPES } from "../../types";
import { useCourseCreationStore } from "../../../../stores/courseCreation.store";
import { useNotifications } from "../../hooks/useNotifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../../../../components/ui/dialog";

interface CourseStructureProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const lectureTypeConfig = {
  video: {
    name: "Video",
    icon: Video,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  text: {
    name: "Text",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  quiz: {
    name: "Quiz",
    icon: FileQuestion,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  assignment: {
    name: "Assignment",
    icon: FileSpreadsheet,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  resource: {
    name: "Resource",
    icon: FileArchive,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
};

export function CourseStructure({ data, updateData }: CourseStructureProps) {
  const [sections, setSections] = useState<Section[]>(
    data.sections?.length > 0
      ? data.sections
      : [{ id: "section-1", title: "Introduction", lectures: [] }]
  );

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [showAddLectureModal, setShowAddLectureModal] = useState<string | null>(
    null
  );
  const [showEditLectureModal, setShowEditLectureModal] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({
    title: "",
    type: LESSON_TYPES[0],
    duration: 0,
    description: "",
  });
  const [openSections, setOpenSections] = useState<string[]>(["section-1"]);
  const [draggedItem, setDraggedItem] = useState<{
    type: "section" | "lecture";
    id: string;
    sectionId?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const notifications = useNotifications();
  const { addGlobalWarning } = useCourseCreationStore();

  // Update parent data whenever sections change
  const updateSections = useCallback(
    (newSections: Section[]) => {
      setSections(newSections);
      updateData({ sections: newSections });
    },
    [updateData]
  );

  const handleAddSection = useCallback(() => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      lectures: [],
    };
    const updatedSections = [...sections, newSection];
    updateSections(updatedSections);
    setOpenSections([...openSections, newSection.id]);
    setEditingSectionId(newSection.id);
    setNewSectionTitle(newSection.title);
    notifications.success("New section added");
  }, [sections, openSections, updateSections, notifications]);

  const handleUpdateSection = useCallback(
    (id: string, title: string) => {
      if (!title.trim()) {
        notifications.error("Section title cannot be empty");
        return;
      }

      const updatedSections = sections.map((section) =>
        section.id === id ? { ...section, title: title.trim() } : section
      );
      updateSections(updatedSections);
      setEditingSectionId(null);
      setNewSectionTitle("");
      notifications.success("Section updated");
    },
    [sections, updateSections, notifications]
  );

  const handleDeleteSection = useCallback(
    (id: string) => {
      const section = sections.find((s) => s.id === id);
      if (section && section.lectures.length > 0) {
        if (
          !window.confirm(
            `This section contains ${section.lectures.length} lecture(s). Are you sure you want to delete it?`
          )
        ) {
          return;
        }
      }

      const updatedSections = sections.filter((section) => section.id !== id);
      updateSections(updatedSections);
      setOpenSections(openSections.filter((sId) => sId !== id));
      notifications.success("Section deleted");
    },
    [sections, openSections, updateSections, notifications]
  );

  const handleDuplicateSection = useCallback(
    (id: string) => {
      const sectionToDuplicate = sections.find((s) => s.id === id);
      if (!sectionToDuplicate) return;

      setIsProcessing(true);

      const duplicatedSection: Section = {
        id: `section-${Date.now()}`,
        title: `${sectionToDuplicate.title} (Copy)`,
        lectures: sectionToDuplicate.lectures.map((lecture) => ({
          ...lecture,
          id: `lecture-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        })),
      };

      const updatedSections = [...sections, duplicatedSection];
      updateSections(updatedSections);
      setOpenSections([...openSections, duplicatedSection.id]);
      notifications.success("Section duplicated");
      setIsProcessing(false);
    },
    [sections, openSections, updateSections, notifications]
  );

  const handleAddLecture = useCallback(
    (sectionId: string) => {
      if (!newLecture.title?.trim()) {
        notifications.error("Lecture title is required");
        return;
      }

      const newLectureObj: Lecture = {
        id: `lecture-${Date.now()}`,
        title: newLecture.title.trim(),
        type: newLecture.type || LESSON_TYPES[0],
        duration: newLecture.duration || 0,
        description: newLecture.description?.trim(),
        status: "draft",
      };

      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: [...section.lectures, newLectureObj],
          };
        }
        return section;
      });

      updateSections(updatedSections);
      setNewLecture({
        title: "",
        type: LESSON_TYPES[0],
        duration: 0,
        description: "",
      });
      setShowAddLectureModal(null);
      notifications.success("Lecture added successfully");
    },
    [newLecture, sections, updateSections, notifications]
  );

  const handleUpdateLecture = useCallback(
    (sectionId: string, lectureId: string, lectureData: Partial<Lecture>) => {
      if (
        !lectureData.title ||
        typeof lectureData.title !== "string" ||
        !lectureData.title.trim()
      ) {
        notifications.error("Lecture title is required");
        return;
      }

      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === lectureId
                ? {
                    ...lecture,
                    ...lectureData,
                    title: lectureData.title ?? "",
                  }
                : lecture
            ),
          };
        }
        return section;
      });

      updateSections(updatedSections);
      setShowEditLectureModal(null);
      setNewLecture({
        title: "",
        type: LESSON_TYPES[0],
        duration: 0,
        description: "",
      });
      notifications.success("Lecture updated successfully");
    },
    [sections, updateSections, notifications]
  );

  const handleDeleteLecture = useCallback(
    (sectionId: string, lectureId: string) => {
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.filter(
              (lecture) => lecture.id !== lectureId
            ),
          };
        }
        return section;
      });

      updateSections(updatedSections);
      notifications.success("Lecture deleted");
    },
    [sections, updateSections, notifications]
  );

  const handleDuplicateLecture = useCallback(
    (sectionId: string, lectureId: string) => {
      const section = sections.find((s) => s.id === sectionId);
      const lectureToDuplicate = section?.lectures.find(
        (l) => l.id === lectureId
      );

      if (!lectureToDuplicate) return;

      const duplicatedLecture: Lecture = {
        ...lectureToDuplicate,
        id: `lecture-${Date.now()}`,
        title: `${lectureToDuplicate.title} (Copy)`,
      };

      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: [...section.lectures, duplicatedLecture],
          };
        }
        return section;
      });

      updateSections(updatedSections);
      notifications.success("Lecture duplicated");
    },
    [sections, updateSections, notifications]
  );

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const getTotalDuration = useCallback(() => {
    let total = 0;
    sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        total += lecture.duration || 0;
      });
    });

    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [sections]);

  const getTotalLectures = useCallback(() => {
    return sections.reduce(
      (total: number, section: Section) => total + section.lectures.length,
      0
    );
  }, [sections]);

  const getLectureTypeInfo = useCallback((type: string) => {
    return (
      lectureTypeConfig[type as keyof typeof lectureTypeConfig] ||
      lectureTypeConfig.video
    );
  }, []);

  const openEditLectureModal = useCallback(
    (lecture: Lecture, sectionId: string) => {
      setNewLecture({
        title: lecture.title,
        type: lecture.type,
        duration: lecture.duration,
        description: lecture.description,
      });
      setShowEditLectureModal({ sectionId, lectureId: lecture.id });
    },
    []
  );

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (
      e: React.DragEvent,
      type: "section" | "lecture",
      id: string,
      sectionId?: string
    ) => {
      setDraggedItem({ type, id, sectionId });
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetType: "section" | "lecture",
      targetId: string,
      dropTargetSectionId?: string
    ) => {
      e.preventDefault();
      if (!draggedItem) return;

      // Handle section reordering
      if (
        draggedItem.type === "section" &&
        targetType === "section" &&
        draggedItem.id !== targetId
      ) {
        const draggedIndex = sections.findIndex((s) => s.id === draggedItem.id);
        const targetIndex = sections.findIndex((s) => s.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const newSections = [...sections];
          const [draggedSection] = newSections.splice(draggedIndex, 1);
          newSections.splice(targetIndex, 0, draggedSection);
          updateSections(newSections);
          notifications.success("Section reordered");
        }
      }

      // Handle lecture reordering
      if (
        draggedItem.type === "lecture" &&
        targetType === "lecture" &&
        draggedItem.id !== targetId
      ) {
        const sourceSectionId = draggedItem.sectionId!;
        const targetSectionId = dropTargetSectionId!;

        const sourceSection = sections.find((s) => s.id === sourceSectionId);
        const targetSection = sections.find((s) => s.id === targetSectionId);

        if (sourceSection && targetSection) {
          const draggedLecture = sourceSection.lectures.find(
            (l) => l.id === draggedItem.id
          );
          const targetLectureIndex = targetSection.lectures.findIndex(
            (l) => l.id === targetId
          );

          if (draggedLecture && targetLectureIndex !== -1) {
            const newSections = sections.map((section) => {
              if (section.id === sourceSectionId) {
                return {
                  ...section,
                  lectures: section.lectures.filter(
                    (l) => l.id !== draggedItem.id
                  ),
                };
              }
              if (section.id === targetSectionId) {
                const newLectures = [...section.lectures];
                newLectures.splice(targetLectureIndex, 0, draggedLecture);
                return { ...section, lectures: newLectures };
              }
              return section;
            });

            updateSections(newSections);
            notifications.success("Lecture moved");
          }
        }
      }

      setDraggedItem(null);
    },
    [draggedItem, sections, updateSections, notifications]
  );

  const getStructureStats = useCallback(() => {
    const totalSections = sections.length;
    const totalLectures = getTotalLectures();
    const totalDuration = getTotalDuration();
    const lectureTypes = sections.reduce(
      (acc: Record<string, number>, section: Section) => {
        section.lectures.forEach((lecture: Lecture) => {
          acc[lecture.type] = (acc[lecture.type] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    return { totalSections, totalLectures, totalDuration, lectureTypes };
  }, [sections, getTotalLectures, getTotalDuration]);

  const stats = getStructureStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Course Structure
            </h2>
            <p className="text-gray-600 mt-2">
              Organize your course into sections and lectures for better
              learning flow
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                <span className="font-medium">{stats.totalDuration}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Video className="h-4 w-4 mr-1 text-green-500" />
                <span className="font-medium">
                  {stats.totalLectures} lectures
                </span>
              </div>
            </div>
            <button
              onClick={handleAddSection}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Section
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats.totalLectures > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.lectureTypes).map(([type, count]) => {
              const typeInfo = getLectureTypeInfo(type);
              const TypeIcon = typeInfo.icon;
              return (
                <div key={type} className="bg-white rounded-lg p-3 text-center">
                  <TypeIcon
                    className={`h-5 w-5 mx-auto mb-1 ${typeInfo.color}`}
                  />
                  <div className="text-lg font-semibold text-gray-900">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500">{typeInfo.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Structure Guidelines */}
      {sections.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">
                Structure Guidelines
              </h4>
              <p className="text-amber-700 text-sm mt-1">
                A well-structured course typically has 3-8 sections with 3-10
                lectures each. Start with an introduction section and end with a
                conclusion or next steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            draggable
            onDragStart={(e) => handleDragStart(e, "section", section.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "section", section.id)}
          >
            {/* Section Header */}
            <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <button
                onClick={() => toggleSection(section.id)}
                className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {openSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              <div className="flex items-center mr-3 text-gray-400 cursor-grab">
                <Grip className="h-5 w-5 hover:text-gray-600 transition-colors" />
              </div>

              <div className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {sectionIndex + 1}
                </div>
              </div>

              {editingSectionId === section.id ? (
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    autoFocus
                    onBlur={() => {
                      if (newSectionTitle.trim()) {
                        handleUpdateSection(section.id, newSectionTitle);
                      } else {
                        setEditingSectionId(null);
                        setNewSectionTitle("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSectionTitle.trim()) {
                        handleUpdateSection(section.id, newSectionTitle);
                      } else if (e.key === "Escape") {
                        setEditingSectionId(null);
                        setNewSectionTitle("");
                      }
                    }}
                    maxLength={100}
                  />
                </div>
              ) : (
                <h3 className="text-lg font-semibold flex-1 text-gray-900 mr-4 truncate">
                  {section.title}
                </h3>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {section.lectures.length}{" "}
                  {section.lectures.length === 1 ? "lecture" : "lectures"}
                </span>

                {section.lectures.length > 0 && (
                  <div className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                    {section.lectures.reduce(
                      (total: number, lecture: Lecture) =>
                        total + (lecture.duration || 0),
                      0
                    )}
                    m
                  </div>
                )}

                <button
                  onClick={() => handleDuplicateSection(section.id)}
                  disabled={isProcessing}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Duplicate section"
                >
                  <Copy className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    setEditingSectionId(section.id);
                    setNewSectionTitle(section.title);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit section"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section Content */}
            {openSections.includes(section.id) && (
              <div className="p-4">
                {section.lectures.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {section.lectures.map((lecture, lectureIndex) => {
                      const typeInfo = getLectureTypeInfo(lecture.type);
                      const TypeIcon = typeInfo.icon;

                      return (
                        <div
                          key={lecture.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(
                              e,
                              "lecture",
                              lecture.id,
                              section.id
                            )
                          }
                          onDragOver={handleDragOver}
                          onDrop={(e) =>
                            handleDrop(e, "lecture", lecture.id, section.id)
                          }
                        >
                          <div className="cursor-grab">
                            <Grip className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                          </div>

                          <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {lectureIndex + 1}
                          </div>

                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${typeInfo.bgColor}`}
                          >
                            <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                            <span
                              className={`text-xs font-medium ${typeInfo.color}`}
                            >
                              {typeInfo.name}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lecture.title}
                            </p>
                            {lecture.description && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {lecture.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {lecture.duration > 0 && (
                              <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                <Clock className="h-3 w-3 mr-1" />
                                {lecture.duration}m
                              </div>
                            )}

                            <button
                              onClick={() =>
                                handleDuplicateLecture(section.id, lecture.id)
                              }
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Duplicate lecture"
                            >
                              <Copy className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                openEditLectureModal(lecture, section.id)
                              }
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit lecture"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteLecture(section.id, lecture.id)
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete lecture"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                    <div className="text-center">
                      <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        No lectures yet
                      </p>
                      <p className="text-xs text-gray-400">
                        Add your first lecture to get started
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowAddLectureModal(section.id)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Lecture
                </button>
              </div>
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sections yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start building your course by adding your first section
            </p>
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Section
            </button>
          </div>
        )}
      </div>

      {/* Add Lecture Modal */}
      {showAddLectureModal && (
        <Dialog
          open={!!showAddLectureModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowAddLectureModal(null);
              setNewLecture({
                title: "",
                type: LESSON_TYPES[0],
                duration: 0,
                description: "",
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add New Lecture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter lecture title"
                  value={newLecture.title || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {LESSON_TYPES.map((type) => {
                    const typeInfo = getLectureTypeInfo(type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setNewLecture((prev) => ({
                            ...prev,
                            type: type,
                          }))
                        }
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          newLecture.type === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <TypeIcon className="h-5 w-5" />
                        <span className="font-medium">{typeInfo.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newLecture.duration || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this lecture"
                  value={newLecture.description || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  maxLength={300}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-400">
                    {(newLecture.description || "").length}/300
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddLectureModal(null);
                  setNewLecture({
                    title: "",
                    type: LESSON_TYPES[0],
                    duration: 0,
                    description: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newLecture.title && showAddLectureModal) {
                    handleAddLecture(showAddLectureModal);
                  }
                }}
                disabled={!newLecture.title?.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Lecture
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lecture Modal */}
      {showEditLectureModal && (
        <Dialog
          open={!!showEditLectureModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowEditLectureModal(null);
              setNewLecture({
                title: "",
                type: LESSON_TYPES[0],
                duration: 0,
                description: "",
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Edit Lecture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter lecture title"
                  value={newLecture.title || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  maxLength={100}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-400">
                    {(newLecture.title || "").length}/100
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {LESSON_TYPES.map((type) => {
                    const typeInfo = getLectureTypeInfo(type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setNewLecture((prev) => ({
                            ...prev,
                            type: type,
                          }))
                        }
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          newLecture.type === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <TypeIcon className="h-5 w-5" />
                        <span className="font-medium">{typeInfo.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newLecture.duration || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this lecture"
                  value={newLecture.description || ""}
                  onChange={(e) =>
                    setNewLecture((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  maxLength={300}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-400">
                    {(newLecture.description || "").length}/300
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditLectureModal(null);
                  setNewLecture({
                    title: "",
                    type: LESSON_TYPES[0],
                    duration: 0,
                    description: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newLecture.title && showEditLectureModal) {
                    handleUpdateLecture(
                      showEditLectureModal.sectionId,
                      showEditLectureModal.lectureId,
                      newLecture
                    );
                  }
                }}
                disabled={!newLecture.title?.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Bulk Actions */}
      {sections.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-800">Bulk Actions</h4>
              <p className="text-blue-700 text-sm mt-1">
                Manage multiple sections at once
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOpenSections(sections.map((s) => s.id));
                  notifications.success("All sections expanded");
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={() => {
                  setOpenSections([]);
                  notifications.success("All sections collapsed");
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structure Tips */}
      {sections.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">
                Course Structure Tips
              </h4>
              <ul className="text-green-700 text-sm mt-2 space-y-1">
                <li>• Use drag and drop to reorder sections and lectures</li>
                <li>
                  • Add different types of content to keep students engaged
                </li>
                <li>• Include quizzes and assignments to test understanding</li>
                <li>
                  • Keep individual lectures focused and under 15 minutes when
                  possible
                </li>
                <li>
                  • Use descriptive titles that clearly indicate what students
                  will learn
                </li>
                <li>• Group related topics together in logical sections</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Course Structure Summary */}
      {sections.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Structure Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalSections}
              </div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalLectures}
              </div>
              <div className="text-sm text-gray-600">Lectures</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalDuration}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {Object.keys(stats.lectureTypes).length}
              </div>
              <div className="text-sm text-gray-600">Content Types</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

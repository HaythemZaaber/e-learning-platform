"use client";

import { useState } from "react";
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
} from "lucide-react";
import { CourseData, Lecture, Section } from "../../types";







interface CourseStructureProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const lectureTypes = [
  { id: "video", name: "Video", icon: Video, color: "text-blue-600" },
  { id: "text", name: "Text", icon: FileText, color: "text-green-600" },
  { id: "quiz", name: "Quiz", icon: FileQuestion, color: "text-purple-600" },
  {
    id: "assignment",
    name: "Assignment",
    icon: FileSpreadsheet,
    color: "text-orange-600",
  },
  {
    id: "resource",
    name: "Resource",
    icon: FileArchive,
    color: "text-gray-600",
  },
];

export function CourseStructure({ data, updateData }: CourseStructureProps) {
  const [sections, setSections] = useState<Section[]>(
    data.sections || [{ id: "section-1", title: "Introduction", lectures: [] }]
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
    type: "video",
    duration: 0,
    description: "",
  });
  const [openSections, setOpenSections] = useState<string[]>(["section-1"]);

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `New Section`,
      lectures: [],
    };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    updateData({ sections: updatedSections });
    setOpenSections([...openSections, newSection.id]);
    setEditingSectionId(newSection.id);
    setNewSectionTitle("New Section");
  };

  const handleUpdateSection = (id: string, title: string) => {
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, title } : section
    );
    setSections(updatedSections);
    updateData({ sections: updatedSections });
    setEditingSectionId(null);
    setNewSectionTitle("");
  };

  const handleDeleteSection = (id: string) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
    updateData({ sections: updatedSections });
    setOpenSections(openSections.filter((sId) => sId !== id));
  };

  const handleAddLecture = (sectionId: string) => {
    const newLectureObj: Lecture = {
      id: `lecture-${Date.now()}`,
      title: newLecture.title || "",
      type: newLecture.type || "video",
      duration: newLecture.duration || 0,
      description: newLecture.description,
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

    setSections(updatedSections);
    updateData({ sections: updatedSections });
    setNewLecture({
      title: "",
      type: "video",
      duration: 0,
      description: "",
    });
    setShowAddLectureModal(null);
  };

  const handleUpdateLecture = (
    sectionId: string,
    lectureId: string,
    lectureData: Partial<Lecture>
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === lectureId ? { ...lecture, ...lectureData } : lecture
          ),
        };
      }
      return section;
    });

    setSections(updatedSections);
    updateData({ sections: updatedSections });
    setShowEditLectureModal(null);
    setNewLecture({
      title: "",
      type: "video",
      duration: 0,
      description: "",
    });
  };

  const handleDeleteLecture = (sectionId: string, lectureId: string) => {
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

    setSections(updatedSections);
    updateData({ sections: updatedSections });
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getTotalDuration = () => {
    let total = 0;
    sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        total += lecture.duration || 0;
      });
    });

    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    return `${hours}h ${minutes}m`;
  };

  const getTotalLectures = () => {
    return sections.reduce(
      (total, section) => total + section.lectures.length,
      0
    );
  };

  const getLectureTypeInfo = (type: string) => {
    return lectureTypes.find((lt) => lt.id === type) || lectureTypes[0];
  };

  const openEditLectureModal = (lecture: Lecture, sectionId: string) => {
    setNewLecture({
      title: lecture.title,
      type: lecture.type,
      duration: lecture.duration,
      description: lecture.description,
    });
    setShowEditLectureModal({ sectionId, lectureId: lecture.id });
  };

  return (
    <div className="space-y-6">
      {/* Header Section with improved styling */}
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
                <span className="font-medium">{getTotalDuration()}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Video className="h-4 w-4 mr-1 text-green-500" />
                <span className="font-medium">
                  {getTotalLectures()} lectures
                </span>
              </div>
            </div>
            <button
              onClick={handleAddSection}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Section Header */}
            <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
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

              <div className="flex items-center mr-3 text-gray-400">
                <Grip className="h-5 w-5 cursor-grab hover:text-gray-600 transition-colors" />
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
                  />
                </div>
              ) : (
                <h3 className="text-lg font-semibold flex-1 text-gray-900 mr-4">
                  {section.title}
                </h3>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {section.lectures.length}{" "}
                  {section.lectures.length === 1 ? "lecture" : "lectures"}
                </span>
                <button
                  onClick={() => {
                    setEditingSectionId(section.id);
                    setNewSectionTitle(section.title);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        >
                          <Grip className="h-4 w-4 text-gray-400 cursor-grab hover:text-gray-600 transition-colors" />

                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full bg-white border ${typeInfo.color}`}
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
                            <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                              <Clock className="h-3 w-3 mr-1" />
                              {lecture.duration} min
                            </div>
                            <button
                              onClick={() =>
                                openEditLectureModal(lecture, section.id)
                              }
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLecture(section.id, lecture.id)
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Lecture</h2>
                <button
                  onClick={() => {
                    setShowAddLectureModal(null);
                    setNewLecture({
                      title: "",
                      type: "video",
                      duration: 0,
                      description: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {lectureTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() =>
                          setNewLecture((prev) => ({
                            ...prev,
                            type: type.id as Lecture["type"],
                          }))
                        }
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          newLecture.type === type.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <TypeIcon className="h-5 w-5" />
                        <span className="font-medium">{type.name}</span>
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
                  min="1"
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
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddLectureModal(null);
                  setNewLecture({
                    title: "",
                    type: "video",
                    duration: 0,
                    description: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newLecture.title && showAddLectureModal) {
                    handleAddLecture(showAddLectureModal);
                  }
                }}
                disabled={!newLecture.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {showEditLectureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Lecture</h2>
                <button
                  onClick={() => {
                    setShowEditLectureModal(null);
                    setNewLecture({
                      title: "",
                      type: "video",
                      duration: 0,
                      description: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lecture Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {lectureTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() =>
                          setNewLecture((prev) => ({
                            ...prev,
                            type: type.id as Lecture["type"],
                          }))
                        }
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          newLecture.type === type.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <TypeIcon className="h-5 w-5" />
                        <span className="font-medium">{type.name}</span>
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
                  min="1"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-200 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditLectureModal(null);
                  setNewLecture({
                    title: "",
                    type: "video",
                    duration: 0,
                    description: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newLecture.title && showEditLectureModal) {
                    handleUpdateLecture(
                      showEditLectureModal.sectionId,
                      showEditLectureModal.lectureId,
                      newLecture
                    );
                  }
                }}
                disabled={!newLecture.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

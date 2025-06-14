"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CourseData, CourseSettings } from "../../types";

interface CourseSettingsProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "zh", name: "Chinese" },
  { id: "ja", name: "Japanese" },
  { id: "ko", name: "Korean" },
  { id: "ar", name: "Arabic" },
  { id: "hi", name: "Hindi" },
  { id: "pt", name: "Portuguese" },
];

export function CourseSettings({ data, updateData }: CourseSettingsProps) {
  const [settings, setSettings] = useState<CourseSettings>(data.settings);
  const [newTag, setNewTag] = useState("");

  const handleSettingsChange = (key: keyof CourseSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateData({ settings: newSettings });
  };

  const handleAccessibilityChange = (
    key: keyof CourseSettings["accessibility"],
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      accessibility: {
        ...settings.accessibility,
        [key]: value,
      },
    };
    setSettings(newSettings);
    updateData({ settings: newSettings });
  };

  const handleAddTag = () => {
    if (newTag && !settings.seoTags.includes(newTag)) {
      const newTags = [...settings.seoTags, newTag];
      setSettings({ ...settings, seoTags: newTags });
      updateData({ settings: { ...settings, seoTags: newTags } });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = settings.seoTags.filter((t: string) => t !== tag);
    setSettings({ ...settings, seoTags: newTags });
    updateData({ settings: { ...settings, seoTags: newTags } });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Course Visibility</Label>
                  <RadioGroup
                    value={settings.isPublic ? "public" : "private"}
                    onValueChange={(value: string) =>
                      handleSettingsChange("isPublic", value === "public")
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div>
                  <Label>Enrollment Type</Label>
                  <RadioGroup
                    value={settings.enrollmentType}
                    onValueChange={(value: string) =>
                      handleSettingsChange("enrollmentType", value)
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Paid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invite" id="invite" />
                      <Label htmlFor="invite">Invite Only</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div>
                  <Label>Course Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value: string) =>
                      handleSettingsChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="certificate">Course Certificate</Label>
                  <Switch
                    id="certificate"
                    checked={settings.certificate}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("certificate", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Accessibility Options</Label>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="captions">Video Captions</Label>
                      <Switch
                        id="captions"
                        checked={settings.accessibility.captions}
                        onCheckedChange={(checked) =>
                          handleAccessibilityChange("captions", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="transcripts">Text Transcripts</Label>
                      <Switch
                        id="transcripts"
                        checked={settings.accessibility.transcripts}
                        onCheckedChange={(checked) =>
                          handleAccessibilityChange("transcripts", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audio-description">
                        Audio Description
                      </Label>
                      <Switch
                        id="audio-description"
                        checked={settings.accessibility.audioDescription}
                        onCheckedChange={(checked) =>
                          handleAccessibilityChange("audioDescription", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>SEO Description</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Write a brief description of your course for search engines
                  </p>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={settings.seoDescription}
                    onChange={(e) =>
                      handleSettingsChange("seoDescription", e.target.value)
                    }
                    placeholder="Enter SEO description..."
                  />
                </div>

                <Separator />

                <div>
                  <Label>SEO Tags</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add relevant tags to help students find your course
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.seoTags.map((tag: string) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

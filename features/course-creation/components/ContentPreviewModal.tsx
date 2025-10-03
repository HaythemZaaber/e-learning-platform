"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, X, Copy, Download, Check } from "lucide-react";
import { ContentViewer } from "./ContentViewer";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  type: string;
  title: string;
}

export function ContentPreviewModal({
  isOpen,
  onClose,
  content,
  type,
  title,
}: ContentPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy =
      typeof content === "string" ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload =
      typeof content === "string" ? content : JSON.stringify(content, null, 2);
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.replace(/_/g, "-")}-preview.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Content downloaded successfully");
  };

  const getTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "lecture_outline":
        return "📚";
      case "assessment_questions":
        return "❓";
      case "seo_content":
        return "🔍";
      case "marketing_copy":
        return "📢";
      case "title_suggestions":
        return "💡";
      case "description_improvement":
        return "📝";
      case "learning_objectives":
        return "🎯";
      case "target_audience":
        return "👥";
      default:
        return "📄";
    }
  };

  const getTypeColor = (contentType: string) => {
    switch (contentType) {
      case "lecture_outline":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "assessment_questions":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "seo_content":
        return "bg-green-50 text-green-700 border-green-200";
      case "marketing_copy":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "title_suggestions":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "description_improvement":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "learning_objectives":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "target_audience":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Parse content if it's a string containing JSON
  let parsedContent = content;
  if (typeof content === "string") {
    try {
      // First, try to extract JSON from markdown code blocks
      let jsonString = content;
      if (content.includes("```json")) {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1].trim();
        }
      }

      // Try to parse the JSON
      parsedContent = JSON.parse(jsonString);
    } catch {
      // If not valid JSON, keep as string
      parsedContent = content;
    }
  }

  // Render based on content type
  const renderContent = () => {
    switch (type) {
      case "lecture_outline":
        return <LectureOutlineView content={parsedContent} />;
      case "assessment_questions":
        return <AssessmentQuestionsView content={parsedContent} />;
      case "seo_content":
        return <SEOContentView content={parsedContent} />;
      case "marketing_copy":
        return <MarketingCopyView content={parsedContent} />;
      case "title_suggestions":
        return <TitleSuggestionsView content={parsedContent} />;
      case "description_improvement":
        return <DescriptionImprovementView content={parsedContent} />;
      case "learning_objectives":
        return <LearningObjectivesView content={parsedContent} />;
      case "target_audience":
        return <TargetAudienceView content={parsedContent} />;
      default:
        return <RawContentView content={parsedContent} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getTypeIcon(type)}</div>
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                <Badge className={`mt-1 ${getTypeColor(type)}`}>
                  {type.replace(/_/g, " ").toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2 mr-4"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full min-h-0">
            <div className="p-6">
              <div className="space-y-4">{renderContent()}</div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Preview Mode</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Content Ready</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Type: {type.replace(/_/g, " ")}</span>
              <Badge variant="outline" className="text-xs">
                Generated Content
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// View components for content display

// Marketing Copy View
function MarketingCopyView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3 bg-purple-50">
          <CardTitle className="text-base font-bold text-purple-800 flex items-center gap-2">
            <span className="text-lg">📢</span>
            Marketing Copy
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle different marketing copy structures
  const marketingData =
    content.marketingMaterials || content.marketing_copy || content;
  const tagline = marketingData.tagline || content.tagline;
  const keyBenefits =
    marketingData.keyBenefits ||
    marketingData.key_benefits ||
    content.key_benefits ||
    [];
  const socialMediaPost =
    marketingData.socialMediaPost ||
    marketingData.social_media_post ||
    content.social_media_post;
  const emailSubjectLines =
    marketingData.emailSubjectLines ||
    marketingData.email_subject_lines ||
    content.email_subject_lines ||
    [];

  return (
    <div className="space-y-4">
      {/* Course Information Header */}
      {content.title && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              {content.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-purple-600 border-purple-300"
              >
                {content.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-purple-600 border-purple-300"
              >
                {content.level}
              </Badge>
            </div>
          </CardHeader>
          {content.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-purple-700 leading-relaxed">
                {content.description}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {tagline && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Course Tagline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-purple-900 leading-relaxed">
              {tagline}
            </p>
          </CardContent>
        </Card>
      )}

      {Array.isArray(keyBenefits) && keyBenefits.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">✨</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {keyBenefits.map((benefit: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <Badge className="mt-0.5 bg-green-600 text-white shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {socialMediaPost && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <span className="text-lg">📱</span>
              Social Media Post{" "}
              <Badge variant="outline" className="ml-2">
                280 chars
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <p className="text-sm leading-relaxed text-gray-800">
                {socialMediaPost}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Character count: {socialMediaPost.length}/280
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {Array.isArray(emailSubjectLines) && emailSubjectLines.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">📧</span>
              Email Subject Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emailSubjectLines.map((subject: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Badge variant="outline" className="shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// SEO Content View
function SEOContentView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3 bg-green-50">
          <CardTitle className="text-base font-bold text-green-800 flex items-center gap-2">
            <span className="text-lg">🔍</span>
            SEO Content
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle nested seo_optimization structure
  const seoData = content.seo_optimization || content;
  const keywords = seoData.keywords || [];
  const metaDescription = seoData.meta_description || "";
  const optimizedTitles =
    seoData.optimized_title_variations || seoData.optimized_titles || [];
  const tags = seoData.tags || [];

  return (
    <div className="space-y-4">
      {/* Course Information Header */}
      {content.course_title && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <span className="text-xl">🔍</span>
              {content.course_title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-300"
              >
                {content.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-green-600 border-green-300"
              >
                {content.level}
              </Badge>
            </div>
          </CardHeader>
          {content.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-green-700 leading-relaxed">
                {content.description}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {keywords.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🔍</span>
              SEO Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string, index: number) => (
                <Badge
                  key={index}
                  className="bg-indigo-100 text-indigo-700 border-indigo-300 text-sm py-1.5 px-3"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {metaDescription && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">📝</span>
              Meta Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white p-4 rounded-lg border-2 border-green-300">
              <p className="text-sm leading-relaxed text-gray-800">
                {metaDescription}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700 font-medium">
                Length: {metaDescription.length} characters
              </span>
              <Badge
                variant={
                  metaDescription.length >= 150 && metaDescription.length <= 160
                    ? "default"
                    : "destructive"
                }
              >
                {metaDescription.length >= 150 && metaDescription.length <= 160
                  ? "Perfect"
                  : "Adjust Length"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {optimizedTitles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              Optimized Title Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizedTitles.map((title: string, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5 bg-blue-600 shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-800 leading-relaxed">
                      {title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              Recommended Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1.5 px-3"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Assessment Questions View
function AssessmentQuestionsView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3 bg-blue-50">
          <CardTitle className="text-base font-bold text-blue-800 flex items-center gap-2">
            <span className="text-lg">❓</span>
            Assessment Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  const questions = Array.isArray(content)
    ? content
    : content.assessment_questions || content.questions || [];

  return (
    <div className="space-y-4">
      {/* Course Information Header */}
      {content.course && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
              <span className="text-xl">📚</span>
              {content.course.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-300"
              >
                {content.course.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-300"
              >
                {content.course.level}
              </Badge>
            </div>
          </CardHeader>
          {content.course.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-blue-700 leading-relaxed">
                {content.course.description}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Questions */}
      {questions.map((q: any, index: number) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3 bg-blue-50">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <span className="text-blue-600">Q{q.id || index + 1}.</span>
                <span>{q.question}</span>
              </CardTitle>
              <div className="flex gap-2 shrink-0">
                <Badge variant="outline" className="capitalize">
                  {q.type || "Multiple Choice"}
                </Badge>
                {q.difficulty && (
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      q.difficulty === "easy"
                        ? "text-green-600 border-green-300"
                        : q.difficulty === "medium"
                        ? "text-yellow-600 border-yellow-300"
                        : "text-red-600 border-red-300"
                    }`}
                  >
                    {q.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {q.options && Array.isArray(q.options) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Options:
                </p>
                {q.options.map((option: string, i: number) => {
                  // Handle different correct_answer formats
                  let isCorrect = false;
                  if (typeof q.correct_answer === "string") {
                    // For multiple choice, check if this option's letter matches
                    const optionLetter = String.fromCharCode(65 + i);
                    isCorrect = q.correct_answer === optionLetter;
                  } else if (typeof q.correct_answer === "number") {
                    // For numeric index
                    isCorrect = i === q.correct_answer;
                  } else if (typeof q.correct_answer === "boolean") {
                    // For true/false questions, this won't apply to options
                    isCorrect = false;
                  }

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg transition-all ${
                        isCorrect
                          ? "bg-green-100 border-2 border-green-400"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Badge
                          className={`shrink-0 ${
                            isCorrect ? "bg-green-600" : "bg-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </Badge>
                        <span className="text-sm flex-1">{option}</span>
                        {isCorrect && (
                          <Badge className="bg-green-600 text-xs shrink-0">
                            ✓ Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Handle True/False questions */}
            {q.type === "true_false" && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Answer:
                </p>
                <div
                  className={`p-3 rounded-lg border-2 ${
                    q.correct_answer === true
                      ? "bg-green-100 border-green-400"
                      : "bg-red-100 border-red-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`shrink-0 ${
                        q.correct_answer === true
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {q.correct_answer === true ? "TRUE" : "FALSE"}
                    </Badge>
                    <span className="text-sm font-medium">
                      {q.correct_answer === true
                        ? "Correct Answer"
                        : "Correct Answer"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Handle Short Answer questions */}
            {q.type === "short_answer" && q.correct_answer && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Expected Answer:
                </p>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-800 font-medium">
                    {q.correct_answer}
                  </span>
                </div>
              </div>
            )}

            {q.explanation && (
              <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 rounded-r-lg">
                <p className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Explanation:
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Title Suggestions View
function TitleSuggestionsView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-3 bg-yellow-50">
          <CardTitle className="text-base font-bold text-yellow-800 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Title Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  const titles = Array.isArray(content) ? content : content.titles || [];

  return (
    <div className="space-y-3">
      {titles.map((title: string, index: number) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-400"
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <Badge className="mt-1 bg-purple-600 text-white shrink-0 w-8 h-8 flex items-center justify-center text-base">
                {index + 1}
              </Badge>
              <p className="text-base font-semibold text-gray-800 leading-relaxed flex-1">
                {title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Description Improvement View
function DescriptionImprovementView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader className="pb-3 bg-pink-50">
          <CardTitle className="text-base font-bold text-pink-800 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Description Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle object content - check for different possible structures
  let descriptions: any[] = [];

  if (Array.isArray(content)) {
    // If it's an array, check if it contains objects with description properties
    descriptions = content.map((item, index) => {
      if (typeof item === "string") {
        return item;
      } else if (item && typeof item === "object") {
        // If it's an object, extract the description or use the whole object
        return item.description || item.title || JSON.stringify(item, null, 2);
      }
      return String(item);
    });
  } else if (content && typeof content === "object") {
    // Check for various possible property names
    descriptions =
      content.descriptions ||
      content.description_improvements ||
      content.improvements ||
      content.versions ||
      [];

    // If still no descriptions found, try to extract from other properties
    if (descriptions.length === 0) {
      // Check if there are individual description properties
      const possibleDescriptions = [];
      for (const key in content) {
        if (
          typeof content[key] === "string" &&
          key.toLowerCase().includes("description")
        ) {
          possibleDescriptions.push(content[key]);
        }
      }
      descriptions = possibleDescriptions;
    }
  }

  // If no descriptions found, show a fallback
  if (descriptions.length === 0) {
    return (
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader className="pb-3 bg-pink-50">
          <CardTitle className="text-base font-bold text-pink-800 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Description Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {descriptions.map((desc: any, index: number) => {
        // Check if the original content item has a title
        const originalItem = Array.isArray(content) ? content[index] : null;
        const hasTitle =
          originalItem &&
          typeof originalItem === "object" &&
          originalItem.title;

        return (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3 bg-purple-50">
              <CardTitle className="text-sm font-bold text-purple-800 flex items-center gap-2">
                <span>📄</span>
                {hasTitle ? originalItem.title : `Version ${index + 1}`}
              </CardTitle>
              {hasTitle && originalItem.category && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {originalItem.category}
                  </Badge>
                  {originalItem.level && (
                    <Badge variant="secondary" className="text-xs">
                      {originalItem.level}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                {typeof desc === "string"
                  ? desc
                  : JSON.stringify(desc, null, 2)}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Word count:{" "}
                  {typeof desc === "string" ? desc.split(" ").length : 0} words
                  | Characters: {typeof desc === "string" ? desc.length : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Learning Objectives View
function LearningObjectivesView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-3 bg-emerald-50">
          <CardTitle className="text-base font-bold text-emerald-800 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle different learning objectives structures
  const objectives = Array.isArray(content)
    ? content
    : content.learning_objectives || content.objectives || [];

  return (
    <div className="space-y-4">
      {/* Course Information Header */}
      {content.title && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              {content.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-300"
              >
                {content.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-300"
              >
                {content.level}
              </Badge>
            </div>
          </CardHeader>
          {content.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-emerald-700 leading-relaxed">
                {content.description}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Learning Objectives */}
      {Array.isArray(objectives) && objectives.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {objectives.map((objective: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <Badge className="mt-0.5 bg-blue-600 text-white w-8 h-8 flex items-center justify-center text-base shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-sm flex-1 leading-relaxed font-medium text-gray-800">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Target Audience View
function TargetAudienceView({ content }: { content: any }) {
  // Handle string content
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3 bg-orange-50">
          <CardTitle className="text-base font-bold text-orange-800 flex items-center gap-2">
            <span className="text-lg">👥</span>
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle nested target_audience structure
  const audienceData = content.target_audience || content;
  const demographics = audienceData.demographics || {};
  const priorKnowledge = audienceData.prior_knowledge_level || {};
  const careerGoals = audienceData.career_goals || [];
  const learningMotivations = audienceData.learning_motivations || [];
  const painPoints = audienceData.pain_points_solved || [];

  return (
    <div className="space-y-4">
      {/* Course Information Header */}
      {content.title && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
              <span className="text-xl">👥</span>
              {content.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-300"
              >
                {content.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-300"
              >
                {content.level}
              </Badge>
            </div>
          </CardHeader>
          {content.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-orange-700 leading-relaxed">
                {content.description}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Demographics */}
      {Object.keys(demographics).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">👥</span>
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demographics.age_range && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  🎂 Age: {demographics.age_range}
                </Badge>
              </div>
            )}
            {demographics.profession && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Target Professions:
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {demographics.profession}
                </p>
              </div>
            )}
            {demographics.location && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  🌍 Location: {demographics.location}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prior Knowledge Level */}
      {Object.keys(priorKnowledge).length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <span className="text-lg">📚</span>
              Prior Knowledge Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorKnowledge.required &&
              Array.isArray(priorKnowledge.required) && (
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                    Required Knowledge:
                  </p>
                  <ul className="space-y-2">
                    {priorKnowledge.required.map(
                      (req: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-2 bg-blue-100 rounded"
                        >
                          <span className="text-blue-600 font-bold shrink-0">
                            ✓
                          </span>
                          <span className="text-sm text-blue-900 flex-1">
                            {req}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {priorKnowledge.not_required &&
              Array.isArray(priorKnowledge.not_required) && (
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                    Not Required:
                  </p>
                  <ul className="space-y-2">
                    {priorKnowledge.not_required.map(
                      (notReq: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-2 bg-blue-100 rounded"
                        >
                          <span className="text-blue-600 font-bold shrink-0">
                            ✗
                          </span>
                          <span className="text-sm text-blue-900 flex-1">
                            {notReq}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Career Goals */}
      {Array.isArray(careerGoals) && careerGoals.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Career Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {careerGoals.map((goal: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-2 bg-green-100 rounded"
                >
                  <span className="text-green-600 font-bold">🎯</span>
                  <span className="text-sm text-green-900 flex-1">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Learning Motivations */}
      {Array.isArray(learningMotivations) && learningMotivations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              Learning Motivations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {learningMotivations.map((motivation: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-2 bg-purple-50 rounded"
                >
                  <span className="text-purple-600 font-bold">💡</span>
                  <span className="text-sm flex-1">{motivation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pain Points */}
      {Array.isArray(painPoints) && painPoints.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Pain Points This Course Solves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {painPoints.map((pain: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200"
                >
                  <span className="text-amber-600 font-bold text-lg shrink-0">
                    →
                  </span>
                  <span className="text-sm text-amber-900 flex-1 leading-relaxed">
                    {pain}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Lecture Outline View
function LectureOutlineView({ content }: { content: any }) {
  // Handle both string (markdown) and object formats
  if (typeof content === "string") {
    return (
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="pb-3 bg-indigo-50">
          <CardTitle className="text-base font-bold text-indigo-800 flex items-center gap-2">
            <span className="text-lg">📚</span>
            Lecture Outline
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle new structure: array of sections with lectures
  const sections = Array.isArray(content)
    ? content
    : content.sections || content.outlines || [];

  return (
    <div className="space-y-6">
      {sections.map((section: any, sectionIndex: number) => (
        <div key={sectionIndex} className="space-y-4">
          {/* Section Header */}
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <span className="text-xl">📖</span>
                {section.sectionTitle ||
                  section.title ||
                  `Section ${sectionIndex + 1}`}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Lectures in this section */}
          {section.lectures && Array.isArray(section.lectures) && (
            <div className="space-y-4 ml-4">
              {section.lectures.map((lecture: any, lectureIndex: number) => (
                <Card
                  key={lectureIndex}
                  className="border-l-4 border-l-indigo-500"
                >
                  <CardHeader className="pb-3 bg-indigo-50">
                    <CardTitle className="text-base font-bold text-indigo-800 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      {lecture.title || `Lecture ${lectureIndex + 1}`}
                    </CardTitle>
                    {lecture.estimatedDuration && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm">
                          ⏱️ {lecture.estimatedDuration}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {lecture.learningObjectives && (
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Learning Objectives:
                        </p>
                        <ul className="space-y-2">
                          {lecture.learningObjectives.map(
                            (obj: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm p-2 bg-blue-50 rounded"
                              >
                                <span className="text-indigo-600 font-bold shrink-0">
                                  →
                                </span>
                                <span className="flex-1">{obj}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {lecture.keyTopics && (
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Key Topics:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lecture.keyTopics.map((topic: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-sm py-1.5 px-3"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {lecture.teachingMethods && (
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Teaching Methods:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lecture.teachingMethods.map(
                            (method: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-sm py-1.5 px-3 bg-green-50 text-green-700 border-green-300"
                              >
                                📚 {method}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Raw Content View (fallback)
function RawContentView({ content }: { content: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Generated Content</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 leading-relaxed">
          {typeof content === "string"
            ? content
            : JSON.stringify(content, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

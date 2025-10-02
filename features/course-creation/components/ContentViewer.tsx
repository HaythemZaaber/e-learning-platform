"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContentViewerProps {
  content: any;
  type: string;
}

export function ContentViewer({ content, type }: ContentViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.replace(/_/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully');
  };

  // Parse content if it's a string containing JSON
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // If not valid JSON, keep as string
      parsedContent = content;
    }
  }

  // Render based on content type
  const renderContent = () => {
    switch (type) {
      case 'lecture_outline':
        return <LectureOutlineView content={parsedContent} />;
      case 'assessment_questions':
        return <AssessmentQuestionsView content={parsedContent} />;
      case 'seo_content':
        return <SEOContentView content={parsedContent} />;
      case 'marketing_copy':
        return <MarketingCopyView content={parsedContent} />;
      case 'title_suggestions':
        return <TitleSuggestionsView content={parsedContent} />;
      case 'description_improvement':
        return <DescriptionImprovementView content={parsedContent} />;
      case 'learning_objectives':
        return <LearningObjectivesView content={parsedContent} />;
      case 'target_audience':
        return <TargetAudienceView content={parsedContent} />;
      default:
        return <RawContentView content={parsedContent} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 sticky top-0 bg-white z-10 py-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? 'Copied!' : 'Copy All'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </div>

      {/* Content Display */}
      {/* <div className="space-y-4">
        {renderContent()}
      </div> */}
    </div>
  );
}

// Marketing Copy View
function MarketingCopyView({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      {content.tagline && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Course Tagline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-purple-900 leading-relaxed">{content.tagline}</p>
          </CardContent>
        </Card>
      )}

      {content.key_benefits && Array.isArray(content.key_benefits) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">✨</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {content.key_benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
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

      {content.social_media_post && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <span className="text-lg">📱</span>
              Social Media Post <Badge variant="outline" className="ml-2">280 chars</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <p className="text-sm leading-relaxed text-gray-800">{content.social_media_post}</p>
              <p className="text-xs text-gray-500 mt-3">
                Character count: {content.social_media_post.length}/280
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {content.email_subject_lines && Array.isArray(content.email_subject_lines) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">📧</span>
              Email Subject Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.email_subject_lines.map((subject: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
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
  return (
    <div className="space-y-4">
      {content.keywords && Array.isArray(content.keywords) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🔍</span>
              SEO Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword: string, index: number) => (
                <Badge key={index} className="bg-indigo-100 text-indigo-700 border-indigo-300 text-sm py-1.5 px-3">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.meta_description && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">📝</span>
              Meta Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white p-4 rounded-lg border-2 border-green-300">
              <p className="text-sm leading-relaxed text-gray-800">{content.meta_description}</p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700 font-medium">
                Length: {content.meta_description.length} characters
              </span>
              <Badge variant={content.meta_description.length >= 150 && content.meta_description.length <= 160 ? "default" : "destructive"}>
                {content.meta_description.length >= 150 && content.meta_description.length <= 160 ? 'Perfect' : 'Adjust Length'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {content.optimized_titles && Array.isArray(content.optimized_titles) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              Optimized Title Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.optimized_titles.map((title: string, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5 bg-blue-600 shrink-0">{index + 1}</Badge>
                    <span className="text-sm font-semibold text-gray-800 leading-relaxed">{title}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.tags && Array.isArray(content.tags) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              Recommended Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
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
  const questions = Array.isArray(content) ? content : content.questions || [];

  return (
    <div className="space-y-4">
      {questions.map((q: any, index: number) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3 bg-blue-50">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <span className="text-blue-600">Q{index + 1}.</span>
                <span>{q.question}</span>
              </CardTitle>
              <Badge variant="outline" className="capitalize shrink-0">
                {q.type || 'Multiple Choice'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {q.options && Array.isArray(q.options) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Options:</p>
                {q.options.map((option: string, i: number) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg transition-all ${
                      i === q.correct_answer 
                        ? 'bg-green-100 border-2 border-green-400' 
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Badge className={`shrink-0 ${i === q.correct_answer ? 'bg-green-600' : 'bg-gray-400'}`}>
                        {String.fromCharCode(65 + i)}
                      </Badge>
                      <span className="text-sm flex-1">{option}</span>
                      {i === q.correct_answer && (
                        <Badge className="bg-green-600 text-xs shrink-0">✓ Correct</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {q.explanation && (
              <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 rounded-r-lg">
                <p className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Explanation:
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">{q.explanation}</p>
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
  const titles = Array.isArray(content) ? content : content.titles || [];

  return (
    <div className="space-y-3">
      {titles.map((title: string, index: number) => (
        <Card key={index} className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-400">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <Badge className="mt-1 bg-purple-600 text-white shrink-0 w-8 h-8 flex items-center justify-center text-base">
                {index + 1}
              </Badge>
              <p className="text-base font-semibold text-gray-800 leading-relaxed flex-1">{title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Description Improvement View
function DescriptionImprovementView({ content }: { content: any }) {
  const descriptions = Array.isArray(content) ? content : content.descriptions || [];

  return (
    <div className="space-y-4">
      {descriptions.map((desc: string, index: number) => (
        <Card key={index} className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3 bg-purple-50">
            <CardTitle className="text-sm font-bold text-purple-800 flex items-center gap-2">
              <span>📄</span>
              Version {index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{desc}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Word count: {desc.split(' ').length} words | Characters: {desc.length}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Learning Objectives View
function LearningObjectivesView({ content }: { content: any }) {
  const objectives = Array.isArray(content) ? content : content.objectives || [];

  return (
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
            <li key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Badge className="mt-0.5 bg-blue-600 text-white w-8 h-8 flex items-center justify-center text-base shrink-0">
                {index + 1}
              </Badge>
              <span className="text-sm flex-1 leading-relaxed font-medium text-gray-800">{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Target Audience View
function TargetAudienceView({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      {content.demographics && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">👥</span>
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{content.demographics}</p>
          </CardContent>
        </Card>
      )}

      {content.prior_knowledge && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <span className="text-lg">📚</span>
              Prior Knowledge Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 leading-relaxed">{content.prior_knowledge}</p>
          </CardContent>
        </Card>
      )}

      {content.career_goals && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Career Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-900 leading-relaxed">{content.career_goals}</p>
          </CardContent>
        </Card>
      )}

      {content.learning_motivations && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              Learning Motivations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(Array.isArray(content.learning_motivations) 
                ? content.learning_motivations 
                : [content.learning_motivations]
              ).map((motivation: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-2 bg-purple-50 rounded">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm flex-1">{motivation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.pain_points && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Pain Points This Course Solves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(Array.isArray(content.pain_points) 
                ? content.pain_points 
                : [content.pain_points]
              ).map((pain: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200">
                  <span className="text-amber-600 font-bold text-lg shrink-0">→</span>
                  <span className="text-sm text-amber-900 flex-1 leading-relaxed">{pain}</span>
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
  const outlines = Array.isArray(content) ? content : content.outlines || [];

  return (
    <div className="space-y-4">
      {outlines.map((outline: any, index: number) => (
        <Card key={index} className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3 bg-indigo-50">
            <CardTitle className="text-base font-bold text-indigo-800">
              {outline.title || `Lecture ${index + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {outline.objectives && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Learning Objectives:</p>
                <ul className="space-y-2">
                  {outline.objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm p-2 bg-blue-50 rounded">
                      <span className="text-indigo-600 font-bold shrink-0">→</span>
                      <span className="flex-1">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outline.topics && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Key Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {outline.topics.map((topic: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {outline.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                <Badge variant="outline" className="text-sm">
                  ⏱️ Duration: {outline.duration}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
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
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}




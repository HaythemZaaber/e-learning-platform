"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Lightbulb, 
  BarChart3, 
  Wand2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Search,
  Sparkles,
  MessageSquare,
  BookOpen,
  PenTool,
  Loader2,
  Star,
  Zap,
  FileText,
  Award,
  Clock,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AIAssistantService, CourseSuggestion, CourseAnalysis } from '../services/aiAssistantService';
import { toast } from "sonner";

interface SmartAssistantProps {
  data: any;
  updateData: (data: any) => void;
  onClose: () => void;
  contentByLecture?: any;
  currentStep?: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: CourseSuggestion[];
}

interface GenerationRequest {
  type: string;
  title: string;
  description: string;
  icon: any;
  loading: boolean;
}

export function SmartAssistant({
  data,
  updateData,
  onClose,
  contentByLecture = {},
  currentStep = 0,
}: SmartAssistantProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI course creation assistant. I can help you with suggestions, analyze your course, generate content, and answer any questions about course development.",
      timestamp: new Date(),
    },
  ]);
  
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([]);
  const [analysis, setAnalysis] = useState<CourseAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [generationRequests, setGenerationRequests] = useState<GenerationRequest[]>([
    {
      type: 'lecture_outline',
      title: 'Lecture Outlines',
      description: 'Generate detailed lecture outlines based on your course structure.',
      icon: BookOpen,
      loading: false,
    },
    {
      type: 'assessment_questions',
      title: 'Assessment Questions',
      description: 'Create quiz questions and assignments for each section.',
      icon: FileText,
      loading: false,
    },
    {
      type: 'seo_content',
      title: 'SEO Optimization',
      description: 'Optimize your course title, description, and tags for search.',
      icon: Search,
      loading: false,
    },
    {
      type: 'marketing_copy',
      title: 'Marketing Copy',
      description: 'Create compelling marketing materials for your course.',
      icon: TrendingUp,
      loading: false,
    },
  ]);
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>({});
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef<AIAssistantService | null>(null);

  // Initialize AI service
  useEffect(() => {
    // Initialize with your API endpoints
    aiService.current = new AIAssistantService(
      process.env.NEXT_PUBLIC_API_URL || '/api',
      process.env.NEXT_PUBLIC_AI_API_KEY || ''
    );
    
    // Generate initial suggestions
    generateInitialSuggestions();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Auto-generate suggestions when course data changes
  useEffect(() => {
    if (data.title && data.description) {
      const timer = setTimeout(() => {
        generateInitialSuggestions();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data.title, data.description, data.category, currentStep]);

  const generateInitialSuggestions = async () => {
    if (!aiService.current) return;
    
    setIsGeneratingSuggestions(true);
    try {
      const suggestions = await aiService.current.generateSuggestions({
        type: 'suggestion',
        context: {
          courseData: data,
          currentStep,
          contentByLecture,
        },
      });
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast.error('Failed to generate AI suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || !aiService.current) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await aiService.current.chatWithAI(query, {
        courseData: data,
        currentStep,
        contentByLecture,
        userQuery: query,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      toast.error('Failed to chat with AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: CourseSuggestion) => {
    switch (suggestion.type) {
      case 'title':
        updateData({ title: suggestion.content });
        break;
      case 'description':
        updateData({ description: suggestion.content });
        break;
      case 'structure':
        if (suggestion.metadata?.sections) {
          updateData({ sections: suggestion.metadata.sections });
        }
        break;
      case 'seo':
        if (suggestion.metadata?.tags) {
          updateData({ 
            settings: { 
              ...data.settings, 
              seoTags: suggestion.metadata.tags,
              seoDescription: suggestion.metadata.description || suggestion.content
            } 
          });
        }
        break;
      case 'pricing':
        if (suggestion.metadata?.price) {
          updateData({ price: suggestion.metadata.price });
        }
        break;
      default:
        break;
    }
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    toast.success('Suggestion applied successfully!');
  };

  const analyzeCourse = async () => {
    if (!aiService.current) return;
    
    setIsAnalyzing(true);
    try {
      const courseAnalysis = await aiService.current.analyzeCourse(data, contentByLecture);
      setAnalysis(courseAnalysis);
      setActiveTab("analysis");
      toast.success('Course analysis completed!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze course');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshSuggestions = async () => {
    await generateInitialSuggestions();
  };

  const handleGenerateContent = async (type: string) => {
    if (!aiService.current) return;

    setGenerationRequests(prev => 
      prev.map(req => req.type === type ? { ...req, loading: true } : req)
    );

    try {
      const content = await aiService.current.generateContent(type, {
        courseData: data,
        contentByLecture,
        currentStep,
      });

      setGeneratedContent(prev => ({
        ...prev,
        [type]: content,
      }));

      toast.success(`${type.replace('_', ' ')} generated successfully!`);
    } catch (error) {
      console.error(`Failed to generate ${type}:`, error);
      toast.error(`Failed to generate ${type.replace('_', ' ')}`);
    } finally {
      setGenerationRequests(prev => 
        prev.map(req => req.type === type ? { ...req, loading: false } : req)
      );
    }
  };

  const handleQuickAction = async (action: string) => {
    const actions: Record<string, () => Promise<void>> = {
      'improve_title': () => handleGenerateContent('title_suggestions'),
      'expand_description': () => handleGenerateContent('description_improvement'),
      'generate_objectives': () => handleGenerateContent('learning_objectives'),
      'define_audience': () => handleGenerateContent('target_audience'),
    };

    if (actions[action]) {
      await actions[action]();
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'title': return <PenTool className="h-4 w-4" />;
      case 'description': return <BookOpen className="h-4 w-4" />;
      case 'structure': return <Target className="h-4 w-4" />;
      case 'seo': return <Search className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'content': return <FileText className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span>AI Course Assistant</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col min-h-0">
            <TabsList className="grid grid-cols-4 mb-4 flex-shrink-0">
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
                {suggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {suggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analysis
                {analysis && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden min-h-0">
              <TabsContent value="suggestions" className="h-full flex flex-col data-[state=active]:flex data-[state=active]:flex-col min-h-0">
                <div className="flex items-center justify-between flex-shrink-0 p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    AI Suggestions
                  </h3>
                  <Button
                    onClick={refreshSuggestions}
                    disabled={isGeneratingSuggestions}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingSuggestions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh
                  </Button>
                </div>

                                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 min-h-full">
                      {isGeneratingSuggestions ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600">Generating AI suggestions...</p>
                            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                          </div>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <div className="space-y-4">
                          {suggestions.map((suggestion) => (
                            <Card key={suggestion.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    {getSuggestionIcon(suggestion.type)}
                                    {suggestion.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div 
                                        className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence)}`} 
                                      />
                                      <span className="text-xs text-gray-500">
                                        {Math.round(suggestion.confidence * 100)}%
                                      </span>
                                    </div>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {suggestion.type}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm leading-relaxed">{suggestion.content}</p>
                                <div className="bg-blue-50 border-l-4 border-l-blue-400 p-3 rounded-r">
                                  <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                                    <Lightbulb className="h-3 w-3" />
                                    Why this helps:
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.reasoning}</p>
                                </div>
                                {suggestion.actionable && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplySuggestion(suggestion)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Apply Suggestion
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-30" />
                          <h4 className="font-medium mb-2">No suggestions available</h4>
                          <p className="text-sm">Add more course details or try refreshing to get AI suggestions.</p>
                          <Button 
                            onClick={refreshSuggestions} 
                            variant="outline" 
                            className="mt-4"
                            disabled={isGeneratingSuggestions}
                          >
                            Generate Suggestions
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="h-full flex flex-col min-h-0">
                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 space-y-4 min-h-full">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-4 py-3 ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900 border"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.role === "assistant" && (
                                <Bot className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-lg px-4 py-3 bg-gray-100 border">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-gray-600">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex gap-2 p-4 border-t bg-gray-50">
                  <Input
                    placeholder="Ask about course creation, get suggestions, or request specific help..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!query.trim() || isLoading}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick prompts */}
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Help me improve my course title",
                      "What's missing from my course?",
                      "How should I structure this course?",
                      "Suggest a good price for my course"
                    ].map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setQuery(prompt)}
                        disabled={isLoading}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="h-full flex flex-col min-h-0">
                <div className="flex items-center justify-between flex-shrink-0 p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Course Analysis
                  </h3>
                  <Button
                    onClick={analyzeCourse}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    {analysis ? 'Refresh Analysis' : 'Analyze Course'}
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                        <p className="text-gray-600">Analyzing your course...</p>
                        <p className="text-sm text-gray-500 mt-1">This comprehensive analysis may take a moment</p>
                      </div>
                    </div>
                  ) : analysis ? (
                    <ScrollArea className="h-full min-h-0">
                      <div className="p-4 space-y-6 min-h-full">
                      {/* Overall Score Summary */}
                      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-800">
                            <Award className="h-5 w-5" />
                            Overall Course Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.completeness.score)}`}>
                                {analysis.completeness.score}%
                              </div>
                              <p className="text-sm text-gray-600">Completeness</p>
                            </div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.quality.score)}`}>
                                {analysis.quality.score}%
                              </div>
                              <p className="text-sm text-gray-600">Quality</p>
                            </div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.marketability.score)}`}>
                                {analysis.marketability.score}%
                              </div>
                              <p className="text-sm text-gray-600">Marketability</p>
                            </div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.seo.score)}`}>
                                {analysis.seo.score}%
                              </div>
                              <p className="text-sm text-gray-600">SEO</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Completeness Score */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Completeness Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Progress value={analysis.completeness.score} className="flex-1" />
                            <span className={`font-bold text-2xl ${getScoreColor(analysis.completeness.score)}`}>
                              {analysis.completeness.score}%
                            </span>
                          </div>
                          
                          {analysis.completeness.missingElements.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Missing Elements:
                              </h4>
                              <ul className="space-y-1">
                                {analysis.completeness.missingElements.map((element, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-red-700">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {element}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {analysis.completeness.recommendations.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Recommendations:
                              </h4>
                              <ul className="space-y-1">
                                {analysis.completeness.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Quality & Marketability */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-green-600" />
                              Quality Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Progress value={analysis.quality.score} className="flex-1" />
                              <span className={`font-bold text-xl ${getScoreColor(analysis.quality.score)}`}>
                                {analysis.quality.score}%
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              {analysis.quality.strengths.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Strengths:
                                  </h5>
                                  <ul className="text-xs space-y-1 text-green-600">
                                    {analysis.quality.strengths.map((strength, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {analysis.quality.improvements.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                                    <Zap className="h-4 w-4" />
                                    Areas for Improvement:
                                  </h5>
                                  <ul className="text-xs space-y-1 text-orange-600">
                                    {analysis.quality.improvements.map((improvement, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-orange-500 rounded-full" />
                                        {improvement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-purple-600" />
                              Market Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Progress value={analysis.marketability.score} className="flex-1" />
                              <span className={`font-bold text-xl ${getScoreColor(analysis.marketability.score)}`}>
                                {analysis.marketability.score}%
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium mb-1">Competition Level:</h5>
                                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                  {analysis.marketability.competitiveness}
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-2">Target Audience:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {analysis.marketability.targetAudience.map((audience, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      <Users className="h-3 w-3 mr-1" />
                                      {audience}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {analysis.marketability.pricingRecommendation && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <h5 className="text-sm font-medium text-green-800 mb-1">
                                    Recommended Price:
                                  </h5>
                                  <p className="text-2xl font-bold text-green-700 flex items-center gap-1">
                                    <DollarSign className="h-5 w-5" />
                                    {analysis.marketability.pricingRecommendation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* SEO Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-indigo-600" />
                            SEO Optimization
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Progress value={analysis.seo.score} className="flex-1" />
                            <span className={`font-bold text-xl ${getScoreColor(analysis.seo.score)}`}>
                              {analysis.seo.score}%
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Search className="h-4 w-4" />
                                Recommended Keywords:
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {analysis.seo.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                SEO Improvements:
                              </h5>
                              <ul className="text-xs space-y-1">
                                {analysis.seo.optimizations.map((optimization, index) => (
                                  <li key={index} className="flex items-center gap-2 text-gray-600">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                    {optimization}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h4 className="font-medium mb-2">No analysis available</h4>
                    <p className="text-sm mb-4">Get detailed insights about your course quality, completeness, and marketability.</p>
                    <Button 
                      onClick={analyzeCourse} 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={isAnalyzing}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analyze Course
                    </Button>
                  </div>
                )}
                </div>
              </TabsContent>

              <TabsContent value="generate" className="h-full flex flex-col min-h-0">
                <div className="flex items-center gap-2 flex-shrink-0 p-4">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Content Generation</h3>
                </div>
                
                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 space-y-6 min-h-full">
                      {/* Content Generation Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generationRequests.map((request) => {
                          const IconComponent = request.icon;
                          const hasContent = generatedContent[request.type];
                          
                          return (
                            <Card 
                              key={request.type} 
                              className={`cursor-pointer hover:shadow-md transition-all ${
                                hasContent ? 'border-green-200 bg-green-50' : 'hover:border-purple-200'
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  {request.title}
                                  {hasContent && (
                                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Generated
                                    </Badge>
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-gray-600">
                                  {request.description}
                                </p>
                                
                                {hasContent && (
                                  <div className="bg-white border rounded-lg p-3 max-h-32 overflow-y-auto">
                                    <p className="text-xs text-gray-700 whitespace-pre-wrap">
                                      {typeof generatedContent[request.type] === 'string' 
                                        ? generatedContent[request.type].substring(0, 200) + '...'
                                        : JSON.stringify(generatedContent[request.type], null, 2).substring(0, 200) + '...'
                                      }
                                    </p>
                                  </div>
                                )}
                                
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => handleGenerateContent(request.type)}
                                  disabled={request.loading}
                                  variant={hasContent ? "outline" : "default"}
                                >
                                  {request.loading ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : hasContent ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Regenerate
                                    </>
                                  ) : (
                                    <>
                                      <Wand2 className="h-4 w-4 mr-2" />
                                      Generate
                                    </>
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <Separator />

                      {/* Quick Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="justify-start h-auto py-3"
                              onClick={() => handleQuickAction('improve_title')}
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <div className="text-left">
                                  <div className="font-medium">Improve Title</div>
                                  <div className="text-xs text-gray-500">Make it more compelling</div>
                                </div>
                              </div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="justify-start h-auto py-3"
                              onClick={() => handleQuickAction('expand_description')}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <div className="text-left">
                                  <div className="font-medium">Expand Description</div>
                                  <div className="text-xs text-gray-500">Add more details</div>
                                </div>
                              </div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="justify-start h-auto py-3"
                              onClick={() => handleQuickAction('generate_objectives')}
                            >
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-500" />
                                <div className="text-left">
                                  <div className="font-medium">Learning Objectives</div>
                                  <div className="text-xs text-gray-500">Define clear goals</div>
                                </div>
                              </div>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="justify-start h-auto py-3"
                              onClick={() => handleQuickAction('define_audience')}
                            >
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-500" />
                                <div className="text-left">
                                  <div className="font-medium">Target Audience</div>
                                  <div className="text-xs text-gray-500">Identify learners</div>
                                </div>
                              </div>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progress Overview */}
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Generation Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span>Content Generated:</span>
                              <span className="font-medium">
                                {Object.keys(generatedContent).length} / {generationRequests.length}
                              </span>
                            </div>
                            <Progress 
                              value={(Object.keys(generatedContent).length / generationRequests.length) * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-gray-600">
                              Complete all generations to have comprehensive course materials ready.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>AI Assistant Status: Active</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Connected</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Step {currentStep + 1} of 4</span>
              <Badge variant="outline" className="text-xs">
                {data.title ? 'Course: ' + data.title.substring(0, 20) + '...' : 'Untitled Course'}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
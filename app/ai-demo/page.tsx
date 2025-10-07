"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  MessageSquareText,
  Target,
  BarChart3,
  Map,
  HelpCircle,
  Sparkles,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  AIChatModal,
  FloatingChatButton,
  MinimizedChat,
} from "@/components/ai-chat/AIChatModal";
import { useAIChatStore } from "@/stores/aiChat.store";

export default function AIDemoPage() {
  const { openChat } = useAIChatStore();

  const features = [
    {
      icon: MessageSquareText,
      title: "Intelligent Chat",
      description:
        "Get instant answers to your learning questions with our advanced AI assistant.",
      color: "bg-blue-500",
    },
    {
      icon: Target,
      title: "Course Recommendations",
      description:
        "Receive personalized course suggestions based on your interests and skill level.",
      color: "bg-green-500",
    },
    {
      icon: BarChart3,
      title: "Learning Insights",
      description:
        "Analyze your progress and get personalized recommendations for improvement.",
      color: "bg-purple-500",
    },
    {
      icon: Map,
      title: "Learning Paths",
      description:
        "Create customized learning roadmaps to achieve your educational goals.",
      color: "bg-orange-500",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description:
        "Access comprehensive help topics and get instant support when you need it.",
      color: "bg-red-500",
    },
  ];

  const benefits = [
    "Personalized learning recommendations",
    "Real-time progress tracking",
    "Intelligent course matching",
    "24/7 AI-powered support",
    "Adaptive learning paths",
    "Comprehensive analytics",
  ];

  const demoQuestions = [
    "What courses do you recommend for web development?",
    "How can I improve my learning efficiency?",
    "Create a learning path for data science",
    "Show me my learning insights",
    "Help me choose the right course level",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <Badge className="text-sm px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Powered by Gemini 2.5 Pro
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Your AI
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Learning Assistant
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get personalized guidance, course recommendations, and intelligent
              support throughout your learning journey with our advanced AI
              assistant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={openChat}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                <MessageSquareText className="w-5 h-5 mr-2" />
                Try AI Assistant
              </Button>

              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-pulse delay-2000" />
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI assistant provides comprehensive support for all your
              learning needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our AI Assistant?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Experience the future of personalized learning with our
                intelligent AI assistant that adapts to your unique learning
                style and goals.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className="p-6 bg-white shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Try Demo Questions
                  </h3>
                  <p className="text-gray-600">
                    Click any question to see our AI in action
                  </p>
                </div>

                <div className="space-y-3">
                  {demoQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-200"
                      onClick={openChat}
                    >
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, label: "Active Users", value: "10,000+" },
              { icon: BookOpen, label: "Courses Analyzed", value: "5,000+" },
              {
                icon: MessageSquareText,
                label: "AI Conversations",
                value: "100,000+",
              },
              { icon: TrendingUp, label: "Success Rate", value: "95%" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-white"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of learners who are already using our AI assistant
              to accelerate their educational journey.
            </p>

            <Button
              size="lg"
              onClick={openChat}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-lg"
            >
              <Bot className="w-5 h-5 mr-2" />
              Start Learning with AI
            </Button>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Components */}
      <AIChatModal isOpen={false} onClose={() => {}} />
      <FloatingChatButton />
      <MinimizedChat />
    </div>
  );
}

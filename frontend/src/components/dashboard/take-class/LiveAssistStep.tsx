'use client';

import { useState, useRef, useEffect } from 'react';
import { ClassDetail } from '../types';

interface LiveAssistStepProps {
  classData: ClassDetail;
  onPrevious: () => void;
}

interface ChatMessage {
  id: string;
  type: 'teacher' | 'ai';
  content: string;
  timestamp: Date;
  actionType?: 'explain' | 'example' | 'diagram' | 'question';
}

export default function LiveAssistStep({ classData, onPrevious }: LiveAssistStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectedContent, setProjectedContent] = useState('📚 Class Session Started! Ready for AI assistance.');
  const [isClassStarted, setIsClassStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I'm GuruBandhu, your AI teaching assistant. I'm ready to help you with ${classData.subject} for ${classData.name}. You can ask me to explain concepts, provide examples, or generate diagrams. How can I assist you today?`,
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);
  }, [classData]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleQuickAction = (actionType: 'explain' | 'example' | 'diagram' | 'question', prompt: string) => {
    if (!currentQuestion.trim() && !prompt) return;
    
    const questionText = prompt || currentQuestion;
    const teacherMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'teacher',
      content: questionText,
      timestamp: new Date(),
      actionType
    };

    setChatMessages(prev => [...prev, teacherMessage]);
    setCurrentQuestion('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(actionType, questionText);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setProjectedContent(aiResponse.projectedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIResponse = (actionType: string, question: string) => {
    const responses = {
      explain: {
        content: `I'll explain "${question}" in simple terms. Breaking it down into easy-to-understand concepts that your students can grasp. The explanation is now displayed on the main screen.`,
        projectedContent: `📋 Simple Explanation: ${question}\n\n• Key Point 1: Basic concept explanation\n• Key Point 2: Real-world connection\n• Key Point 3: Why it matters\n\n💡 Remember: Use analogies your students can relate to!`
      },
      example: {
        content: `Here's a practical example for "${question}". I've created a step-by-step example that you can work through with your students on the main display.`,
        projectedContent: `🎯 Example: ${question}\n\nStep 1: Start with what students know\nStep 2: Introduce the new concept\nStep 3: Apply it practically\nStep 4: Check understanding\n\n✅ Try this example with your class!`
      },
      diagram: {
        content: `I've generated a visual diagram for "${question}". The diagram is now showing on the main display to help your students visualize the concept better.`,
        projectedContent: `📊 Diagram: ${question}\n\n[Visual Representation]\n\n┌─────────────┐\n│   Concept   │\n│      ↓      │\n│  Application │\n│      ↓      │\n│   Result    │\n└─────────────┘\n\nUse this to guide your explanation!`
      },
      question: {
        content: `Here are some engaging questions about "${question}" that you can ask your students to check their understanding and encourage participation.`,
        projectedContent: `❓ Discussion Questions: ${question}\n\n1. What do you think happens when...?\n2. Can you give me an example of...?\n3. How would you explain this to a friend?\n4. Where might we use this in real life?\n\n🎯 Pick the questions that fit your lesson!`
      }
    };

    return responses[actionType] || {
      content: `I can help you with "${question}". Let me provide some guidance on this topic.`,
      projectedContent: `📚 Topic: ${question}\n\nI'm here to help you teach this effectively. What specific aspect would you like me to focus on?`
    };
  };

  const handleGenerateAI = () => {
    if (!currentQuestion.trim()) return;
    handleQuickAction('question', currentQuestion);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('🎤 Started recording (simulated)');
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setCurrentQuestion(prev => prev + " (Voice input: Can you explain quadratic equations?)");
        setIsRecording(false);
      }, 3000);
    } else {
      console.log('🛑 Stopped recording');
    }
  };

  const handleStartClass = () => {
    setIsClassStarted(true);
    console.log('🚀 Class session started');
  };

  const handleEndClass = () => {
    setIsClassStarted(false);
    console.log('⏹️ Class session ended');
  };

  const quickActions = [
    {
      id: 'explain',
      title: 'Explain Simply',
      icon: '💡',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      action: () => handleQuickAction('explain', currentQuestion || 'the current topic')
    },
    {
      id: 'example',
      title: 'Give Example',
      icon: '🎯',
      color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
      action: () => handleQuickAction('example', currentQuestion || 'the current topic')
    },
    {
      id: 'question',
      title: 'Ask a Question',
      icon: '❓',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      action: () => handleQuickAction('question', currentQuestion || 'the current topic')
    },
    {
      id: 'diagram',
      title: 'Generate Diagram',
      icon: '📊',
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
      action: () => handleQuickAction('diagram', currentQuestion || 'the current topic')
    }
  ];

  // Live Class Interface
  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Live Assist</h2>
            <p className="text-sm text-gray-600">Course: {classData.subject} | Ready for class!</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleStartClass}
            className={`px-3 py-2 ${isClassStarted ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg transition-colors flex items-center space-x-1 text-sm`}
            disabled={isClassStarted}
          >
            <span>▶️</span>
            <span>{isClassStarted ? 'Class Started' : 'Start Class'}</span>
          </button>
          <button 
            onClick={handleEndClass}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
          >
            <span>⏹️</span>
            <span>End Class</span>
          </button>
        </div>
      </div>

      {/* Main Interface - FIXED LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Main Display (Projected) - 2/3 width */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-shrink-0">
              <h3 className="text-md font-semibold text-gray-800">Main Display (Projected)</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="text-center text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                {projectedContent}
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Control Panel - 1/3 width */}
        <div className="flex flex-col space-y-3 min-h-0">
          {/* AI Chat Section - Takes most space */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-shrink-0">
              <h3 className="text-md font-semibold text-gray-800">Ask GuruBandhu</h3>
            </div>
            
            {/* Chat Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'teacher' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-xs ${
                      message.type === 'teacher'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div>{message.content}</div>
                    <div className={`text-xs mt-1 opacity-75 ${
                      message.type === 'teacher' ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                      <span className="text-xs">GuruBandhu is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
              <div className="space-y-2">
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Explain this concept simply..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                  rows={2}
                />
                
                {/* Quick Action Buttons - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`p-1.5 rounded-lg border transition-colors ${action.color} text-xs font-medium flex items-center justify-center space-x-1`}
                    >
                      <span className="text-sm">{action.icon}</span>
                      <span className="truncate">{action.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Voice Input & Generate - Side by side */}
                <div className="flex space-x-1">
                  <button
                    onClick={toggleRecording}
                    className={`flex-1 p-2 rounded-lg border transition-colors flex items-center justify-center space-x-1 text-xs ${
                      isRecording 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{isRecording ? '🔴' : '🎤'}</span>
                    <span className="font-medium">
                      {isRecording ? 'Recording...' : 'Push to Talk'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleGenerateAI}
                    disabled={!currentQuestion.trim() || isGenerating}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 text-xs"
                  >
                    <span>🤖</span>
                    <span className="font-medium">Generate AI Response</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats - Compact */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex-shrink-0">
            <h4 className="text-xs font-semibold text-gray-800 mb-2">Live Stats</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Questions Asked</span>
                <span className="font-medium text-indigo-600">{chatMessages.filter(m => m.type === 'teacher').length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">AI Responses</span>
                <span className="font-medium text-green-600">{chatMessages.filter(m => m.type === 'ai').length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Session Time</span>
                <span className="font-medium text-purple-600">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button - Fixed at bottom */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Quick View</span>
        </button>
      </div>
    </div>
  );
} 
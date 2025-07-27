'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  mediaType?: 'text' | 'image' | 'audio';
  mediaUrl?: string;
}

interface ChatInterfaceProps {
  notebookTitle: string;
  selectedSourcesCount: number;
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({ 
  notebookTitle, 
  selectedSourcesCount, 
  onSendMessage 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Welcome to your ${notebookTitle} knowledge base! I can help you explore and understand your study materials. What would you like to learn about today?`,
      role: 'assistant',
      timestamp: new Date(),
      mediaType: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // API service function to call the backend
  const callLLMAssistAPI = async (question: string) => {
    console.log('🔗 Making API call to backend from ChatInterface:');
    console.log('   - Question:', question);
    console.log('   - Notebook:', notebookTitle);
    console.log('   - Selected Sources:', selectedSourcesCount);
    
    // Match the exact curl command format that works
    const apiUrl = `http://34.170.197.199:8000/llm_assist?text=${encodeURIComponent(question)}`;
    console.log('   - API URL:', apiUrl);
    
    try {
      console.log('📡 Sending POST request (matching exact curl format)...');
      console.log('   - Using fetch API');
      console.log('   - URL:', apiUrl);
      console.log('   - Method: POST');
      
      // Match your exact curl command:
      // curl -X 'POST' 'http://34.170.197.199:8000/llm_assist?text=what%20is%20yur%20name' 
      // -H 'accept: application/json' -H 'Content-Type: multipart/form-data'
      const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        // No body - query params only (matching your curl)
      };
      
      console.log('   - Request Options:', requestOptions);
      console.log('   - Matching curl command exactly: POST with query params, no body');
      
      const response = await fetch(apiUrl, requestOptions);
      
      console.log('📥 Response received:');
      console.log('   - Status:', response.status);
      console.log('   - Status Text:', response.statusText);
      console.log('   - OK:', response.ok);
      console.log('   - Type:', response.type);
      console.log('   - URL:', response.url);
      console.log('   - Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('❌ API Error Response:');
        console.error('   - Status:', response.status);
        console.error('   - Status Text:', response.statusText);
        
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('   - Error Body:', errorText);
        } catch (textError) {
          console.error('   - Could not read error body:', textError);
          errorText = `HTTP ${response.status} - ${response.statusText}`;
        }
        
        throw new Error(`API Error: ${response.status} - ${response.statusText}. Body: ${errorText}`);
      }
      
      let data;
      const contentType = response.headers.get('content-type');
      console.log('📄 Response Content-Type:', contentType);
      
      // Handle different response types from backend
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('✅ JSON Response Data:', data);
        
        return {
          success: true,
          data: data,
          content: data.content || data.text || data.response || JSON.stringify(data),
          mediaType: data.type || 'text',
          mediaUrl: data.url || data.media_url || null
        };
      } else if (contentType && (contentType.includes('image/') || contentType.includes('audio/'))) {
        // Handle file responses (images/audio)
        const blob = await response.blob();
        const mediaUrl = URL.createObjectURL(blob);
        const mediaType = contentType.includes('image/') ? 'image' : 'audio';
        
        console.log(`✅ ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Response:`, mediaUrl);
        
        return {
          success: true,
          data: blob,
          content: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} generated successfully!`,
          mediaType: mediaType,
          mediaUrl: mediaUrl
        };
      } else {
        // Fallback for plain text
        data = await response.text();
        console.log('✅ Text Response Data:', data);
        
        return {
          success: true,
          data: data,
          content: data,
          mediaType: 'text',
          mediaUrl: null
        };
      }
      
    } catch (error: unknown) {
      console.error('💥 API Call Failed:');
      console.error('   - Error:', error);
      console.error('   - Error Message:', error instanceof Error ? error.message : String(error));
      console.error('   - Stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Since curl works, this is likely a browser/fetch specific issue
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚨 Browser fetch issue detected!');
        console.error('💡 Possible solutions:');
        console.error('   1. Browser security restrictions');
        console.error('   2. Mixed content (HTTP vs HTTPS) issue');
        console.error('   3. Network proxy/firewall blocking browser requests');
        console.error('   4. Browser extension interference');
        console.error('📝 Since curl works, the server and endpoint are fine');
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        content: `API Error: ${error instanceof Error ? error.message : String(error)}`,
        mediaType: 'text',
        mediaUrl: null
      };
    }
  };

  // Cleanup blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      messages.forEach(message => {
        if (message.mediaUrl && message.mediaUrl.startsWith('blob:')) {
          URL.revokeObjectURL(message.mediaUrl);
        }
      });
    };
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Based on your ${selectedSourcesCount} selected sources, I can help you with "${inputValue}". Here's what I found in your materials...`,
        role: 'assistant',
        timestamp: new Date(),
        sources: ['Source 1', 'Source 2']
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);

    onSendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      id: 'summarize',
      title: 'Summarize',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      message: "Summarize the key concepts from my selected sources",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: 'explain',
      title: 'Explain',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      message: "Explain complex topics in simple terms for my students",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: 'quiz',
      title: 'Create Quiz',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      message: "Generate practice questions and quiz from these materials",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: 'themes',
      title: 'Find Themes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      message: "What are the main themes across all my materials?",
      color: "bg-orange-50 text-orange-700 border-orange-200"
    }
  ];

  const handleQuickAction = (message: string) => {
    setInputValue(message);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
        {selectedSourcesCount > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Chatting with {selectedSourcesCount} source{selectedSourcesCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.sources && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Sources:</p>
                  <div className="flex gap-1 mt-1">
                    {message.sources.map((source, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - Compact Design */}
      {messages.length === 1 && selectedSourcesCount > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.message)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-all hover:shadow-sm ${action.color}`}
                title={action.message}
              >
                <div className="mb-1">
                  {action.icon}
                </div>
                <span className="text-xs font-medium">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedSourcesCount > 0 ? "Ask anything about your sources..." : "Select sources to start chatting..."}
              disabled={selectedSourcesCount === 0 || isLoading}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
            <div className="absolute right-3 top-3 text-xs text-gray-500">
              {selectedSourcesCount} source{selectedSourcesCount !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || selectedSourcesCount === 0 || isLoading}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 
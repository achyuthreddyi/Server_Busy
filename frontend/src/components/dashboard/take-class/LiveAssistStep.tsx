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
  mediaType?: 'text' | 'image' | 'audio';
  mediaUrl?: string;
}

export default function LiveAssistStep({ classData, onPrevious }: LiveAssistStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectedContent, setProjectedContent] = useState('📚 Class Session Started! Ready for AI assistance.');
  const [projectedMediaType, setProjectedMediaType] = useState<'text' | 'image' | 'audio'>('text');
  const [projectedMediaUrl, setProjectedMediaUrl] = useState<string | null>(null);
  const [isClassStarted, setIsClassStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    console.log('🚀 LiveAssistStep Component Initialized');
    console.log('📚 Class Data:', classData);
    
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I'm GuruBandhu, your AI teaching assistant. I'm ready to help you with ${classData.subject} for ${classData.name}. You can ask me to explain concepts, provide examples, or generate diagrams. How can I assist you today?`,
      timestamp: new Date(),
      mediaType: 'text'
    };
    
    console.log('💬 Welcome message created:', welcomeMessage);
    setChatMessages([welcomeMessage]);
  }, [classData]);

  // Auto scroll chat to bottom
  useEffect(() => {
    console.log('📜 Auto-scrolling chat to bottom, total messages:', chatMessages.length);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Cleanup blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      chatMessages.forEach(message => {
        if (message.mediaUrl && message.mediaUrl.startsWith('blob:')) {
          URL.revokeObjectURL(message.mediaUrl);
        }
      });
      if (projectedMediaUrl && projectedMediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(projectedMediaUrl);
      }
    };
  }, [chatMessages, projectedMediaUrl]);

  const handleQuickAction = async (actionType: 'explain' | 'example' | 'diagram' | 'question', prompt: string) => {
    console.log('🎯 Quick Action Triggered:');
    console.log('   - Action Type:', actionType);
    console.log('   - Prompt:', prompt);
    console.log('   - Current Question:', currentQuestion);
    
    if (!currentQuestion.trim() && !prompt) {
      console.log('❌ No question provided, aborting action');
      return;
    }
    
    const baseText = prompt || currentQuestion;
    // Prepend the action type to the user's input
    const questionText = `${actionType} ${baseText}`;
    console.log('✅ Final question text with action prepended:', questionText);
    
    const teacherMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'teacher',
      content: baseText, // Show original user input in chat
      timestamp: new Date(),
      actionType,
      mediaType: 'text'
    };

    console.log('👨‍🏫 Teacher message created:', teacherMessage);
    setChatMessages(prev => {
      console.log('📝 Adding teacher message to chat history. Previous count:', prev.length);
      return [...prev, teacherMessage];
    });
    
    console.log('🧹 Clearing current question input');
    setCurrentQuestion('');
    
    console.log('⏳ Setting generating state to true');
    setIsGenerating(true);

    // Prepare API call data with action prepended
    const apiPayload = {
      question: questionText, // This now includes the action prefix
      actionType: actionType,
      subject: classData.subject,
      className: classData.name,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔗 API Payload prepared:', apiPayload);
    console.log('📡 About to make API call with action-prefixed text...');

    try {
      console.log('🤖 Calling AI API with prefixed question...');
      const aiResponse = await generateAIResponse(actionType, questionText); // Pass the prefixed text
      console.log('📥 AI Response received:', aiResponse);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        mediaType: aiResponse.mediaType || 'text',
        mediaUrl: aiResponse.mediaUrl
      };

      console.log('🤖 AI message created:', aiMessage);
      setChatMessages(prev => {
        console.log('📝 Adding AI message to chat history. Previous count:', prev.length);
        return [...prev, aiMessage];
      });
      
      console.log('📺 Updating projected content:', aiResponse.projectedContent);
      setProjectedContent(aiResponse.projectedContent);
      setProjectedMediaType(aiResponse.mediaType || 'text');
      setProjectedMediaUrl(aiResponse.mediaUrl || null);
      
    } catch (error: unknown) {
      console.error('💥 Error in handleQuickAction:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `❌ Sorry, there was an error processing your request. Please try again.`,
        timestamp: new Date(),
        mediaType: 'text'
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      console.log('✅ Setting generating state to false');
      setIsGenerating(false);
    }
  };

  // API service function to call the backend
  const callLLMAssistAPI = async (question: string, actionType: string) => {
    console.log('🔗 Making API call to backend:');
    console.log('   - Question:', question);
    console.log('   - Action Type:', actionType);
    
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

  // Add alternative API call method for testing
  const callLLMAssistAPIAlternative = async (question: string, actionType: string) => {
    console.log('🔄 Trying alternative API call methods...');
    
    const baseUrl = 'http://34.170.197.199:8000/llm_assist';
    const encodedQuestion = encodeURIComponent(question);
    
    // Method 1: POST without Content-Type header (let browser set it)
    try {
      console.log('📝 Method 1: POST without explicit Content-Type...');
      const response = await fetch(`${baseUrl}?text=${encodedQuestion}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          // No Content-Type - let browser decide
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 1 SUCCESS:', data);
        return {
          success: true,
          data: data,
          content: typeof data === 'string' ? data : (data.content || data.text || data.response || JSON.stringify(data)),
          mediaType: data.type || 'text',
          mediaUrl: data.url || data.media_url || null
        };
      }
      console.log('❌ Method 1 failed with status:', response.status);
    } catch (error) {
      console.log('❌ Method 1 failed with error:', error);
    }
    
    // Method 2: Try GET request (maybe the API supports both)
    try {
      console.log('📝 Method 2: Using GET request...');
      const response = await fetch(`${baseUrl}?text=${encodedQuestion}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 2 SUCCESS:', data);
        return {
          success: true,
          data: data,
          content: typeof data === 'string' ? data : (data.content || data.text || data.response || JSON.stringify(data)),
          mediaType: data.type || 'text',
          mediaUrl: data.url || data.media_url || null
        };
      }
      console.log('❌ Method 2 failed with status:', response.status);
    } catch (error) {
      console.log('❌ Method 2 failed with error:', error);
    }
    
    // Method 3: POST with simple text/plain
    try {
      console.log('📝 Method 3: POST with text/plain...');
      const response = await fetch(`${baseUrl}?text=${encodedQuestion}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'text/plain',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 3 SUCCESS:', data);
        return {
          success: true,
          data: data,
          content: typeof data === 'string' ? data : (data.content || data.text || data.response || JSON.stringify(data)),
          mediaType: data.type || 'text',
          mediaUrl: data.url || data.media_url || null
        };
      }
      console.log('❌ Method 3 failed with status:', response.status);
    } catch (error) {
      console.log('❌ Method 3 failed with error:', error);
    }
    
    // Method 4: Try with XMLHttpRequest (old school approach)
    try {
      console.log('📝 Method 4: Using XMLHttpRequest...');
      
      const result = await new Promise<{
        success: boolean;
        data?: any;
        content: string;
        mediaType: string;
        mediaUrl: any;
        error?: string;
      }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${baseUrl}?text=${encodedQuestion}`, true);
        xhr.setRequestHeader('accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                console.log('✅ Method 4 SUCCESS:', data);
                resolve({
                  success: true,
                  data: data,
                  content: typeof data === 'string' ? data : (data.content || data.text || data.response || JSON.stringify(data)),
                  mediaType: data.type || 'text',
                  mediaUrl: data.url || data.media_url || null
                });
              } catch (parseError) {
                console.log('✅ Method 4 SUCCESS (text):', xhr.responseText);
                resolve({
                  success: true,
                  data: xhr.responseText,
                  content: xhr.responseText,
                  mediaType: 'text',
                  mediaUrl: null
                });
              }
            } else {
              console.log('❌ Method 4 failed with status:', xhr.status);
              resolve({
                success: false,
                error: `XMLHttpRequest failed: ${xhr.status}`,
                content: 'XMLHttpRequest method failed',
                mediaType: 'text',
                mediaUrl: null
              });
            }
          }
        };
        
        xhr.onerror = function() {
          console.log('❌ Method 4 failed with network error');
          resolve({
            success: false,
            error: 'XMLHttpRequest network error',
            content: 'XMLHttpRequest network error',
            mediaType: 'text',
            mediaUrl: null
          });
        };
        
        xhr.send();
      });
      
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log('❌ Method 4 failed with error:', error);
    }
    
    return {
      success: false,
      error: 'All alternative methods failed',
      content: 'Could not connect to the API using any method',
      mediaType: 'text',
      mediaUrl: null
    };
  };

  const generateAIResponse = async (actionType: 'explain' | 'example' | 'diagram' | 'question', question: string) => {
    console.log('🔄 Generating AI Response via API:');
    console.log('   - Action Type:', actionType);
    console.log('   - Question:', question);
    
    // Try the primary API call method first
    let apiResult = await callLLMAssistAPI(question, actionType);
    
    // If primary method fails, try alternative methods
    if (!apiResult.success) {
      console.log('⚠️ Primary API method failed, trying alternative methods...');
      apiResult = await callLLMAssistAPIAlternative(question, actionType);
    }
    
    if (apiResult.success) {
      console.log('✅ API call successful, processing response...');
      
      const response = {
        content: apiResult.content,
        projectedContent: `📡 Live AI Response: ${question}\n\n${apiResult.content}\n\n🤖 Generated by GuruBandhu AI`,
        mediaType: apiResult.mediaType,
        mediaUrl: apiResult.mediaUrl
      };
      
      console.log('✅ Final response prepared:', response);
      return response;
    } else {
      console.log('❌ All API methods failed, showing error response...');
      
      const errorResponse = {
        content: `❌ Error calling AI backend: ${apiResult.error}\n\nTroubleshooting steps:\n1. Check if server is running at http://34.170.197.199:8000\n2. Verify CORS is enabled on backend\n3. Check browser console for detailed errors\n4. Try accessing the URL directly in browser`,
        projectedContent: `🚨 API Connection Error\n\nCannot connect to AI backend server.\n\nError: ${apiResult.error}\n\nTroubleshooting:\n• Check server status\n• Verify CORS configuration\n• Check network connectivity\n\nPlease contact your system administrator.`,
        mediaType: 'text',
        mediaUrl: null
      };
      
      console.log('📝 Error response prepared:', errorResponse);
      return errorResponse;
    }
  };

  const handleGenerateAI = async () => {
    console.log('🤖 Generate AI button clicked');
    console.log('📝 Current question value:', currentQuestion);
    console.log('🔍 Question length:', currentQuestion.trim().length);
    
    if (!currentQuestion.trim()) {
      console.log('❌ No question provided, aborting AI generation');
      return;
    }
    
    console.log('✅ Proceeding with AI generation');
    await handleQuickAction('question', currentQuestion);
  };

  const toggleRecording = () => {
    console.log('🎤 Recording button clicked');
    console.log('   - Current recording state:', isRecording);
    
    const newRecordingState = !isRecording;
    console.log('   - New recording state will be:', newRecordingState);
    
    setIsRecording(newRecordingState);
    
    if (newRecordingState) {
      console.log('🎤 Started recording (simulated)');
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        const voiceInput = " (Voice input: Can you explain quadratic equations?)";
        console.log('🗣️ Voice input simulation completed:', voiceInput);
        console.log('📝 Previous question:', currentQuestion);
        
        setCurrentQuestion(prev => {
          const newValue = prev + voiceInput;
          console.log('📝 Updated question with voice input:', newValue);
          return newValue;
        });
        
        console.log('🛑 Stopping recording after voice input');
        setIsRecording(false);
      }, 3000);
    } else {
      console.log('🛑 Stopped recording manually');
    }
  };

  const handleStartClass = () => {
    console.log('🚀 Start Class button clicked');
    console.log('   - Previous class state:', isClassStarted);
    
    setIsClassStarted(true);
    console.log('✅ Class session started - state updated to true');
  };

  const handleEndClass = () => {
    console.log('⏹️ End Class button clicked');
    console.log('   - Previous class state:', isClassStarted);
    
    setIsClassStarted(false);
    console.log('✅ Class session ended - state updated to false');
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log('✏️ Question input changed:');
    console.log('   - Previous value:', currentQuestion);
    console.log('   - New value:', newValue);
    console.log('   - Character count:', newValue.length);
    
    setCurrentQuestion(newValue);
  };

  const quickActions = [
    {
      id: 'explain',
      title: 'Explain Simply',
      icon: '💡',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      action: async () => {
        console.log('🔵 Quick Action: Explain Simply clicked');
        await handleQuickAction('explain', currentQuestion || 'the current topic');
      }
    },
    {
      id: 'example',
      title: 'Give Example',
      icon: '🎯',
      color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
      action: async () => {
        console.log('🟢 Quick Action: Give Example clicked');
        await handleQuickAction('example', currentQuestion || 'the current topic');
      }
    },
    {
      id: 'question',
      title: 'Ask a Question',
      icon: '❓',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      action: async () => {
        console.log('🟣 Quick Action: Ask a Question clicked');
        await handleQuickAction('question', currentQuestion || 'the current topic');
      }
    },
    {
      id: 'diagram',
      title: 'Generate Diagram',
      icon: '📊',
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
      action: async () => {
        console.log('🟠 Quick Action: Generate Diagram clicked');
        await handleQuickAction('diagram', currentQuestion || 'the current topic');
      }
    }
  ];

  console.log('🔄 Component render - Current state:');
  console.log('   - Current Question:', currentQuestion);
  console.log('   - Chat Messages Count:', chatMessages.length);
  console.log('   - Is Recording:', isRecording);
  console.log('   - Is Generating:', isGenerating);
  console.log('   - Is Class Started:', isClassStarted);

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
              {projectedMediaType !== 'text' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {projectedMediaType === 'image' ? '🖼️ Image' : '🎵 Audio'} Content
                </span>
              )}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Text Content */}
              <div className="text-center text-gray-600 whitespace-pre-line leading-relaxed text-sm mb-4">
                {projectedContent}
              </div>
              
              {/* Image Display - Larger for projection */}
              {projectedMediaType === 'image' && projectedMediaUrl && (
                <div className="flex justify-center mt-4">
                  <div className="relative">
                    <img 
                      src={projectedMediaUrl} 
                      alt="AI Generated for Projection" 
                      className="rounded-lg shadow-xl object-cover border-2 border-gray-200"
                      style={{ 
                        width: '400px', 
                        height: '400px',
                        maxWidth: '90%'
                      }}
                      onLoad={() => console.log('🖼️ Projected image loaded successfully')}
                      onError={(e) => console.error('❌ Projected image failed to load:', e)}
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      🖼️ AI Generated Visual Aid
                    </div>
                  </div>
                </div>
              )}
              
              {/* Audio Display - Prominent for classroom */}
              {projectedMediaType === 'audio' && projectedMediaUrl && (
                <div className="flex justify-center mt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg w-full max-w-md">
                    <div className="text-center mb-4">
                      <div className="text-2xl mb-2">🎵</div>
                      <h4 className="text-lg font-semibold text-gray-800">AI Generated Audio</h4>
                      <p className="text-sm text-gray-600">Click play to share with your class</p>
                    </div>
                    <audio 
                      controls 
                      className="w-full"
                      style={{ height: '40px' }}
                      onLoadedData={() => console.log('🎵 Projected audio loaded successfully')}
                      onError={(e) => console.error('❌ Projected audio failed to load:', e)}
                    >
                      <source src={projectedMediaUrl} type="audio/wav" />
                      <source src={projectedMediaUrl} type="audio/mpeg" />
                      <source src={projectedMediaUrl} type="audio/mp4" />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                </div>
              )}
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
                    {/* Text Content */}
                    <div className="mb-2">{message.content}</div>
                    
                    {/* Image Display - Fixed size and centered */}
                    {message.mediaType === 'image' && message.mediaUrl && (
                      <div className="mt-2 flex justify-center">
                        <div className="relative">
                          <img 
                            src={message.mediaUrl} 
                            alt="AI Generated" 
                            className="rounded-lg shadow-lg object-cover"
                            style={{ 
                              width: '200px', 
                              height: '200px',
                              maxWidth: '100%'
                            }}
                            onLoad={() => console.log('🖼️ Image loaded successfully')}
                            onError={(e) => console.error('❌ Image failed to load:', e)}
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            🖼️ AI Generated
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Audio Display - Custom styled controls */}
                    {message.mediaType === 'audio' && message.mediaUrl && (
                      <div className="mt-2">
                        <div className="bg-gray-50 rounded-lg p-2 border">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">🎵 AI Generated Audio</span>
                          </div>
                          <audio 
                            controls 
                            className="w-full h-8"
                            style={{ maxWidth: '100%' }}
                            onLoadedData={() => console.log('🎵 Audio loaded successfully')}
                            onError={(e) => console.error('❌ Audio failed to load:', e)}
                          >
                            <source src={message.mediaUrl} type="audio/wav" />
                            <source src={message.mediaUrl} type="audio/mpeg" />
                            <source src={message.mediaUrl} type="audio/mp4" />
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className={`text-xs mt-2 opacity-75 ${
                      message.type === 'teacher' ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.mediaType !== 'text' && (
                        <span className="ml-1">• {message.mediaType}</span>
                      )}
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
                  onChange={handleQuestionChange}
                  placeholder="Try: 'Generate an image of a solar system' or 'Create audio explanation of photosynthesis' or 'Explain quadratic equations simply'"
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
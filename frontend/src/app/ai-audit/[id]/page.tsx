'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface TranscriptSegment {
  timestamp: string;
  speaker: 'teacher' | 'student';
  text: string;
  confidence: number;
  keywords?: string[];
}

interface AIInsight {
  category: 'engagement' | 'delivery' | 'interaction' | 'content' | 'improvement';
  title: string;
  description: string;
  severity: 'positive' | 'neutral' | 'negative';
  score?: number;
}

interface SessionData {
  id: number;
  title: string;
  subject: string;
  className: string;
  date: string;
  duration: string;
  status: 'analyzed' | 'processing' | 'pending';
  engagementScore: number;
  overallRating: number;
  thumbnail: string;
  transcript: TranscriptSegment[];
  aiInsights: AIInsight[];
  metrics: {
    talkTime: number;
    questionCount: number;
    studentParticipation: number;
    conceptClarity: number;
    pacingScore: number;
  };
}

export default function AIAuditDetailPage() {
  const params = useParams();
  const sessionId = parseInt(params?.id as string);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights' | 'metrics'>('transcript');
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock session data
  const sessionData: SessionData = {
    id: sessionId,
    title: "Introduction to Quadratic Equations",
    subject: "Mathematics",
    className: "Grade 7 A",
    date: "2024-01-15",
    duration: "45:32",
    status: "analyzed",
    engagementScore: 87,
    overallRating: 4.2,
    thumbnail: "📊",
    transcript: [
      {
        timestamp: "00:00",
        speaker: "teacher",
        text: "Good morning everyone! Today we're going to explore quadratic equations. Can anyone tell me what makes an equation quadratic?",
        confidence: 0.95,
        keywords: ["quadratic", "equations"]
      },
      {
        timestamp: "00:15",
        speaker: "student",
        text: "Is it when the highest power is 2?",
        confidence: 0.88
      },
      {
        timestamp: "00:20",
        speaker: "teacher",
        text: "Excellent observation, Sarah! Yes, a quadratic equation has a highest degree of 2. Let's write the general form on the board.",
        confidence: 0.96,
        keywords: ["degree", "general form"]
      },
      {
        timestamp: "00:45",
        speaker: "teacher",
        text: "So we have ax² + bx + c = 0, where a cannot be zero. Why do you think a cannot be zero?",
        confidence: 0.94,
        keywords: ["formula", "coefficients"]
      },
      {
        timestamp: "01:02",
        speaker: "student",
        text: "Because then it wouldn't be quadratic anymore?",
        confidence: 0.82
      },
      {
        timestamp: "01:08",
        speaker: "teacher",
        text: "Perfect! If a equals zero, we'd have bx + c = 0, which is linear, not quadratic. Great thinking!",
        confidence: 0.97,
        keywords: ["linear", "thinking"]
      },
      {
        timestamp: "01:30",
        speaker: "teacher",
        text: "Now let's look at some examples. Who can help me solve x² - 5x + 6 = 0?",
        confidence: 0.93,
        keywords: ["examples", "solve"]
      },
      {
        timestamp: "01:45",
        speaker: "student",
        text: "Can we use factoring?",
        confidence: 0.90
      },
      {
        timestamp: "01:50",
        speaker: "teacher",
        text: "Absolutely! Factoring is one method. Let's find two numbers that multiply to 6 and add to -5.",
        confidence: 0.96,
        keywords: ["factoring", "method"]
      }
    ],
    aiInsights: [
      {
        category: 'engagement',
        title: 'High Student Participation',
        description: 'Students actively responded to questions and showed understanding through their answers.',
        severity: 'positive',
        score: 92
      },
      {
        category: 'delivery',
        title: 'Clear Concept Introduction',
        description: 'The quadratic equation concept was introduced clearly with good scaffolding.',
        severity: 'positive',
        score: 88
      },
      {
        category: 'interaction',
        title: 'Effective Questioning Technique',
        description: 'Good use of open-ended questions to check understanding and promote thinking.',
        severity: 'positive',
        score: 85
      },
      {
        category: 'content',
        title: 'Appropriate Pacing',
        description: 'The lesson moved at a good pace, allowing time for student responses.',
        severity: 'positive',
        score: 80
      },
      {
        category: 'improvement',
        title: 'Add Visual Examples',
        description: 'Consider adding more visual representations or real-world applications.',
        severity: 'neutral',
        score: 70
      }
    ],
    metrics: {
      talkTime: 72,
      questionCount: 12,
      studentParticipation: 85,
      conceptClarity: 90,
      pacingScore: 82
    }
  };

  // Convert timestamp to seconds
  const timeToSeconds = (timestamp: string) => {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Convert seconds to timestamp
  const secondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate video playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Update current transcript index based on time
          const transcriptIndex = sessionData.transcript.findIndex(
            (segment, index) => {
              const currentSegmentTime = timeToSeconds(segment.timestamp);
              const nextSegmentTime = index < sessionData.transcript.length - 1 
                ? timeToSeconds(sessionData.transcript[index + 1].timestamp)
                : Infinity;
              return newTime >= currentSegmentTime && newTime < nextSegmentTime;
            }
          );
          if (transcriptIndex !== -1) {
            setCurrentTranscriptIndex(transcriptIndex);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (timestamp: string) => {
    const seconds = timeToSeconds(timestamp);
    setCurrentTime(seconds);
    const transcriptIndex = sessionData.transcript.findIndex(segment => segment.timestamp === timestamp);
    if (transcriptIndex !== -1) {
      setCurrentTranscriptIndex(transcriptIndex);
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'border-green-200 bg-green-50 text-green-800';
      case 'negative': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'engagement': return '👥';
      case 'delivery': return '🎯';
      case 'interaction': return '💬';
      case 'content': return '📚';
      case 'improvement': return '🔧';
      default: return '💡';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            🏠 Home
          </Link>
          <span>›</span>
          <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
            📚 Dashboard
          </Link>
          <span>›</span>
          <Link href="/ai-audit" className="hover:text-gray-700 transition-colors">
            🎥 AI Audit
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{sessionData.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{sessionData.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{sessionData.subject}</span>
                <span>•</span>
                <span>{sessionData.className}</span>
                <span>•</span>
                <span>{new Date(sessionData.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{sessionData.duration}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{sessionData.engagementScore}%</div>
              <div className="text-sm text-gray-600">Engagement Score</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Video Area */}
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-8xl">{sessionData.thumbnail}</div>
                
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <button
                    onClick={handlePlayPause}
                    className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Current Time */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                  {secondsToTime(currentTime)} / {sessionData.duration}
                </div>

                {/* Status */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  {isPlaying ? '🔴 Playing' : '⏸️ Paused'}
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    
                    <div className="text-sm text-gray-600">
                      {isPlaying ? 'Playing live transcript' : 'Click play to see live transcript'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343a9 9 0 000 12.728m2.829-9.9a5 5 0 000 7.072" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'transcript', label: 'Transcript', icon: '📝' },
                    { id: 'insights', label: 'AI Insights', icon: '🤖' },
                    { id: 'metrics', label: 'Metrics', icon: '📊' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {activeTab === 'transcript' && (
                  <div className="space-y-3">
                    {sessionData.transcript.map((segment, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          index === currentTranscriptIndex && isPlaying
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSeek(segment.timestamp)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                              {segment.timestamp}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium mb-1 ${
                              segment.speaker === 'teacher' ? 'text-indigo-600' : 'text-green-600'
                            }`}>
                              {segment.speaker === 'teacher' ? '👨‍🏫 Teacher' : '🙋‍♀️ Student'}
                            </div>
                            <p className="text-sm text-gray-700">{segment.text}</p>
                            {segment.keywords && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {segment.keywords.map((keyword, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-3">
                    {sessionData.aiInsights.map((insight, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.severity)}`}>
                        <div className="flex items-start space-x-3">
                          <div className="text-lg">{getInsightIcon(insight.category)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              {insight.score && (
                                <span className="text-sm font-bold">{insight.score}%</span>
                              )}
                            </div>
                            <p className="text-sm opacity-90">{insight.description}</p>
                            <div className="mt-2">
                              <span className="text-xs uppercase tracking-wide font-medium opacity-75">
                                {insight.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-4">
                    {Object.entries(sessionData.metrics).map(([key, value]) => {
                      const metricLabels = {
                        talkTime: 'Teacher Talk Time',
                        questionCount: 'Questions Asked',
                        studentParticipation: 'Student Participation',
                        conceptClarity: 'Concept Clarity',
                        pacingScore: 'Pacing Score'
                      };
                      
                      const metricIcons = {
                        talkTime: '🗣️',
                        questionCount: '❓',
                        studentParticipation: '🙋‍♀️',
                        conceptClarity: '💡',
                        pacingScore: '⏱️'
                      };

                      return (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span>{metricIcons[key as keyof typeof metricIcons]}</span>
                              <span className="text-sm font-medium text-gray-700">
                                {metricLabels[key as keyof typeof metricLabels]}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-indigo-600">
                              {key === 'questionCount' ? value : `${value}%`}
                            </span>
                          </div>
                          {key !== 'questionCount' && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Target,
  MessageSquare,
  Calendar,
  Settings,
  ArrowRight,
  Play,
  Headphones
} from 'lucide-react';
import ActionBanner from '@/components/ActionBanner';

const Dashboard = () => {
  const { user } = useAuth();

  const recentTranslations = [
    { id: 1, text: "Hello, how are you?", timestamp: "2 hours ago", accuracy: 98 },
    { id: 2, text: "Thank you for your help", timestamp: "5 hours ago", accuracy: 95 },
    { id: 3, text: "Good morning everyone", timestamp: "1 day ago", accuracy: 97 },
  ];

  const learningProgress = [
    { category: "Basic Greetings", progress: 85, total: 20 },
    { category: "Daily Conversations", progress: 60, total: 35 },
    { category: "Emergency Signs", progress: 40, total: 15 },
    { category: "Professional Terms", progress: 25, total: 50 },
  ];

  const communityActivity = [
    { user: "Priya S.", activity: "completed Advanced ISL course", time: "3 hours ago" },
    { user: "Raj K.", activity: "shared a success story", time: "5 hours ago" },
    { user: "Anita M.", activity: "helped answer a question", time: "1 day ago" },
  ];

  const actions = [
    {
      title: "Start Translating",
      description: "Engage in real-time conversations with our advanced ISL translation.",
      buttonText: "Launch Translator",
      linkTo: "/translator",
      Icon: Camera,
      gradient: "bg-ishara-translator-gradient",
    },
    {
      title: "Start Talking",
      description: "Convert your speech into ISL gestures instantly.",
      buttonText: "Open Talk-to-Sign",
      linkTo: "/talk",
      Icon: Headphones,
      gradient: "bg-ishara-talk-gradient",
    },
    {
      title: "Continue Your Learning Journey",
      description: "Master ISL with our interactive lessons and personalized feedback.",
      buttonText: "Start Learning Now",
      linkTo: "/learning",
      Icon: BookOpen,
      gradient: "bg-ishara-gradient",
    },
    {
      title: "Join the Community",
      description: "Connect with fellow learners, share experiences, and grow together.",
      buttonText: "Explore Community",
      linkTo: "/community",
      Icon: Users,
      gradient: "bg-ishara-community-gradient",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your journey towards inclusive communication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {actions.map((action, index) => (
            <ActionBanner
              key={index}
              title={action.title}
              description={action.description}
              buttonText={action.buttonText}
              linkTo={action.linkTo}
              Icon={action.Icon}
              gradient={action.gradient}
              useContainer={false}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Translations */}
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-ishara-blue" />
                  Recent Translations
                </CardTitle>
                <Link to="/translator">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTranslations.map((translation) => (
                    <div key={translation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{translation.text}</p>
                        <p className="text-sm text-gray-500">{translation.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{translation.accuracy}%</div>
                        <div className="text-xs text-gray-500">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Activity */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-ishara-blue" />
                        Community Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {communityActivity.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold">{item.user}</span> {item.activity}
                                    </p>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            {/* Quick Settings */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-ishara-blue" />
                        Quick Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Add settings toggles here */}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

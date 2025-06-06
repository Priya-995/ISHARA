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

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your journey towards inclusive communication
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/translator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-ishara-gradient rounded-lg p-3">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Start Translating</h3>
                    <p className="text-gray-600 text-sm">Real-time ISL translation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talk">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 rounded-lg p-3">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Start Talking</h3>
                    <p className="text-gray-600 text-sm">Convert speech to ISL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/learn">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-ishara-teal rounded-lg p-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Continue Learning</h3>
                    <p className="text-gray-600 text-sm">ISL courses and practice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/community">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-ishara-orange rounded-lg p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Join Community</h3>
                    <p className="text-gray-600 text-sm">Connect with others</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Statistics */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-ishara-blue" />
                  Your Progress This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ishara-blue">127</div>
                    <p className="text-sm text-gray-600">Translations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ishara-teal">45</div>
                    <p className="text-sm text-gray-600">Signs Learned</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ishara-orange">3.2h</div>
                    <p className="text-sm text-gray-600">Study Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">97%</div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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

            {/* Learning Progress */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-ishara-blue" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-gray-500">{Math.round((item.progress / 100) * item.total)}/{item.total}</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                <Link to="/learn" className="block mt-4">
                  <Button className="w-full bg-ishara-gradient hover:opacity-90 text-white">
                    Continue Learning
                    <Play className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Today's Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ishara-blue mb-2">8/10</div>
                  <p className="text-sm text-gray-600 mb-4">New signs to learn</p>
                  <Progress value={80} className="h-3" />
                  <p className="text-xs text-gray-500 mt-2">2 more to reach your daily goal!</p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-ishara-orange" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">First Week Complete!</p>
                      <p className="text-xs text-gray-500">Completed 7 days of learning</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Master</p>
                      <p className="text-xs text-gray-500">95%+ accuracy for 5 translations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Community Helper</p>
                      <p className="text-xs text-gray-500">Helped 3 community members</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Activity */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-ishara-teal" />
                  Community Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityActivity.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-gray-600">{activity.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
                <Link to="/community" className="block mt-4">
                  <Button variant="outline" className="w-full border-ishara-teal text-ishara-teal hover:bg-ishara-teal hover:text-white">
                    Join Discussion
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  Quick Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Calendar className="h-4 w-4 mr-2" />
                    Daily Reminders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Target className="h-4 w-4 mr-2" />
                    Learning Goals
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Settings className="h-4 w-4 mr-2" />
                    Accessibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

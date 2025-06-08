import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, Play } from 'lucide-react';

const imageFiles = [
  'A.jpg', 'B.jpg', 'C.jpg', 'D.jpg', 'E.jpg', 'F.jpg', 'G.jpg', 'H.jpg', 'I.jpg', 'J.jpg', 'K.jpg', 'L.jpg', 'M.jpg', 'N.jpg', 'O.jpg', 'P.jpg', 'Q.jpg', 'R.jpg', 'S.jpg', 'T.jpg', 'U.jpg', 'V.jpg', 'W.jpg', 'X.jpg', 'Y.jpg', 'Z.jpg',
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg'
];

const learningProgressData = [
    { category: "Basic Greetings", progress: 85, total: 20 },
    { category: "Daily Conversations", progress: 60, total: 35 },
    { category: "Emergency Signs", progress: 40, total: 15 },
    { category: "Professional Terms", progress: 25, total: 50 },
];

const ContinueLearning = () => {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-white">
            Your Learning Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            Track your progress, practice signs, and achieve your learning goals.
          </p>
          <Button onClick={() => setShowGallery(!showGallery)} className="mt-6 bg-ishara-blue hover:bg-ishara-blue/90">
            {showGallery ? 'Hide' : 'Show'} Sign Library
          </Button>
        </header>
        
        {showGallery && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-cyan-400 mb-6 text-center">Alphabet & Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {imageFiles.map(file => (
                <div key={file} className="bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src={`/Today/${file}`} alt={`Sign for ${file.split('.')[0]}`} className="w-full h-auto object-cover" />
                  <div className="p-4">
                    <p className="text-center text-xl font-bold text-gray-800 dark:text-white">{file.split('.')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-cyan-400 mb-8 text-center">Your Learning Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Your Progress This Week */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-800 dark:text-cyan-400">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Your Progress This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div><div className="text-2xl font-bold">127</div><p className="text-sm text-gray-600 dark:text-gray-400">Translations</p></div>
                      <div><div className="text-2xl font-bold">45</div><p className="text-sm text-gray-600 dark:text-gray-400">Signs Learned</p></div>
                      <div><div className="text-2xl font-bold">3.2h</div><p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p></div>
                      <div><div className="text-2xl font-bold">97%</div><p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p></div>
                    </div>
                </CardContent>
              </Card>

              {/* Learning Progress */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-800 dark:text-cyan-400">
                      <Target className="h-5 w-5 mr-2" />
                      Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                      {learningProgressData.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1"><span className="font-medium">{item.category}</span><span className="text-gray-600 dark:text-gray-400">{Math.round((item.progress / 100) * item.total)}/{item.total}</span></div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Today's Goal */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <CardHeader><CardTitle className="text-lg text-gray-800 dark:text-cyan-400">Today's Goal</CardTitle></CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold mb-2">8/10</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">New signs to learn</p>
                  <Progress value={80} className="h-3" />
                  <p className="text-xs text-gray-500 mt-2">2 more to reach your daily goal!</p>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <CardHeader><CardTitle className="flex items-center text-gray-800 dark:text-cyan-400"><Award className="h-5 w-5 mr-2" />Recent Achievements</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-yellow-100/20 rounded-full flex items-center justify-center"><Award className="h-4 w-4 text-yellow-400" /></div><p>5-Day Signing Streak</p></div>
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-green-100/20 rounded-full flex items-center justify-center"><Play className="h-4 w-4 text-green-400" /></div><p>First Conversation</p></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContinueLearning; 
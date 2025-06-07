import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RefreshCcw, Info, CheckCircle } from 'lucide-react';
import { useHandTracker } from '../hooks/useHandTracker';

const Translator = () => {
  const {
    videoRef,
    canvasRef,
    rawPrediction,
    confirmedWord,
    currentSpelledWord,
    buildingSentence,
    finalTranslation,
    suggestions,
    detectionStatus,
    handLandmarker,
    startVideo,
    stopVideo,
    resetTranslation,
  } = useHandTracker();

  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleStartCamera = async () => {
    const success = await startVideo();
    if (success) {
      setIsCameraOn(true);
    }
  };

  const handleStopCamera = () => {
    stopVideo();
    setIsCameraOn(false);
  };

  const handleReset = () => {
    resetTranslation();
  };

  const isModelLoading = !handLandmarker;
  const isError = detectionStatus.startsWith('Error');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">
            Sign Language to Text
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Real-time translation of hand gestures into written language.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Camera Feed and Controls */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay playsInline muted />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                {!isCameraOn && (
                  <div className="z-10 text-center">
                    <Camera className="mx-auto h-16 w-16 text-gray-500" />
                    <p className="mt-2 text-gray-400">Camera is off</p>
                  </div>
                )}
                {isError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                        <p className="text-red-400 text-lg">{detectionStatus}</p>
                    </div>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                {isCameraOn ? (
                  <Button onClick={handleStopCamera} variant="destructive" className="flex-1">
                    Stop Camera
                  </Button>
                ) : (
                  <Button onClick={handleStartCamera} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isModelLoading || isError}>
                    <Camera className="mr-2 h-4 w-4" /> {isModelLoading ? 'Initializing Model...' : 'Start Camera'}
                  </Button>
                )}
                <Button onClick={handleReset} variant="outline" className="flex-1 border-gray-600 hover:bg-gray-700">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: Translation Output */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Translation</h2>
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</h3>
                  <p className={`mt-1 text-lg ${isError ? 'text-red-400' : 'text-gray-300'}`}>{detectionStatus}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Predicted Sign</h3>
                  <p className="mt-1 text-2xl font-semibold text-yellow-400">{rawPrediction || '...'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Confirmed Sign</h3>
                  <p className="mt-1 text-2xl font-semibold text-purple-400">{confirmedWord || '...'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Current Spelled Word</h3>
                  <p className="mt-1 text-lg text-gray-300 h-8">{currentSpelledWord}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Current Sentence</h3>
                  <p className="mt-1 text-lg text-gray-300 h-8">{buildingSentence}</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Suggestions</h3>
                    <p className="mt-1 text-lg text-cyan-300 h-8">
                        {suggestions.join(', ')}
                    </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Final Translation</h3>
                  <pre className="mt-1 text-lg text-gray-200 bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap h-24 overflow-y-auto">
                    {finalTranslation || "..."}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Use Section */}
        <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 mx-auto mb-4">
                        <Camera size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">1. Start Camera</h3>
                    <p className="text-gray-400">Click the "Start Camera" button and grant permission. Position both hands clearly in the frame.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto mb-4">
                        <Info size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">2. Make Signs</h3>
                    <p className="text-gray-400">Perform ISL signs. The model requires both hands to be visible for accurate prediction. Hold each sign for a moment.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 text-green-400 mx-auto mb-4">
                        <CheckCircle size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3. See Translation</h3>
                    <p className="text-gray-400">Watch as signs are translated into words and sentences in real-time. Use "Reset" to clear the translation.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Translator; 
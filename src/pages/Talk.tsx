import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff,
  RefreshCcw,
  Hand,
  Languages
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Talk = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [displayedWords, setDisplayedWords] = useState<string[][]>([]);
  const [spokenLanguage, setSpokenLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') alert(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join(' ');

      if (transcript.trim() === '' || transcript === lastTranscriptRef.current) {
        return;
      }
      lastTranscriptRef.current = transcript;
      setRecognizedSpeech(transcript);
      setTranslatedText(''); 
      
      let textToProcess = transcript;
      if (spokenLanguage === 'hi-IN' && transcript) {
        try {
          const res = await axios.post('http://localhost:8000/translate', { text: transcript, src_lang: 'hi', dest_lang: 'en' });
          
          if (res.data && res.data.translated_text) {
            console.log("Translation successful:", res.data.translated_text);
            textToProcess = res.data.translated_text;
            setTranslatedText(textToProcess);
          } else {
            // Handle cases where translation returns an error in the response body
            throw new Error(res.data.error || 'Unknown translation error');
          }
        } catch (error: any) {
          console.error("Translation error:", error);
          const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
          alert(`Translation failed: ${errorMessage}`);
          // Don't process signs if translation fails
          setDisplayedWords([]);
          return; 
        }
      }

      const words = textToProcess.toUpperCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').filter(Boolean);
      const newDisplayedWords = words.map(word => word.split(''));
      setDisplayedWords(newDisplayedWords);
    };
  }, [spokenLanguage]);


  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported.");
      return;
    }
    
    recognition.lang = spokenLanguage;

    if (isListening) {
      recognition.stop();
    } else {
      lastTranscriptRef.current = '';
      setRecognizedSpeech('');
      setTranslatedText('');
      setDisplayedWords([]);
      recognition.start();
    }
  };


  const handleReset = () => {
    if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
    }
    lastTranscriptRef.current = '';
    setRecognizedSpeech('');
    setTranslatedText('');
    setDisplayedWords([]);
  };

  const getDisplayText = () => {
    if (spokenLanguage === 'hi-IN') {
        if (recognizedSpeech && translatedText) {
            return `${recognizedSpeech}\n(Translated: ${translatedText})`;
        }
        return recognizedSpeech;
    }
    return recognizedSpeech;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
       <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-ishara-blue">Talk with Deaf</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Speak naturally and see your words converted into ISL signs. Perfect for communicating with deaf friends and family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Speech Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Mic className="mr-2"/> Speech Input</CardTitle>
                <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5 text-gray-500"/>
                    <Select defaultValue={spokenLanguage} onValueChange={setSpokenLanguage}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Language"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-US">English</SelectItem>
                            <SelectItem value="hi-IN">Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-4rem)]">
                <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Mic className={`h-16 w-16 mb-4 ${isListening ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}/>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Click to start speaking</p>
                  <Button onClick={handleToggleListening} className="bg-ishara-blue hover:bg-ishara-blue/90 text-white">
                    {isListening ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>}
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                  </Button>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Recognized Speech</label>
                  <Textarea 
                    readOnly 
                    value={getDisplayText()}
                    placeholder="Your speech will appear here..."
                    className="mt-1 bg-gray-100 dark:bg-gray-700"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: ISL Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">ISL Sign Display</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleReset}><RefreshCcw className="h-5 w-5"/></Button>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
                <div className="w-full h-full flex flex-nowrap items-center justify-start gap-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg overflow-x-auto overflow-y-hidden">
                  {displayedWords.length > 0 ? (
                    displayedWords.map((word, wordIndex) => (
                      <div key={wordIndex} className="flex-shrink-0 flex items-center justify-center p-2 m-2 border-2 border-green-400 rounded-lg bg-gray-200 dark:bg-gray-900">
                        {word.map((letter, letterIndex) => (
                          <img
                            key={letterIndex}
                            src={`/Today/${letter}.jpg`}
                            alt={letter}
                            className="w-20 h-20 object-contain mx-1 rounded-md"
                          />
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center h-full">
                      <Hand className="h-20 w-20 text-yellow-500 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">ISL signs will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Talk; 
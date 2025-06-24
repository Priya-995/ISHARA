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

const supportedLanguages = [
  { value: 'en-US', label: 'English', translateCode: 'en' },
  { value: 'hi-IN', label: 'Hindi', translateCode: 'hi' },
  { value: 'as-IN', label: 'Assamese', translateCode: 'as' },
  { value: 'bn-IN', label: 'Bengali', translateCode: 'bn' },
  { value: 'mr-IN', label: 'Marathi', translateCode: 'mr' },
  { value: 'bho-IN', label: 'Bhojpuri', translateCode: 'bho' },
  { value: 'pa-IN', label: 'Punjabi', translateCode: 'pa' },
];

const Talk = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [displayedWords, setDisplayedWords] = useState<string[][]>([]);
  const [spokenLanguage, setSpokenLanguage] = useState('en-US');

  const recognitionRef = useRef<any>(null);
  const shouldBeListeningRef = useRef(false);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported by your browser. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // More robust
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      if (shouldBeListeningRef.current) {
        // If it stopped but we still want to listen (i.e., not a manual stop), restart it.
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error(`Speech recognition error: ${event.error}`);
      // On a 'no-speech' error, the onend event will handle restarting.
      // We only need to manually stop listening for more critical errors.
      if (event.error !== 'no-speech') {
        shouldBeListeningRef.current = false;
        setIsListening(false);
        alert(`An error occurred: ${event.error}`);
      }
    };

    recognition.onresult = async (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join(' ');

        if (transcript.trim() === '' || transcript.trim() === lastTranscriptRef.current.trim()) {
            return;
        }
        
        console.log(`Recognized: "${transcript}"`);
        lastTranscriptRef.current = transcript;
        setRecognizedSpeech(transcript);
        setTranslatedText('');
        
        let textToProcess = transcript;
        const currentLanguage = supportedLanguages.find(lang => lang.value === spokenLanguage);

        if (currentLanguage && currentLanguage.translateCode !== 'en' && transcript) {
            try {
              const res = await axios.post('http://localhost:8000/translate', { 
                text: transcript, 
                src_lang: currentLanguage.translateCode, 
                dest_lang: 'en' 
              });
              
              if (res.data && res.data.translated_text) {
                textToProcess = res.data.translated_text;
                setTranslatedText(textToProcess);
              } else {
                throw new Error(res.data.error || 'Unknown translation error');
              }
            } catch (error: any) {
              console.error("Translation error:", error);
              const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
              alert(`Translation failed: ${errorMessage}`);
              setDisplayedWords([]);
              return; 
            }
        }

        const words = textToProcess.toUpperCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').filter(Boolean);
        const newDisplayedWords = words.map(word => word.split(''));
        setDisplayedWords(newDisplayedWords);
    };
  }, []); // Run only once on mount

  // Effect to update language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = spokenLanguage;
    }
  }, [spokenLanguage]);


  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      shouldBeListeningRef.current = false;
      recognitionRef.current.stop();
    } else {
      // Clear previous state before starting
      lastTranscriptRef.current = '';
      setRecognizedSpeech('');
      setTranslatedText('');
      setDisplayedWords([]);
      shouldBeListeningRef.current = true;
      recognitionRef.current.start();
    }
  };


  const handleReset = () => {
    lastTranscriptRef.current = '';
    setRecognizedSpeech('');
    setTranslatedText('');
    setDisplayedWords([]);
    if (isListening) {
        shouldBeListeningRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  };

  const getDisplayText = () => {
    const currentLanguage = supportedLanguages.find(lang => lang.value === spokenLanguage);
    if (currentLanguage && currentLanguage.translateCode !== 'en') {
        if (recognizedSpeech && translatedText) {
            return `${recognizedSpeech}\n(Translated: ${translatedText})`;
        }
    }
    return recognizedSpeech;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Panel: Speech Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="flex items-center"><Mic className="mr-2"/> Speech Input</CardTitle>
                <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5 text-gray-500"/>
                    <Select defaultValue={spokenLanguage} onValueChange={setSpokenLanguage}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Language"/>
                        </SelectTrigger>
                        <SelectContent>
                          {supportedLanguages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Mic className={`h-16 w-16 mb-4 ${isListening ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}/>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Click to start speaking</p>
                  <Button onClick={handleToggleListening} className="bg-ishara-blue hover:bg-ishara-blue/90 text-white">
                    {isListening ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>}
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                  </Button>
                </div>
                <div className="mt-4 flex-shrink-0">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Recognized Speech</label>
                  <Textarea 
                    readOnly 
                    value={getDisplayText()}
                    placeholder="Your speech will appear here..."
                    className="mt-1 bg-gray-100 dark:bg-gray-700 w-full resize-none"
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
            <Card className="shadow-lg h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="flex items-center">ISL Sign Display</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleReset}><RefreshCcw className="h-5 w-5"/></Button>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-4">
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
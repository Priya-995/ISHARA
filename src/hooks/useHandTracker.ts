import { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

type LandmarkConnectionArray = [number, number][];

// A dictionary of common words for auto-correction and suggestions.
const DICTIONARY = ["HELLO", "GOOD", "MAY", "MORNING", "AFTERNOON", "EVENING", "NIGHT", "HOW", "ARE", "YOU", "I", "AM", "FINE", "THANK", "THANKS", "HELP", "YES", "NO", "PLEASE", "MY", "NAME", "IS", "WHAT", "WHERE", "WHEN", "WHY", "BYE", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "RAHUL", "BABY", "HI", "SORRY", "LOVE", "BAT", "CAT", "DOG", "EAT", "RUN", "SEE"];
const DICTIONARY_SET = new Set(DICTIONARY);

export const primeSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) return;
    // Get voices upfront & on user interaction to unlock speech.
    window.speechSynthesis.getVoices();
};

export const speak = (text: string) => {
  if ('speechSynthesis' in window && text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
    };

    // Cancel anything currently speaking to avoid a queue.
    window.speechSynthesis.cancel();
    // A small delay can sometimes help, especially after a cancel().
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);

  } else {
      if (!text) console.log("Speak function called with no text.");
      else console.warn("Speech synthesis not supported.");
  }
};

// This powerful function takes a string of letters (e.g., "HELLOGOOD") and
// breaks it into the longest possible sequence of known words.
const segmentSentence = (str: string, dictionary: Set<string>): { sentence: string, remainder: string } => {
    const n = str.length;
    if (n === 0) return { sentence: '', remainder: '' };

    // dp[i] stores the last break point for the prefix of length i
    const dp = new Array(n + 1).fill(-1);
    dp[0] = 0; // Base case

    for (let i = 1; i <= n; i++) {
        // Iterate backwards to find the longest possible word ending at position i.
        for (let j = i - 1; j >= 0; j--) {
            const word = str.substring(j, i);
            if (dp[j] !== -1 && dictionary.has(word)) {
                dp[i] = j; // Mark that we can form a sentence of length i by breaking at j
            }
        }
    }

    // Find the longest prefix of the string that can be successfully segmented.
    let longestValidEnd = 0;
    for (let i = 1; i <= n; i++) {
        if (dp[i] !== -1) {
            longestValidEnd = i;
        }
    }

    if (longestValidEnd === 0) {
        // No full words could be formed from the prefix of the string.
        return { sentence: '', remainder: str };
    }

    // Reconstruct the sentence from the dynamic programming table.
    const words: string[] = [];
    let current = longestValidEnd;
    while (current > 0) {
        const prev = dp[current];
        words.unshift(str.substring(prev, current));
        current = prev;
    }

    return {
        sentence: words.join(' '),
        remainder: str.substring(longestValidEnd)
    };
};

export const useHandTracker = () => {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [rawPrediction, setRawPrediction] = useState('...');
  const [currentSpelledWord, setCurrentSpelledWord] = useState('');
  const [buildingSentence, setBuildingSentence] = useState('');
  const [finalTranslation, setFinalTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [detectionStatus, setDetectionStatus] = useState('Initializing...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const letterSequenceRef = useRef(''); // Stores the continuous stream of signed letters
  const lastPredictionSent = useRef(0);
  const predictionStabilityRef = useRef<string[]>([]);
  const lastConfirmedSign = useRef<string | null>(null);
  const wordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectionTimeRef = useRef(0);

  useEffect(() => {
    const createHandLandmarker = async () => {
      try {
        setDetectionStatus('Loading Model...');
        const vision = await FilesetResolver.forVisionTasks("/wasm");
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setHandLandmarker(landmarker);
        setDetectionStatus('Ready for camera.');
      } catch (e) {
        console.error("Failed to initialize hand landmarker:", e);
        setDetectionStatus('Error: Model failed to load.');
      }
    };
    createHandLandmarker();
  }, []);

  const processSequence = () => {
    if (!letterSequenceRef.current) return;

    const { sentence, remainder } = segmentSentence(letterSequenceRef.current, DICTIONARY_SET);

    if (sentence) {
        speak(sentence);
        setBuildingSentence(prev => (prev ? prev + ' ' + sentence : sentence).trim());
        letterSequenceRef.current = remainder;
    }
    
    setCurrentSpelledWord(letterSequenceRef.current);

    if (letterSequenceRef.current) {
        const matches = stringSimilarity.findBestMatch(letterSequenceRef.current, DICTIONARY);
        const topSuggestions = matches.ratings
          .filter(match => match.rating > 0.1)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(match => match.target);
        setSuggestions(topSuggestions);
    } else {
        setSuggestions([]);
    }
  };

  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarker) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const now = Date.now();
    const elapsed = now - lastDetectionTimeRef.current;

    // Throttle the hand detection to run at most ~15 frames per second.
    if (elapsed > 66) {
        lastDetectionTimeRef.current = now;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d')!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const results = handLandmarker.detectForVideo(video, now);
        
        const HAND_DETECTION_CONFIDENCE = 0.6;
        const placeholderHand = Array(21).fill({ x: 0, y: 0, z: 0 });
        let leftHandLandmarks = null;
        let rightHandLandmarks = null;
        let handsFound = 0;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.handedness && results.handedness.length > 0) {
          for (let i = 0; i < results.handedness.length; i++) {
            const hand = results.handedness[i][0];
            if (hand && hand.score > HAND_DETECTION_CONFIDENCE) {
              handsFound++;
              const landmarks = results.landmarks[i];
              drawConnectors(canvasCtx, landmarks, HandLandmarker.HAND_CONNECTIONS as unknown as LandmarkConnectionArray, { color: '#00FF00', lineWidth: 5 });
              drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
              
              if (hand.categoryName === 'Left') {
                rightHandLandmarks = landmarks;
              } else if (hand.categoryName === 'Right') {
                leftHandLandmarks = landmarks;
              }
            }
          }
        }
        
        canvasCtx.restore();

        if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);

        if (handsFound > 0) {
          setDetectionStatus('Detecting...');
          const keypoints = [...(leftHandLandmarks || placeholderHand), ...(rightHandLandmarks || placeholderHand)];
          if (now - lastPredictionSent.current > 300) { 
              sendLandmarksToBackend(keypoints.map(lm => [lm.x, lm.y]));
              lastPredictionSent.current = now;
          }
        } else {
          setDetectionStatus('No hands detected...');
          if (letterSequenceRef.current) {
            wordTimeoutRef.current = setTimeout(processSequence, 1500);
          }
        }
    }
    
    requestRef.current = requestAnimationFrame(predictWebcam);
  };
  
  const startVideo = async () => {
    if (!handLandmarker) {
      alert("The hand tracking model is still loading. Please wait a moment.");
      return false;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        setDetectionStatus('Starting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', () => {
            requestRef.current = requestAnimationFrame(predictWebcam);
          });
        }
        setDetectionStatus('Detecting...');
        return true;
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setDetectionStatus('Camera access denied.');
        alert("Could not access the camera. Please grant permission.");
        return false;
      }
    }
    return false;
  };

  const stopVideo = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Use a callback to get the most up-to-date state for the final sentence.
    setBuildingSentence(currentBuildingSentence => {
        const { sentence: lastWord, remainder } = segmentSentence(letterSequenceRef.current, DICTIONARY_SET);
        const finalSentence = [currentBuildingSentence, lastWord, remainder].filter(Boolean).join(' ');
        
        if (finalSentence) {
            setFinalTranslation(finalSentence);
            speak(finalSentence);
        }

        // Reset for the next use.
        letterSequenceRef.current = '';
        setCurrentSpelledWord('');
        return ''; // Clear the building sentence state.
    });

    setDetectionStatus('Camera is off.');
  };
  
  const resetTranslation = () => {
    setRawPrediction('...');
    setCurrentSpelledWord('');
    setBuildingSentence('');
    setFinalTranslation('');
    setSuggestions([]);
    lastConfirmedSign.current = null;
    letterSequenceRef.current = '';
    if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
    predictionStabilityRef.current = [];
    window.speechSynthesis.cancel();
  };
  
  useEffect(() => {
    return () => {
      stopVideo();
      if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
    };
  }, []);

  const sendLandmarksToBackend = async (landmarks: number[][]) => {
    try {
        const response = await axios.post('http://localhost:8000/predict', { landmarks: [landmarks] });
        const newPrediction = response.data.prediction || "";
        
        setRawPrediction(newPrediction || '...');

        if (newPrediction) {
          predictionStabilityRef.current.push(newPrediction);

          if (predictionStabilityRef.current.length > 4) { 
            const lastItems = predictionStabilityRef.current.slice(-4);
            const counts = lastItems.reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {} as Record<string, number>);
            const stablePrediction = Object.keys(counts).find(key => counts[key] >= 3);

            if (stablePrediction && stablePrediction !== lastConfirmedSign.current) {
                lastConfirmedSign.current = stablePrediction;
                letterSequenceRef.current += stablePrediction;
                predictionStabilityRef.current = [];
                
                // Update the UI to show the user what they are currently spelling.
                setCurrentSpelledWord(letterSequenceRef.current);
                
            } else if (predictionStabilityRef.current.length > 10) {
                predictionStabilityRef.current = [];
            }
          }
        }
    } catch (error) {
        console.error("Error sending landmarks to backend:", error);
        setDetectionStatus('Backend connection error.');
    }
  };

  return {
    videoRef,
    canvasRef,
    rawPrediction,
    currentSpelledWord,
    buildingSentence,
    finalTranslation,
    suggestions,
    detectionStatus,
    handLandmarker,
    startVideo,
    stopVideo,
    resetTranslation,
  };
}; 
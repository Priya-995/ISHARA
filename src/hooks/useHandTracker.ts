import { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

type LandmarkConnectionArray = [number, number][];

// A dictionary of common words for auto-correction and suggestions.
const DICTIONARY = ["HELLO", "GOOD", "MORNING", "AFTERNOON", "EVENING", "NIGHT", "HOW", "ARE", "YOU", "I", "AM", "FINE", "THANK", "THANKS", "HELP", "YES", "NO", "PLEASE", "MY", "NAME", "IS", "WHAT", "WHERE", "WHEN", "WHY", "BYE", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const DICTIONARY_SET = new Set(DICTIONARY);

export const speak = (text: string) => {
  if ('speechSynthesis' in window && text) {
    window.speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
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
        for (let j = 0; j < i; j++) {
            // Check if the substring from j to i is a word
            const word = str.substring(j, i);
            if (dp[j] !== -1 && dictionary.has(word)) {
                dp[i] = j; // Mark that we can form a sentence of length i
            }
        }
    }

    // Find the longest prefix of the string that can be segmented
    let longestValidEnd = 0;
    for (let i = 1; i <= n; i++) {
        if (dp[i] !== -1) {
            longestValidEnd = i;
        }
    }

    if (longestValidEnd === 0) {
        // No full words could be formed
        return { sentence: '', remainder: str };
    }

    // Reconstruct the sentence from the dynamic programming table
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
  const sentenceFinalizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const finalizeSentence = () => {
    // Directly use the ref, which is always up-to-date and not subject to stale closures.
    const finalLetters = letterSequenceRef.current;
    if (!finalLetters) return;

    // Perform a final segmentation to form the complete sentence.
    const { sentence, remainder } = segmentSentence(finalLetters, DICTIONARY_SET);
    const finalSentence = (sentence + ' ' + remainder).trim();

    if (finalSentence) {
        setFinalTranslation(prevFinal => {
            const newFinal = prevFinal ? `${prevFinal}. ${finalSentence}` : finalSentence;
            speak(finalSentence); // Speak the complete, correct sentence.
            return newFinal;
        });
    }
    // Reset everything for the next sentence.
    letterSequenceRef.current = '';
    setBuildingSentence('');
    setCurrentSpelledWord('');
    setSuggestions([]);
  };

  useEffect(() => {
    // This effect runs whenever the letter sequence changes,
    // and intelligently segments it into words.
    const { sentence, remainder } = segmentSentence(letterSequenceRef.current, DICTIONARY_SET);
    setBuildingSentence(sentence);
    setCurrentSpelledWord(remainder);

    // Update suggestions based on the remainder
    if (remainder.length > 0) {
        const matches = stringSimilarity.findBestMatch(remainder, DICTIONARY);
        const topSuggestions = matches.ratings
          .filter(match => match.rating > 0.1 && !DICTIONARY_SET.has(remainder))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(match => match.target);
        setSuggestions(topSuggestions);
    } else {
        setSuggestions([]);
    }
  }, [letterSequenceRef.current]);

  useEffect(() => {
    const createHandLandmarker = async () => {
      try {
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
        setDetectionStatus('Ready. Start Camera.');
      } catch (e) {
        console.error("Failed to initialize hand landmarker:", e);
        setDetectionStatus('Error initializing model. Please refresh.');
      }
    };
    createHandLandmarker();
  }, []);

  const sendLandmarksToBackend = async (landmarks: number[][]) => {
    try {
        const response = await axios.post('http://localhost:8000/predict', { landmarks: [landmarks] });
        const newPrediction = response.data.prediction || "";
        
        setRawPrediction(newPrediction || '...');

        if (newPrediction) {
          predictionStabilityRef.current.push(newPrediction);

          if (predictionStabilityRef.current.length > 3) {
            const lastItems = predictionStabilityRef.current.slice(-3);
            const counts = lastItems.reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {} as Record<string, number>);
            const stablePrediction = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            if (counts[stablePrediction] > 2) {
              // A stable sign is detected. Clear the finalization timer.
              if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);

              if (stablePrediction !== lastConfirmedSign.current) {
                lastConfirmedSign.current = stablePrediction;
                // Append the new letter to our sequence. The useEffect will handle the rest.
                letterSequenceRef.current += stablePrediction;
              }
              
              predictionStabilityRef.current = [];
              // If the user stops signing, finalize the sentence.
              sentenceFinalizeTimeoutRef.current = setTimeout(finalizeSentence, 3000);
            }
          }
        }
    } catch (error) {
        console.error("Error sending landmarks to backend:", error);
        setDetectionStatus('Backend connection error.');
    }
  };

  const predictWebcam = () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarker) return;
    const video = videoRef.current;
    if (video.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const results = handLandmarker.detectForVideo(video, Date.now());
    
    const HAND_DETECTION_CONFIDENCE = 0.6; // Confidence threshold
    const placeholderHand = Array(21).fill({ x: 0, y: 0, z: 0 });
    let leftHandLandmarks = null;
    let rightHandLandmarks = null;
    let handsFound = 0;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.handedness && results.handedness.length > 0) {
      for (let i = 0; i < results.handedness.length; i++) {
        const hand = results.handedness[i][0];
        // Filter out low-confidence detections to prevent "ghost hand" predictions
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

    if (handsFound > 0) {
      setDetectionStatus('Detecting...');
      const keypoints = [...(leftHandLandmarks || placeholderHand), ...(rightHandLandmarks || placeholderHand)];
      const now = Date.now();
      if (now - lastPredictionSent.current > 200) { // Slightly increased delay
          sendLandmarksToBackend(keypoints.map(lm => [lm.x, lm.y]));
          lastPredictionSent.current = now;
      }
    } else {
      setDetectionStatus('No hands detected. Finalizing...');
      if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
      sentenceFinalizeTimeoutRef.current = setTimeout(finalizeSentence, 1000); // Shorter finalize time
    }
    
    requestRef.current = requestAnimationFrame(predictWebcam);
  };
  
  const startVideo = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
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
        alert("Could not access the camera.");
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
    if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
    predictionStabilityRef.current = [];
    window.speechSynthesis.cancel();
  };
  
  useEffect(() => {
    return () => {
      stopVideo();
      if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
    };
  }, []);

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
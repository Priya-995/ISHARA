import { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

type LandmarkConnectionArray = [number, number][];

const WORDS = ["hello", "help", "hi", "how", "are", "you", "my", "name", "is", "thanks", "thank", "bye", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const speak = (text: string) => {
  if ('speechSynthesis' in window && text) {
    window.speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export const useHandTracker = () => {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [rawPrediction, setRawPrediction] = useState('...');
  const [confirmedWord, setConfirmedWord] = useState('...');
  const [currentSpelledWord, setCurrentSpelledWord] = useState('');
  const [buildingSentence, setBuildingSentence] = useState('');
  const [finalTranslation, setFinalTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [detectionStatus, setDetectionStatus] = useState('Initializing...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const lastPredictionSent = useRef(0);
  const predictionStabilityRef = useRef<string[]>([]);
  const wordCommitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sentenceFinalizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commitCurrentSpelledWord = () => {
    setCurrentSpelledWord(word => {
      if (word) {
        setBuildingSentence(sentence => (sentence ? `${sentence} ${word}` : word));
      }
      return ''; // Reset the spelled word
    });
  };

  const finalizeSentence = () => {
    // Use setState callbacks to ensure we have the latest values before finalizing
    setCurrentSpelledWord(word => {
      setBuildingSentence(sentence => {
        const finalSentence = (sentence + (word ? ` ${word}` : '')).trim();
        if (finalSentence) {
          setFinalTranslation(prevFinal => {
            const newFinal = prevFinal ? `${prevFinal}. ${finalSentence}` : finalSentence;
            speak(finalSentence);
            return newFinal;
          });
        }
        return ''; // Reset sentence
      });
      return ''; // Reset word
    });
  };

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

          if (predictionStabilityRef.current.length > 15) {
            const last15 = predictionStabilityRef.current.slice(-15);
            const counts = last15.reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {} as Record<string, number>);
            const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            if (counts[mostCommon] > 10) {
              const newConfirmedWord = mostCommon;
              setConfirmedWord(newConfirmedWord);
              
              if (wordCommitTimeoutRef.current) clearTimeout(wordCommitTimeoutRef.current);
              if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);

              if (newConfirmedWord.length === 1) {
                setCurrentSpelledWord(prev => prev + newConfirmedWord);
              } else {
                commitCurrentSpelledWord();
                setBuildingSentence(prev => prev ? `${prev} ${newConfirmedWord}` : newConfirmedWord);
              }
              
              predictionStabilityRef.current = [];

              wordCommitTimeoutRef.current = setTimeout(commitCurrentSpelledWord, 2000);
              sentenceFinalizeTimeoutRef.current = setTimeout(finalizeSentence, 4000);
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

    if (results.landmarks && results.landmarks.length > 0 && results.handedness && results.handedness.length > 0) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HandLandmarker.HAND_CONNECTIONS as unknown as LandmarkConnectionArray, { color: '#00FF00', lineWidth: 5 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }
      
      const placeholderHand = Array(21).fill({ x: 0, y: 0, z: 0 });
      let leftHandLandmarks = null, rightHandLandmarks = null;
      for (let i = 0; i < results.handedness.length; i++) {
        if (results.handedness[i][0].categoryName === 'Left') leftHandLandmarks = results.landmarks[i];
        else if (results.handedness[i][0].categoryName === 'Right') rightHandLandmarks = results.landmarks[i];
      }
      const keypoints = [...(leftHandLandmarks || placeholderHand), ...(rightHandLandmarks || placeholderHand)];
      const now = Date.now();
      if (now - lastPredictionSent.current > 500) {
          sendLandmarksToBackend(keypoints.map(lm => [lm.x, lm.y]));
          lastPredictionSent.current = now;
      }
      canvasCtx.restore();
    } else {
      setDetectionStatus('No hands detected. Finalizing...');
      if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
      sentenceFinalizeTimeoutRef.current = setTimeout(finalizeSentence, 500);
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
    setConfirmedWord('...');
    setCurrentSpelledWord('');
    setBuildingSentence('');
    setFinalTranslation('');
    setSuggestions([]);
    if (wordCommitTimeoutRef.current) clearTimeout(wordCommitTimeoutRef.current);
    if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
    predictionStabilityRef.current = [];
    window.speechSynthesis.cancel();
  };
  
  useEffect(() => {
    return () => {
      stopVideo();
      if (wordCommitTimeoutRef.current) clearTimeout(wordCommitTimeoutRef.current);
      if (sentenceFinalizeTimeoutRef.current) clearTimeout(sentenceFinalizeTimeoutRef.current);
    };
  }, []);

  return {
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
  };
}; 
import { useState, useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

type LandmarkConnectionArray = [number, number][];

const WORDS = ["hello", "help", "hi", "how", "are", "you", "my", "name", "is", "thanks", "thank", "bye", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export const useHandTracker = () => {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [detectedWord, setDetectedWord] = useState('No sign detected');
  const [buildingSentence, setBuildingSentence] = useState('');
  const [finalTranslation, setFinalTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [detectionStatus, setDetectionStatus] = useState('Initializing...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPredictionSent = useRef(0);
  const predictionStabilityRef = useRef<string[]>([]);

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
        console.log("Response from backend:", response.data);
        const newPrediction = response.data.prediction;
        
        // Always update the display with the latest prediction from the backend.
        if (typeof newPrediction === 'string') {
          setDetectedWord(newPrediction);

          // Only add non-empty predictions to the stability buffer for word building.
          if (newPrediction) {
            predictionStabilityRef.current.push(newPrediction);

            if (predictionStabilityRef.current.length > 15) {
              const last15 = predictionStabilityRef.current.slice(-15);
              const counts = last15.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

              if (counts[mostCommon] > 10) {
                setBuildingSentence(prev => {
                  if(prev.endsWith(mostCommon)) return prev;
                  const newWord = prev ? `${prev}${mostCommon}` : mostCommon;
                  
                  // Update suggestions
                  const matches = stringSimilarity.findBestMatch(newWord.toLowerCase(), WORDS);
                  const bestMatches = matches.ratings
                    .filter(match => match.rating > 0.5)
                    .sort((a, b) => b.rating - a.rating)
                    .map(match => match.target);
                  setSuggestions(bestMatches.slice(0, 3));

                  return newWord;
                });
                predictionStabilityRef.current = [];
              }
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
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    if (video.readyState < 2) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }

    if (canvasCtx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const results = handLandmarker.detectForVideo(video, Date.now());

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks && results.landmarks.length > 0 && results.handedness && results.handedness.length > 0) {
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HandLandmarker.HAND_CONNECTIONS as unknown as LandmarkConnectionArray, { color: '#00FF00', lineWidth: 5 });
          drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
        
        // Replicate the exact logic from the user's Tkinter application
        const keypoints: { x: number; y: number; z: number; }[] = [];
        keypoints.push(...results.landmarks[0]);

        if (results.landmarks.length > 1) {
          keypoints.push(...results.landmarks[1]);
        } else {
          const placeholderHand = Array(21).fill({ x: 0, y: 0, z: 0 });
          keypoints.push(...placeholderHand);
        }

        setDetectionStatus(`${results.landmarks.length} hand(s) detected. Predicting...`);
        const now = Date.now();
        if (now - lastPredictionSent.current > 500) {
            const keypoints2D = keypoints.map(lm => [lm.x, lm.y]);
            sendLandmarksToBackend(keypoints2D);
            lastPredictionSent.current = now;
        }
      } else {
        setDetectionStatus('No hands detected in frame.');
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = setTimeout(() => {
          if (buildingSentence) {
            setFinalTranslation(prevFinal => prevFinal ? `${prevFinal} ${buildingSentence}` : buildingSentence);
            setBuildingSentence('');
            setSuggestions([]);
            predictionStabilityRef.current = [];
          }
        }, 2000); // After 2s of inactivity, commit sentence
      }
      canvasCtx.restore();
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
    setDetectedWord('No sign detected');
    setBuildingSentence('');
    setFinalTranslation('');
    setSuggestions([]);
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    predictionStabilityRef.current = [];
  };

  useEffect(() => {
    return () => {
      stopVideo();
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    detectedWord,
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
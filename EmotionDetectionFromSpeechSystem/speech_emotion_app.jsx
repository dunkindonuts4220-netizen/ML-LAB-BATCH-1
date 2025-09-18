import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Upload, Play, Bot, Smile, Meh, Frown } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

export default function EmotionApp() {
  const [audioFile, setAudioFile] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  // Handle audio upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      initWaveform(file);
    }
  };

  // Initialize waveform visualization
  const initWaveform = (file) => {
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#94a3b8",
      progressColor: "#0ea5e9",
      cursorColor: "#0ea5e9",
      barWidth: 2,
      responsive: true,
      height: 100,
    });
    wavesurfer.current.loadBlob(file);
  };

  // Simulated API call for emotion detection
  const detectEmotion = async () => {
    if (!audioFile) return;
    setLoading(true);
    setTimeout(() => {
      // Mock prediction
      const emotions = ["Happy", "Neutral", "Sad"];
      const chosen = emotions[Math.floor(Math.random() * emotions.length)];
      const conf = Math.floor(Math.random() * 30) + 70;
      setEmotion(chosen);
      setConfidence(conf);
      setHistory((prev) => [{ emotion: chosen, conf, file: audioFile.name }, ...prev]);
      setLoading(false);
    }, 2000);
  };

  const emotionIcon = (emo) => {
    switch (emo) {
      case "Happy": return <Smile className="text-green-500" size={32}/>;
      case "Sad": return <Frown className="text-blue-500" size={32}/>;
      default: return <Meh className="text-gray-500" size={32}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 flex flex-col items-center gap-6">
      <Card className="w-full max-w-2xl bg-slate-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bot /> Speech Emotion Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Upload Section */}
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Mic size={18}/> Record
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept="audio/*" className="hidden" onChange={handleUpload}/>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={18}/> Upload
              </Button>
            </label>
          </div>

          {/* Waveform */}
          <div ref={waveformRef} className="w-full bg-slate-800 rounded-xl"></div>

          {/* Detect Button */}
          <Button onClick={detectEmotion} disabled={!audioFile || loading} className="w-full bg-sky-500 hover:bg-sky-600">
            {loading ? "Analyzing..." : "Detect Emotion"}
          </Button>

          {/* Results */}
          {emotion && (
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl">
              {emotionIcon(emotion)}
              <p className="text-lg font-semibold">{emotion}</p>
              <Progress value={confidence} className="w-48"/>
              <p className="text-sm text-gray-400">Confidence: {confidence}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card className="w-full max-w-2xl bg-slate-900 mt-4">
          <CardHeader>
            <CardTitle className="text-xl">History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {history.map((h, idx) => (
                <li key={idx} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                  <span>{h.file}</span>
                  <span className="flex items-center gap-2">{emotionIcon(h.emotion)} {h.emotion} ({h.conf}%)</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

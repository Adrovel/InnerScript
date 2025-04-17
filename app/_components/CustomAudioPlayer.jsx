'use client'

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

export default function CustomAudioPlayer({ src }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)

    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60) || 0
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-[#F6F5F4] p-2 rounded-md shadow-sm w-full max-w-md">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <div className="flex items-center justify-between">
        <button onClick={togglePlay} className="px-2 py-1 rounded bg-gray-200">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-sm text-gray-700">
          {console.log(duration)}
          {console.log(currentTime)}
          {formatTime(duration - currentTime)}
        </span>
      </div>
    </div>
  );
};

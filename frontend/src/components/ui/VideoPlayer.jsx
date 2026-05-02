import React, { useRef, useState, useEffect } from "react";
import styles from "./Video.module.css";

export default function VideoPlayer({
  videoUrl,
  type = "video/mp4",
  width = 775,
  height = 419,
  radius = 19,
  autoPlay = false,
  loop = false,
  muted = false,
  onVideoEnd
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const lastTime = useRef(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      lastTime.current = video.currentTime;
    };

    const handleSeeking = () => {
      if (video.currentTime > lastTime.current) {
        video.currentTime = lastTime.current;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onVideoEnd) onVideoEnd();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoEnd]);

  return (
    <div style={{ position: "relative", width: width, height: height, borderRadius: radius, overflow: "hidden", background: "#d1d5db" }}>
      <video 
        ref={videoRef} 
        style={{ borderRadius: radius, width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }} 
        autoPlay={autoPlay} 
        loop={loop} 
        muted={muted}
        controls={false}
        onClick={handlePlayPause}
      >
        <source src={videoUrl} type={type} />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div 
          onClick={handlePlayPause}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px"
          }}
        >
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.15))" }}>
            <path d="M8 5V19L19 12L8 5Z" fill="#1976D2" />
          </svg>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const CameraFeed = ({ onResults }) => {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const faceMeshRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (
        results.multiFaceLandmarks &&
        results.multiFaceLandmarks.length > 0
      ) {
        onResults(results.multiFaceLandmarks[0]);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        const video = videoRef.current;
        // Verifica que el video esté completamente cargado
        if (video && video.readyState === 4) {
          await faceMesh.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    cameraRef.current = camera;
    faceMeshRef.current = faceMesh;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center mt-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-lg border border-blue-300 shadow-md"
      />
    </div>
  );
};

export default CameraFeed;

"use client";
import { useState, useEffect } from "react";
import { Switch } from "@mantine/core";

const ScreenAwakeToggle = () => {
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  let wakeLock: WakeLockSentinel | null = null;

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Screen Wake Lock is active");
      } catch (err) {
        console.error("Wake Lock request failed:", err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock) {
        await wakeLock.release();
        console.log("Screen Wake Lock released");
      }
    };

    if (isWakeLockActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isWakeLockActive]);

  return (
    <Switch
      checked={isWakeLockActive}
      onChange={() => setIsWakeLockActive((prev) => !prev)}
      label="Keep screen awake"
    />
  );
};

export default ScreenAwakeToggle;

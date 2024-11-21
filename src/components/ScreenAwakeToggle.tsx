"use client";
import { useState, useEffect } from "react";
import { Switch } from "@mantine/core";

type Breakpoint = "base" | "xs" | "sm" | "md" | "lg" | "xl";

interface ScreenAwakeToggleProps {
  hiddenFrom?: Breakpoint;
  visibleFrom?: Breakpoint;
  labelPosition: "left" | "right";
}

export const ScreenAwakeToggle: React.FC<ScreenAwakeToggleProps> = ({
  hiddenFrom,
  visibleFrom,
  labelPosition,
}) => {
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
      hiddenFrom={hiddenFrom}
      visibleFrom={visibleFrom}
      checked={isWakeLockActive}
      onChange={() => setIsWakeLockActive((prev) => !prev)}
      label="Screen awake"
      labelPosition={labelPosition}
      size="md"
    />
  );
};

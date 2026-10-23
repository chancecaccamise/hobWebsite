"use client";

import { useSyncExternalStore } from "react";
import styles from "./Countdown.module.css";

function subscribeToClock(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const getNowInSeconds = () => Math.floor(Date.now() / 1000);
// The server has no stable "now", so render placeholders until hydration.
const getServerNow = () => null;

const UNITS = [
  { label: "Days", seconds: 86400 },
  { label: "Hours", seconds: 3600 },
  { label: "Minutes", seconds: 60 },
  { label: "Seconds", seconds: 1 },
];

export function Countdown({ launchDate }: { launchDate: string }) {
  const now = useSyncExternalStore(subscribeToClock, getNowInSeconds, getServerNow);
  const target = Math.floor(new Date(launchDate).getTime() / 1000);

  if (now !== null && now >= target) {
    return <p className={styles.launched}>We&apos;re live!</p>;
  }

  const remaining = now === null ? null : target - now;

  return (
    <div className={styles.countdown} role="timer" aria-label="Time until launch">
      {UNITS.map(({ label, seconds }, i) => {
        // Each unit is what's left after removing the next-larger unit (days are uncapped).
        const value =
          remaining === null
            ? "--"
            : String(
                Math.floor((i === 0 ? remaining : remaining % UNITS[i - 1].seconds) / seconds),
              ).padStart(2, "0");
        return (
          <div key={label} className={styles.unit}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

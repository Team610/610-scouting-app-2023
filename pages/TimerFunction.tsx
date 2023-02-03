import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TimerFunction(count: number, setAuto: Function) {
  const [time, setTime] = useState(count);

  // redirect page to "TeleOp" after 10 seconds while displaying remaining time on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) {
      setAuto(false);
    }
    return () => clearTimeout(timer);
  }, [time]);
  return time;
}

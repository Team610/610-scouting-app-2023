import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChargeStation from "../ChargeStation";
import { deafultChargingStation } from "../match";

export function timerFunction(
  count: number,
  setGameState: Function,
  setChargingStation: Function
) {
  const [time, setTime] = useState(count);

  // redirect page to "TeleOp" after 10 seconds while displaying remaining time on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) {
      setGameState("teleop");
      setChargingStation(deafultChargingStation);
    }
    return () => clearTimeout(timer);
  }, [time]);
  return time;
}
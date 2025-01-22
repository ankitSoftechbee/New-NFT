import React, { useEffect, useState } from "react";
import "./../assets/FlipClock.css" // Import custom styles for the flip clock

const Timer = () => {
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [seconds, setSeconds] = useState("00");

    useEffect(() => {
        const target = new Date();
        target.setHours(24, 1, 0, 0); // Set target to 00:01 AM next day

        const timerInterval = setInterval(() => {
            const now = new Date();
            const timeDiff = target - now;

            if (timeDiff > 0) {
                const hrs = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((timeDiff / (1000 * 60)) % 60);
                const secs = Math.floor((timeDiff / 1000) % 60);

                setHours(hrs.toString().padStart(2, "0"));
                setMinutes(mins.toString().padStart(2, "0"));
                setSeconds(secs.toString().padStart(2, "0"));
            } else {
                clearInterval(timerInterval);
            }
        }, 1000);

        return () => clearInterval(timerInterval); // Cleanup on unmount
    }, []);

    return (
        <div className="bg-app-bg-secondary p-4 flex flex-col gap-5">
            <h3 className="text-lg text-center text-app-text-primary font-bold">Time Remaining in Next Trade</h3>
            <div className="flip-clock">
                <div className="flex flex-col" style={{ alignItems: "center" }}>
                    <div className="flip-unit">
                        <div className="flip-card">
                            <div className="flip-card-front">{hours[0]}</div>
                            <div className="flip-card-back">{hours[0]}</div>
                        </div>
                        <div className="flip-card">
                            <div className="flip-card-front">{hours[1]}</div>
                            <div className="flip-card-back">{hours[1]}</div>
                        </div>
                    </div>
                    <span className="text-white">Hours</span>
                </div>

                <div className="flex flex-col" style={{ alignItems: "center" }}>
                    <div className="flip-unit">
                        <div className="flip-card">
                            <div className="flip-card-front">{minutes[0]}</div>
                            <div className="flip-card-back">{minutes[0]}</div>
                        </div>
                        <div className="flip-card">
                            <div className="flip-card-front">{minutes[1]}</div>
                            <div className="flip-card-back">{minutes[1]}</div>
                        </div>
                    </div>
                    <span className="text-white">Minutes</span>
                </div>

                <div className="flex flex-col" style={{ alignItems: "center" }}>
                    <div className="flip-unit">
                        <div className="flip-card">
                            <div className="flip-card-front">{seconds[0]}</div>
                            <div className="flip-card-back">{seconds[0]}</div>
                        </div>
                        <div className="flip-card">
                            <div className="flip-card-front">{seconds[1]}</div>
                            <div className="flip-card-back">{seconds[1]}</div>
                        </div>
                    </div>
                    <span className="text-white">Seconds</span>
                </div>
            </div>
        </div>
    );
};

export default Timer;

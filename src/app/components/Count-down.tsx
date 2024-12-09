'use client'; // Ensures this component runs client-side

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button'; // Importing Button from Shadcn UI
import { Input } from '@/app/components/ui/input';   // Importing Input from Shadcn UI

const Countdown = () => {
  // State to hold the input time values (hours, minutes, seconds)
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // State to hold the remaining time in seconds and the timer status
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState<'paused' | 'running' | 'stopped'>('paused');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Handle the change in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hours' | 'minutes' | 'seconds') => {
    const value = parseInt(e.target.value, 10) || 0; // Default to 0 if input is not a number
    if (type === 'hours') setHours(value);
    if (type === 'minutes') setMinutes(value);
    if (type === 'seconds') setSeconds(value);
  };

  // Function to start the timer
  const startTimer = () => {
    // Calculate total time in seconds
    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalTimeInSeconds > 0) {
      setRemainingTime(totalTimeInSeconds);
      setTimerStatus('running');
    }
  };

  // Function to pause the timer
  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);  // Stop the interval
      setIntervalId(null);
    }
    setTimerStatus('paused');
  };

  // Function to stop the timer (reset)
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);  // Stop the interval
      setIntervalId(null);
    }
    setRemainingTime(0);  // Reset remaining time to 0
    setTimerStatus('stopped');
  };

  // Countdown logic (runs when the timer is running)
  useEffect(() => {
    if (timerStatus === 'running' && remainingTime > 0) {
      // Start the countdown
      const id = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);  // Stop when the timer reaches 0
            setTimerStatus('stopped');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Update every second

      setIntervalId(id);  // Store interval ID for clearing

    }

    // Cleanup on unmount or if the interval is cleared
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerStatus, remainingTime]); // Re-run on timerStatus or remainingTime change

  // Convert remaining time (in seconds) to hours, minutes, and seconds
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { hours: displayHours, minutes: displayMinutes, seconds: displaySeconds } = formatTime(remainingTime);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-800">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4 text-black">Custom Countdown Timer</h1>

        {/* Input fields for setting time */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="hours" className="text-xl">Hours</label>
              <Input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => handleInputChange(e, 'hours')}
                className="w-16 p-2 text-black bg-slate-100"
                min="0"
                max="99"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="minutes" className="text-xl">Minutes</label>
              <Input
                type="number"
                id="minutes"
                value={minutes}
                onChange={(e) => handleInputChange(e, 'minutes')}
                className="w-16 p-2 text-black bg-slate-100"
                min="0"
                max="59"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="seconds" className="text-xl">Seconds</label>
              <Input
                type="number"
                id="seconds"
                value={seconds}
                onChange={(e) => handleInputChange(e, 'seconds')}
                className="w-16 p-2 text-black bg-slate-100"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>

        {/* Timer display */}
        <div className="text-6xl mb-4 font-bold">
          {String(displayHours).padStart(2, '0')}:
          {String(displayMinutes).padStart(2, '0')}:
          {String(displaySeconds).padStart(2, '0')}
        </div>

        {/* Control buttons */}
        <div className="flex justify-center space-x-4">
          {timerStatus === 'paused' || timerStatus === 'stopped' ? (
            <Button
              onClick={startTimer}
              variant="default"
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white font-bold"
            >
              Start
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              variant="default"
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-white font-bold"
            >
              Pause
            </Button>
          )}

          {timerStatus !== 'stopped' && (
            <Button
              onClick={stopTimer}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-white font-bold"
            >
              Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
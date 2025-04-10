import { useState, useEffect } from 'react'; // brings in state and effect tools from React

// This hook handles all the logic for tracking time
export default function useTimer() {
  
  const [sessionName, setSessionName] = useState(''); // The name of the current session 
  const [startTime, setStartTime] = useState(null); // When the session started (actual timestamp)
  const [elapsedTime, setElapsedTime] = useState(0); // How long the session has been running (in seconds)
  const [savedElapsed, setSavedElapsed] = useState(0); // The total time saved before the last pause
  const [isPaused, setIsPaused] = useState(false); // If the session is currently paused
  const [pauseStartTime, setPauseStartTime] = useState(null); // When the pause started (so we can calculate how long it lasted)
  const [totalPausedTime, setTotalPausedTime] = useState(0); // Total time the session has been paused
  const [sessionCount, setSessionCount] = useState(1); // Used for auto-naming sessions (e.g. Session 1, Session 2, etc.)
  const [eventBlocks, setEventBlocks] = useState([]); // All the completed session blocks (each one is an object with info)
  const isTracking = startTime !== null; // Is a session currently running?

  // Starts a new session
  const startTracking = () => {
    const name = sessionName.trim(); // remove extra spaces
    const finalName = name !== '' ? name : `Session ${sessionCount}`; // use typed name or generate one

    setSessionName(finalName);
    setStartTime(new Date()); // mark current time as start
    setElapsedTime(0);
    setSavedElapsed(0);
    setIsPaused(false);

    if (name === '') {
      setSessionCount(prev => prev + 1); // only increase if auto-naming
    }
  };

  // Pauses the session
  const pauseTracking = () => {
    setIsPaused(true);
    setSavedElapsed(elapsedTime); // save current time
    setPauseStartTime(new Date()); // mark when pause started
  };

  // Resumes after pause
  const resumeTracking = () => {
    if (pauseStartTime) {
      const now = new Date();
      const pausedDuration = (now.getTime() - pauseStartTime.getTime()) / 1000;
      setTotalPausedTime(prev => prev + pausedDuration); // add to total pause time
    }

    setStartTime(new Date()); // set new start time
    setIsPaused(false);
    setPauseStartTime(null); // clear pause
  };

  // Stops the session and saves the data as a block
  const stopTracking = () => {
    if (startTime) {
      const endTime = new Date(); // session ends now
      const durationSeconds = elapsedTime;

      const newBlock = {
        id: Date.now(), // unique ID
        name: sessionName,
        start: startTime,
        end: endTime,
        duration: durationSeconds,
        rest: Math.floor(totalPausedTime), // paused time
        active: durationSeconds - Math.floor(totalPausedTime), // active work time
      };

      setEventBlocks([...eventBlocks, newBlock]); // add to the list
    }

    // Reset everything
    setStartTime(null);
    setElapsedTime(0);
    setSessionName('');
    setIsPaused(false);
    setSavedElapsed(0);
    setTotalPausedTime(0);
    setPauseStartTime(null);
  };

  // Runs the timer every second while it's active
  useEffect(() => {
    let interval;

    if (startTime && !isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(savedElapsed + diff); // update time every second
      }, 1000);
    }

    // Clear timer if stopped or paused
    return () => clearInterval(interval);
  }, [startTime, isPaused, savedElapsed]);

  // Return everything we need from this hook
  return {
    sessionName,            // current session name
    setSessionName,         // function to update the name
    elapsedTime,            // how long it's been running
    isPaused,               // is it paused?
    isTracking,             // is the timer running?
    startTracking,          // start session
    pauseTracking,          // pause session
    resumeTracking,         // resume session
    stopTracking,           // stop and save session
    eventBlocks,            // all saved sessions
    setEventBlocks,         // update saved sessions manually
  };
}

import React, { useState, useEffect, useRef } from 'react';

function TimerComponent({ index, timer, onComplete, addTimer, currentTimer, isRunning, removeTimer, disabled }) {
  const [time, setTime] = useState({
    days: timer.days || 0,
    hours: timer.hours || 0,
    minutes: timer.minutes || 0,
    seconds: timer.seconds || 0,
    name: timer.name || ''
  });

  const [edit, setEdit] = useState(false);
  const [isRunningLocal, setIsRunning] = useState(isRunning || false);

  // Handle pause/resume toggle
  const toggleTimer = () => {
    if (!disabled) {
      setIsRunning(!isRunningLocal);
    }
  };

  const copyTimer = () => {
    addTimer(timer.name, timer.days, timer.hours, timer.minutes, timer.seconds);
  };

  // Reset timer to original values
  const resetTimer = () => {
    setTime({
      days: timer.days || 0,
      hours: timer.hours || 0,
      minutes: timer.minutes || 0,
      seconds: timer.seconds || 0,
    });
    setIsRunning(false); // Ensure the timer is stopped
  };

  // Effect to reset time state only when currentTimer changes
  useEffect(() => {
    if (currentTimer === timer.id) {
      setTime({
        days: timer.days,
        hours: timer.hours,
        minutes: timer.minutes,
        seconds: timer.seconds,
      });
    }
  }, [currentTimer, timer]);

  // Effect to handle countdown
  const onCompleteCalledRef = useRef(false);
  useEffect(() => {
    let interval = null;
  
    if (currentTimer !== undefined && currentTimer === timer.id && isRunningLocal) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const totalSeconds =
            prevTime.days * 86400 +
            prevTime.hours * 3600 +
            prevTime.minutes * 60 +
            prevTime.seconds;
  
          if (totalSeconds <= 1) {
            clearInterval(interval);
  
            // Ensure onComplete is called only once
            if (!onCompleteCalledRef.current) {
                onCompleteCalledRef.current = true;
                onComplete(timer); // Notify the parent that the timer is complete
            }
            return {
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            };
          }
  
          const newTime = totalSeconds - 1;
          return {
            days: Math.floor(newTime / 86400),
            hours: Math.floor((newTime % 86400) / 3600),
            minutes: Math.floor((newTime % 3600) / 60),
            seconds: newTime % 60,
          };
        });
      }, 1000);
    }
  
    return () => {
        clearInterval(interval);
        onCompleteCalledRef.current = false; // Reset the onComplete flag when the interval is cleared
      };
  }, [isRunningLocal, timer.id, onComplete, currentTimer]);
  

  return (
    <div style={{ padding: '10px' }}>
      <h3>
        Timer {index + 1}: {timer.name}
      </h3>
      <p>
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </p>
      {!disabled && (
        <>
          <button onClick={toggleTimer}>
            {isRunningLocal ? 'Pause' : 'Resume'}
          </button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={() => {
            setEdit(!edit)}}>{!edit ? 'Edit' : 'Close'}</button>
            <button onClick={copyTimer}>Duplicate</button>
          <button onClick={() => {
            removeTimer(timer.id || -1)}}>Remove</button>
        </>
      )}
      {
        edit && (
          <div>
            <label>
              Name:
              <input
                type="text"
                value={time.name}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <br />
            <label>
              Days:
              <input
                type="number"
                value={time.days}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, days: parseInt(e.target.value, 10) }))
                }
              />
            </label>
            <br />
            <label>
              Hours:
              <input
                type="number"
                value={time.hours}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, hours: parseInt(e.target.value, 10) }))
                }
              />
            </label>
            <br />
            <label>
              Minutes:
              <input
                type="number"
                value={time.minutes}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, minutes: parseInt(e.target.value, 10) }))
                }
              />
            </label>
            <br />
            <label>
              Seconds:
              <input
                type="number"
                value={time.seconds}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, seconds: parseInt(e.target.value, 10) }))
                }
              />
            </label>
          </div>
        )
      }
    </div>
  );
}

export default TimerComponent;

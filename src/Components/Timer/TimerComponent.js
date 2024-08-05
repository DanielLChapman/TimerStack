import React, { useState, useEffect } from 'react';

function TimerComponent({ index, timer, onComplete, disabled }) {
  const [time, setTime] = useState({
    days: timer.days || 0,
    hours: timer.hours || 0,
    minutes: timer.minutes || 0,
    seconds: timer.seconds || 0,
    name: timer.name || ''
  });

  const [isRunning, setIsRunning] = useState(false);

  // Handle pause/resume toggle
  const toggleTimer = () => {
    if (!disabled) {
      setIsRunning(!isRunning);
    }
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

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const totalSeconds =
            prevTime.days * 86400 +
            prevTime.hours * 3600 +
            prevTime.minutes * 60 +
            prevTime.seconds;

          if (totalSeconds <= 1) {
            clearInterval(interval);
            onComplete(timer); // Notify the parent that the timer is complete
            return prevTime;
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

    return () => clearInterval(interval);
  }, [isRunning, timer, onComplete]);

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
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button onClick={resetTimer}>Reset</button>
        </>
      )}
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
    </div>
  );
}

export default TimerComponent;

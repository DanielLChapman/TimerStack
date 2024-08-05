import React, { useEffect, useState } from 'react';
import TimerComponent from './Timer/TimerComponent';
import TimerAdd from './Timer/TimerAdd';

function TimerContainer() {
  const [originalTimers, setOriginalTimers] = useState([]);
  const [timerStack, setTimerStack] = useState([...originalTimers]);
  const [usedTimers, setUsedTimers] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);

  let nextId = 0;

  const start = () => {
    reset();
    if (!currentTimer && timerStack.length > 0) {
      let [nextTimer, ...rest] = timerStack;
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
    }
  };

  const reset = () => {
    setCurrentTimer(null);
    setTimerStack([...originalTimers]);
    setUsedTimers([]);
  };

  const addTimer = (name, days, hours, minutes, seconds) => {
    const newTimer = {
      id: nextId++,
      name,
      days,
      hours,
      minutes,
      seconds,
    };

    setOriginalTimers((prevTimers) => [...prevTimers, newTimer]);
    setTimerStack((prevTimers) => [...prevTimers, newTimer]);
  };

  const onTimerComplete = (completedTimer) => {
    setUsedTimers((prevUsedTimers) => [...prevUsedTimers, completedTimer]);
    if (timerStack.length > 0) {
      let [nextTimer, ...rest] = timerStack;
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
    } else {
      setCurrentTimer(null);
    }
  };

  useEffect(() => {
    if (currentTimer) {
      console.log('start counting down');
    }
  }, [currentTimer]);

  return (
    <div>
      <button onClick={start}>Start Timers</button>
      <button onClick={reset}>Reset Timers</button>
      <TimerAdd addTimer={addTimer} />
      <div style={{ marginTop: '20px' }}>
        <h2>Used Timers (Completed)</h2>
        {usedTimers.map((timer, index) => (
          <div key={timer.id} style={{ opacity: 0.5 }}>
            <TimerComponent index={index} timer={timer} disabled />
          </div>
        ))}
        <h2>Current Timer</h2>
        {currentTimer && (
          <div style={{ border: '2px solid black' }}>
            <TimerComponent
              index={usedTimers.length}
              timer={currentTimer}
              onComplete={onTimerComplete}
            />
          </div>
        )}
        <h2>Upcoming Timers</h2>
        {timerStack.map((timer, index) => (
          <div key={timer.id} style={{ opacity: 0.5 }}>
            <TimerComponent index={index} timer={timer} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimerContainer;

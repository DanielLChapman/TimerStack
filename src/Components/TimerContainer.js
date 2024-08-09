import React, { useEffect, useState } from "react";
import TimerComponent from "./Timer/TimerComponent";
import TimerAdd from "./Timer/TimerAdd";

function TimerContainer() {
  const [originalTimers, setOriginalTimers] = useState([]);
  const [timerStack, setTimerStack] = useState([...originalTimers]);
  const [usedTimers, setUsedTimers] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  let nextId = 0;

  const start = () => {
    reset();
    if (!currentTimer && timerStack.length > 0) {
      let [nextTimer, ...rest] = timerStack;
      setIsRunning(true);
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
      
    }
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentTimer(null);
    setTimerStack([...originalTimers]);
    setUsedTimers([]);
  };

  const addTimer = (name, days, hours, minutes, seconds) => {
    const newTimer = {
      id: originalTimers.length + 1,
      name,
      days,
      hours,
      minutes,
      seconds,
      disabled: false,
    };

    console.log(newTimer)

    setOriginalTimers((prevTimers) => [...prevTimers, newTimer]);
    setTimerStack((prevTimers) => [...prevTimers, newTimer]);
  };

  const removeTimer = (id) => {
    setOriginalTimers((prevTimers) =>
      prevTimers.filter((timer) => timer.id !== id)
    );
    setTimerStack((prevTimers) =>
      prevTimers.filter((timer) => timer.id !== id)
    );
    setUsedTimers((prevTimers) =>
      prevTimers.filter((timer) => timer.id !== id)
    );

    if (currentTimer && currentTimer.id === id) {
      if (timerStack.length > 0) {
        const [nextTimer, ...rest] = timerStack;
        setCurrentTimer(nextTimer);
        setTimerStack(rest);
      } else {
        setCurrentTimer(null);
      }
    }
  };

  
  const onTimerComplete = (completedTimer) => {
    setUsedTimers((prevUsedTimers) => [...prevUsedTimers, completedTimer]);
  
    if (timerStack.length > 0) {
      const [nextTimer, ...rest] = timerStack;
      console.log(nextTimer);
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
    } else {
      setCurrentTimer(null);
      setIsRunning(false); // Ensure that the timer stops running
    }
  };
  


  useEffect(() => {
    if (currentTimer) {
      console.log("start counting down");
    }
  }, [currentTimer]);

  return (
    <div>
      <button onClick={start}>Start Timers</button>
      <button onClick={reset}>Reset Timers</button>
      <TimerAdd addTimer={addTimer} />
      <div style={{ marginTop: "20px" }}>
        <h2>Used Timers (Completed)</h2>
        {usedTimers.map((timer, index) => (
          <div key={timer.id} style={{ opacity: 0.5 }}>
            <TimerComponent
              index={index}
              timer={timer}
              addTimer={addTimer}
              removeTimer={removeTimer}
              isRunning={isRunning}
              disabled
            />
          </div>
        ))}
        <h2>Current Timer</h2>
        {currentTimer && (
          <div style={{ border: "2px solid black" }}>
            <TimerComponent
              index={usedTimers.length}
              timer={currentTimer}
              onComplete={onTimerComplete}
              addTimer={addTimer}
              isRunning={isRunning}
              removeTimer={removeTimer}
              currentTimer={currentTimer.id}
            />
          </div>
        )}
        <h2>Upcoming Timers</h2>
        {timerStack.map((timer, index) => (
          <div key={timer.id} style={{ opacity: 1 }}>
            <TimerComponent
              index={index}
              timer={timer}
              isRunning={isRunning}
              addTimer={addTimer}
              removeTimer={removeTimer}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimerContainer;

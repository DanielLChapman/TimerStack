import React, { useEffect, useState } from "react";
import TimerComponent from "./Timer/TimerComponent";
import TimerAdd from "./Timer/TimerAdd";
import { Draggable } from "react-drag-reorder";

function TimerContainer() {
  const [originalTimers, setOriginalTimers] = useState([]);
  const [timerStack, setTimerStack] = useState([...originalTimers]);
  const [usedTimers, setUsedTimers] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const start = () => {
    reset();
    if (!currentTimer && timerStack.length > 0) {
      let [nextTimer, ...rest] = timerStack;
      setIsRunning(true);
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
      setUtterance(nextTimer.name);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentTimer(null);
    setUsedTimers([]);
    setTimerStack([...originalTimers]);
  
    // Optionally force a re-render if the timers are not showing up
    setForceRender((prev) => prev + 1);
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

    setOriginalTimers((prevTimers) => [...prevTimers, newTimer]);
    setTimerStack((prevTimers) => [...prevTimers, newTimer]);
    setForceRender((prev) => prev + 1);
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
    // Move state updates out of the render phase
    setUsedTimers((prevUsedTimers) => [...prevUsedTimers, completedTimer]);
    
    if (timerStack.length > 0) {
      const [nextTimer, ...rest] = timerStack;
      setCurrentTimer(nextTimer);
      setTimerStack(rest);
      setUtterance(nextTimer.name); // Trigger the next utterance when the timer changes
    } else {
      setCurrentTimer(null);
      setIsRunning(false); // Ensure that the timer stops running
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoice(voices[0]); // Optionally, set the first voice as default
      }
    };
  
    // Load voices initially
    loadVoices();
  
    // Add an event listener to load voices when they are available
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);
  
  

  useEffect(() => {
    if (currentTimer) {
      console.log("start counting down");
    }
  }, [currentTimer]);

  const getChangedPos = (currentPos, newPos) => {
    if (isRunning) {
      alert("Can't reorder while its currently running");
      return;
    }

    // Create a copy of the originalTimers array
    let t = [...originalTimers];

    // Remove the element from the current position
    let [movedItem] = t.splice(currentPos, 1);

    // Insert the element at the new position
    t.splice(newPos, 0, movedItem);

    // Update the state with the new array
    setOriginalTimers(t);
    setTimerStack(t);
  };

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
  };

  useEffect(() => {
    if (utterance !== null) {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(utterance);
  
      u.voice = voice;
      u.pitch = pitch;
      u.rate = rate;
      u.volume = volume;
      u.onend = () => {
        setUtterance(null); // Only reset after speaking is complete
      };
      
      synth.speak(u);
    }
  }, [utterance]);
  

  return (
    <div>
      <label className="block m-2 font-bold">
        Voice
        <select
          className="block w-full p-2 text-slate-900 mt-1 rounded border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          value={voice?.name}
          onChange={handleVoiceChange}
        >
          <option value="">Select a voice</option>
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>
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
        <div>
          {isRunning ? "true" : "false"}
          {isRunning ? (
            timerStack.map((timer, index) => (
              <div key={timer.id} style={{ opacity: 1 }}>
                <TimerComponent
                  index={index}
                  timer={timer}
                  isRunning={isRunning}
                  addTimer={addTimer}
                  removeTimer={removeTimer}
                />
              </div>
            ))
          ) : (
            <Draggable key={forceRender} onPosChange={getChangedPos}>
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
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimerContainer;

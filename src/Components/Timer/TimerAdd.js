import React, { useState } from 'react';

function TimerForm({ addTimer }) {
  const [name, setName] = useState('');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (name.trim() === '') {
      alert('Please enter a valid name for the timer.');
      return;
    }
    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
      alert('Please enter non-negative values for days, hours, minutes, and seconds.');
      return;
    }
    // Add the new timer
    addTimer(name, days, hours, minutes, seconds);
    // Reset the form fields after submission
    setName('');
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Days:
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Hours:
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Minutes:
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Seconds:
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <button type="submit">Add Timer</button>
    </form>
  );
}

export default TimerForm;

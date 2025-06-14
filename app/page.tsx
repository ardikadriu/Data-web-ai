'use client'

import { useState } from "react";

interface Event {
  date: string;
  time: string;
  title: string;
  desc: string;
  color: string;
}

const eventsData: Event[] = [
  {
    date: "2021-09-02",
    time: "10:00-13:00",
    title: "Design new UX flow for Michael",
    desc: "Start from screen 16",
    color: "green"
  },
  {
    date: "2021-09-02",
    time: "14:00-15:00",
    title: "Brainstorm with the team",
    desc: "Define the problem or question that...",
    color: "purple"
  },
  {
    date: "2021-09-02",
    time: "19:00-20:00",
    title: "Workout with Ella",
    desc: "We will do the legs and back workout",
    color: "blue"
  },
  {
    date: "2021-09-06",
    time: "09:00-10:00",
    title: "Daily Standup",
    desc: "Team sync meeting",
    color: "green"
  }
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const colorOptions = [
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" }
];

export default function Home() {
  const [year, setYear] = useState(2021);
  const [month, setMonth] = useState(8); // 0-indexed, 8 = September
  const [selectedDay, setSelectedDay] = useState(2);
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    time: "",
    title: "",
    desc: "",
    color: "green"
  });

  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfWeek(year, month); // 0 (Sun) - 6 (Sat)
  firstDay = firstDay === 0 ? 7 : firstDay; // Make Monday = 1

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(1);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  const handleAddEvent = () => {
    const selectedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const eventToAdd: Event = {
      date: selectedDateStr,
      time: newEvent.time || "",
      title: newEvent.title || "",
      desc: newEvent.desc || "",
      color: newEvent.color || "green"
    };
    setEvents([...events, eventToAdd]);
    setNewEvent({ time: "", title: "", desc: "", color: "green" });
    setIsModalOpen(false);
  };

  const selectedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
  const filteredEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      {/* Calendar Section */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 flex flex-col mr-6 relative">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="text-gray-400 text-2xl" onClick={handlePrevMonth}>&#8592;</button>
          <div className="text-center">
            <div className="text-lg font-semibold">{monthNames[month]} {year}</div>
          </div>
          <button className="text-gray-400 text-2xl" onClick={handleNextMonth}>&#8594;</button>
        </div>
        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {/* Empty slots before first day */}
          {[...Array(firstDay - 1)].map((_, i) => <div key={"empty-"+i}></div>)}
          {/* Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isSelected = day === selectedDay;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasEvent = events.some(e => e.date === dateStr);
            return (
              <button
                key={day}
                className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-150 ${isSelected ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-purple-100'} ${hasEvent ? 'border-2 border-purple-300' : ''}`}
                onClick={() => handleSelectDay(day)}
              >
                {day}
                {hasEvent && <span className="absolute mt-6 w-1.5 h-1.5 bg-purple-400 rounded-full"></span>}
              </button>
            );
          })}
        </div>
        {/* Events List */}
        <div className="flex-1">
          {filteredEvents.length === 0 && (
            <div className="text-gray-400 text-center mt-8">No events for this day.</div>
          )}
          {filteredEvents.map((event, idx) => (
            <div
              key={idx}
              className={`mb-4 bg-${event.color}-50 border-l-4 border-${event.color}-400 p-3 rounded-xl shadow-sm`}
            >
              <div className={`text-xs text-${event.color}-700 mb-1`}>{event.time}</div>
              <div className="font-semibold">{event.title}</div>
              <div className="text-xs text-gray-400">{event.desc}</div>
            </div>
          ))}
        </div>
        {/* FAB */}
        <button 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-purple-600 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>
      {/* Welcome Section */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-10 relative">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="font-bold text-lg">Calender.io</span>
        </div>
        {/* Welcome Text */}
        <div className="text-center mb-6">
          <div className="text-gray-400 text-sm">Welcome Michael!</div>
          <div className="text-2xl font-bold mt-2">It&apos;s Time to<br/>Organize your Day!</div>
        </div>
        {/* Avatar */}
       
        {/* Play Button */}
        <button className="bg-white border-4 border-purple-200 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z" />
          </svg>
        </button>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  placeholder="e.g., 10:00-11:00"
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Event title"
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Event description"
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.desc}
                  onChange={(e) => setNewEvent({...newEvent, desc: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                onClick={handleAddEvent}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

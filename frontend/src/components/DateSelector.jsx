import './DateSelector.css';

export default function DateSelector({ selectedDate, onDateSelect }) {
  // Generate next 7 days from base date
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateObj: d,
      value: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('en-GB', { month: 'short' })
    };
  });

  return (
    <div className="date-selector-container">
      <div className="date-scroll">
        {dates.map((d, index) => {
          const isSelected = selectedDate === d.value;
          return (
            <button
              key={index}
              className={`date-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => onDateSelect(isSelected ? null : d.value)}
            >
              <span className="date-day-name">{d.dayName}</span>
              <span className="date-day-num">{d.dayNum}</span>
              <span className="date-month-name">{d.monthName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

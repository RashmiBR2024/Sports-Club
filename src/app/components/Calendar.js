const CalendarDate = ({ date }) => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleString('default', { month: 'long' });
    const year = new Date(date).getFullYear();
    const weekday = new Date(date).toLocaleString('default', { weekday: 'long' });

    return (
        <div className="calendar-card">
            <div className="calendar-header">{month}</div>
            <div className="calendar-body">
                <p className="calendar-weekday">{weekday}</p>
                <h1 className="calendar-day">{day}</h1>
                <p className="calendar-year">{year}</p>
            </div>
        </div>
    );
};

export default CalendarDate;

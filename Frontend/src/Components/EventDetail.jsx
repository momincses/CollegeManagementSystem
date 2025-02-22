const EventDetail = () => {
  // ... existing code ...

  return (
    <div>
      {/* Existing event details */}
      
      {/* Show budget tracking only for approved events */}
      {event.status === 'approved' && (
        <BudgetTracking eventId={event._id} /> 
      )}
    </div>
  );
}; 
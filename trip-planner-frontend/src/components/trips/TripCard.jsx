import React, { useState } from 'react';

const TripCard = ({ trip, onClick, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(trip.name);
  const [notes, setNotes] = useState(trip.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ name, notes });
    setIsEditing(false);
  };

  const handleClick = (e) => {
    // Don't trigger card click when clicking on edit/delete buttons
    if (isEditing) return;
    if (e.target.tagName === 'BUTTON') return;
    onClick();
  };

  return (
    <div className="trip-card" onClick={handleClick}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group notes-editor">
            <input
              className="styled-textarea"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trip name"
              required
              autoFocus
            />
          </div>
          <div className="form-group notes-editor">
            <textarea
              className="styled-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
            />
          </div>
          <div className="form-actions">
            <button type="submit notes-button save-button">Save</button>
            <button type="button notes-button cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h3>{trip.name}</h3>
          {trip.notes && <p className="trip-notes">{trip.notes}</p>}
          <div className="card-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}>Edit</button>
            <button onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TripCard;

import React, { useState } from 'react';

const CreateTripForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, notes, places: [] });
  };

  return (
    <div className="create-trip-form">
      <h3>Create New Trip</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group notes-editor">
          <label htmlFor="trip-name">Trip Name</label>
          <input
            id="trip-name"
            type="text"
            value={name}
            className="styled-textarea"
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Summer Vacation 2023"
            required
          />
        </div>
        <div className="form-group notes-editor">
          <label htmlFor="trip-notes">Notes (Optional)</label>
          <textarea
            id="trip-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="styled-textarea"
            placeholder="Add any notes about this trip"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="notes-button save-button">Create Trip</button>
          <button type="button" className="notes-button cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTripForm;

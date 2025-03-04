import React, { useState } from 'react';
import TripCard from './TripCard';
import CreateTripForm from './CreateTripForm';

const TripList = ({ trips, onTripSelect, onCreateTrip, onUpdateTrip, onDeleteTrip }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="trip-list">
      <div className="panel-header">
        <h2>My Trips</h2>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(true)}
        >
          + New Trip
        </button>
      </div>
      
      {showCreateForm && (
        <CreateTripForm 
          onSubmit={(tripData) => {
            onCreateTrip(tripData);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      <div className="trip-cards-container">
        {trips.length === 0 ? (
          <p className="no-trips-message">
            You don't have any trips yet. Create your first trip to get started!
          </p>
        ) : (
          trips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => onTripSelect(trip)}
              onUpdate={(updates) => onUpdateTrip(trip.id, updates)}
              onDelete={() => onDeleteTrip(trip.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TripList;

import React, { useEffect, useRef } from 'react';
import PlaceCard from './PlaceCard';

const PlaceList = ({ 
  places, 
  selectedPlaceIndex, 
  onPlaceSelect, 
  onRemovePlace, 
  onUpdateNotes, 
  onAddPlaceAfter,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  tripId
}) => {
  const placeRefs = useRef([]);

  useEffect(() => {
    // When selectedPlaceIndex changes, scroll to that place card
    if (selectedPlaceIndex !== null && placeRefs.current[selectedPlaceIndex]) {
      placeRefs.current[selectedPlaceIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedPlaceIndex]);

  // Handler for adding a place before a specific index
  const handleAddPlaceBefore = (placeData, index) => {
    onAddPlaceAfter(placeData, index - 1);
  };

  return (
    <div className="place-list">
      <h3>Places</h3>
      
      {places.length === 0 ? (
        <p className="no-places-message">
          No places added to this trip yet. Use the search box above to add places.
        </p>
      ) : (
        <div className="place-cards-container">
          {places.map((place, index) => (
            <div
              key={place.uniqueId || `${place.placeId}_${index}`}
              ref={el => placeRefs.current[index] = el}
            >
              <PlaceCard
                place={place}
                index={index}
                isSelected={index === selectedPlaceIndex}
                onClick={() => onPlaceSelect(index)}
                onRemove={() => onRemovePlace(index)}
                onUpdateNotes={(notes) => onUpdateNotes(index, notes)}
                onAddPlaceAfter={(placeData) => onAddPlaceAfter(placeData, index)}
                onAddPlaceBefore={(placeData) => handleAddPlaceBefore(placeData, index)}
                onAddActivity={onAddActivity}
                onUpdateActivity={onUpdateActivity}
                onDeleteActivity={onDeleteActivity}
                tripId={tripId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceList;

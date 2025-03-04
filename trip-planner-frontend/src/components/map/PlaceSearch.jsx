import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';

const PlaceSearch = ({ onPlaceSelected, isActivity }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  // Use the shared Google Maps loading state
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    // Add styles for the autocomplete dropdown
    const style = document.createElement('style');
    style.textContent = `
      .pac-container {
        z-index: 1000;
        position: absolute !important;
        width: 100% !important;
        min-width: 250px;
        margin-top: 1px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: white;
      }
    `;
    document.head.appendChild(style);

    if (!isLoaded) return;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['establishment', 'geocode'] }
      );
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry) return;
        
        const timestamp = Date.now();
        const placeData = {
          placeId: place.place_id,
          uniqueId: `${place.place_id}_${timestamp}`,
          activityId: isActivity ? `activity_${place.place_id}_${timestamp}` : undefined,
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          notes: '',
          googlePlaceData: {
            types: place.types,
            rating: place.rating,
            photos: place.photos?.map(photo => photo.getUrl()),
          }
        };
        
        onPlaceSelected(placeData);
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
    
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onPlaceSelected, isActivity]);

  return (
    <div className="place-search-container">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          placeholder={isActivity ? "Search for an activity..." : "Search for a place..."}
          className="search-input"
          disabled={!isLoaded}
        />
        {!isLoaded && (
          <p className="loading-text">
            Loading Google Places...
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaceSearch;

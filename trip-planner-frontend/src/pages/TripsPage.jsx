import React, { useState, useEffect } from 'react';
import { tripService } from '../services/tripService';
import TripMap from '../components/map/GoogleMap';
import TripList from '../components/trips/TripList';
import PlaceList from '../components/trips/PlaceList';
import PlaceSearch from '../components/map/PlaceSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './TripsPage.css';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('trips'); // 'trips' or 'places'

  // Fetch all trips on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await tripService.getAllTrips();
        setTrips(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Handler for trip selection
  const handleTripSelect = async (trip) => {
    try {
      setLoading(true);
      setSelectedPlaceIndex(null); // Reset selected place when changing trips
      const response = await tripService.getTrip(trip.id);
      setSelectedTrip(response);
      setView('places');
      setError(null);
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setError('Failed to load trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to go back to trips view
  const handleBackToTrips = () => {
    setView('trips');
    setSelectedTrip(null);
  };

  // Handler to add a new place to the selected trip
  const handleAddPlace = async (placeData, insertIndex = null) => {
    if (!selectedTrip) return;

    try {
      setLoading(true);
      const updatedPlaces = [...selectedTrip.places];
      
      if (insertIndex !== null) {
        const actualIndex = Math.max(0, insertIndex + 1);
        updatedPlaces.splice(actualIndex, 0, placeData);
      } else {
        updatedPlaces.push(placeData);
      }
      
      const response = await tripService.updateTripPlaces(selectedTrip.id, updatedPlaces);
      setSelectedTrip(response);
      setTrips(trips.map(trip => 
        trip.id === selectedTrip.id ? response : trip
      ));
      setSelectedPlaceIndex(insertIndex !== null ? Math.max(0, insertIndex + 1) : response.places.length - 1);
      setError(null);
    } catch (err) {
      console.error('Error adding place:', err);
      setError('Failed to add place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to remove a place from the selected trip
  const handleRemovePlace = async (index) => {
    if (!selectedTrip) return;

    try {
      setLoading(true);
      const updatedPlaces = selectedTrip.places.filter((_, i) => i !== index);
      const response = await tripService.updateTripPlaces(selectedTrip.id, updatedPlaces);
      setSelectedTrip(response);
      setTrips(trips.map(trip => 
        trip.id === selectedTrip.id ? response : trip
      ));
      if (selectedPlaceIndex === index) {
        setSelectedPlaceIndex(index);
      } else if (selectedPlaceIndex > index) {
        setSelectedPlaceIndex(selectedPlaceIndex - 1);
      }
      setError(null);
    } catch (err) {
      console.error('Error removing place:', err);
      setError('Failed to remove place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to update the notes for a place
  const handleUpdatePlaceNotes = async (index, notes) => {
    if (!selectedTrip) return;

    try {
      setLoading(true);
      const updatedPlaces = [...selectedTrip.places];
      updatedPlaces[index] = { ...updatedPlaces[index], notes };
      
      const response = await tripService.updateTripPlaces(selectedTrip.id, updatedPlaces);
      setSelectedTrip(response);
      setError(null);
    } catch (err) {
      console.error('Error updating place notes:', err);
      setError('Failed to update place notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to add an activity to a place
  const handleAddActivity = async (tripId, placeIndex, activity) => {
    try {
      setLoading(true);
      const response = await tripService.addActivity(tripId, placeIndex, activity);
      setSelectedTrip(response);
      setTrips(trips.map(trip => 
        trip.id === tripId ? response : trip
      ));
      setError(null);
    } catch (err) {
      console.error('Error adding activity:', err);
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to update an activity
  const handleUpdateActivity = async (tripId, placeIndex, activityIndex, updatedActivity) => {
    try {
      setLoading(true);
      const place = selectedTrip.places[placeIndex];
      const updatedActivities = [...place.activities];
      updatedActivities[activityIndex] = updatedActivity;
      
      const response = await tripService.updateActivities(tripId, placeIndex, updatedActivities);
      setSelectedTrip(response);
      setTrips(trips.map(trip => 
        trip.id === tripId ? response : trip
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating activity:', err);
      setError('Failed to update activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete an activity
  const handleDeleteActivity = async (tripId, placeIndex, activityIndex) => {
    try {
      setLoading(true);
      const response = await tripService.deleteActivity(tripId, placeIndex, activityIndex);
      setSelectedTrip(response);
      setTrips(trips.map(trip => 
        trip.id === tripId ? response : trip
      ));
      setError(null);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to create a new trip
  const handleCreateTrip = async (tripData) => {
    try {
      setLoading(true);
      const response = await tripService.createTrip(tripData);
      setTrips([...trips, response]);
      setError(null);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to update a trip's name or notes
  const handleUpdateTrip = async (tripId, updates) => {
    try {
      setLoading(true);
      const response = await tripService.updateTrip(tripId, updates);
      
      // Update both trips list and selected trip if it's the one being edited
      setTrips(trips.map(trip => trip.id === tripId ? response : trip));
      
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(response);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error updating trip:', err);
      setError('Failed to update trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete a trip
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      setLoading(true);
      await tripService.deleteTrip(tripId);
      
      // Remove the trip from the trips list
      setTrips(trips.filter(trip => trip.id !== tripId));
      
      // If the deleted trip was selected, go back to trips view
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(null);
        setView('trips');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error deleting trip:', err);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trips-page">
      {error && <ErrorMessage message={error} />}
      
      <div className="trips-container">
        <div className="left-panel">
          {loading && <LoadingSpinner />}
          
          {view === 'trips' ? (
            <TripList 
              trips={trips} 
              onTripSelect={handleTripSelect}
              onCreateTrip={handleCreateTrip}
              onUpdateTrip={handleUpdateTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          ) : (
            <>
              <div className="panel-header">
                <button 
                  className="back-button" 
                  onClick={handleBackToTrips}
                >
                  ← Back to Trips
                </button>
                <h2>{selectedTrip?.name}</h2>
              </div>
              
              {selectedTrip.places.length === 0 ? (
                <div className="add-place-container">
                  <h3>Add a Place</h3>
                  <PlaceSearch onPlaceSelected={(place) => handleAddPlace(place)} />
                </div>
              ) : (
                <PlaceList 
                  places={selectedTrip?.places || []}
                  selectedPlaceIndex={selectedPlaceIndex}
                  onPlaceSelect={setSelectedPlaceIndex}
                  onRemovePlace={handleRemovePlace}
                  onUpdateNotes={handleUpdatePlaceNotes}
                  onAddPlaceAfter={handleAddPlace}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  tripId={selectedTrip.id}
                />
              )}
            </>
          )}
        </div>
        
        <div className="map-container">
          <TripMap 
            places={selectedTrip?.places || []}
            selectedPlaceIndex={selectedPlaceIndex}
            onMarkerClick={(place, index) => {
              setSelectedPlaceIndex(index);
            }}
            allTrips={view === 'trips' ? trips : null}
            onTripSelect={handleTripSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default TripsPage;

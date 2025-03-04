import api from './api';

export const tripService = {
  // Get all trips for current user
  getAllTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },
  
  // Get a specific trip by ID
  getTrip: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },
  
  // Create a new trip
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
  
  // Update trip details (name and notes)
  updateTrip: async (tripId, tripData) => {
    const response = await api.put(`/trips/${tripId}`, tripData);
    return response.data;
  },
  
  // Update trip places
  updateTripPlaces: async (tripId, places) => {
    const response = await api.put(`/trips/${tripId}/places`, places);
    return response.data;
  },
  
  // Delete a trip
  deleteTrip: async (tripId) => {
    return api.delete(`/trips/${tripId}`);
  },

  // Add an activity to a place
  addActivity: async (tripId, placeIndex, activity) => {
    const response = await api.post(`/trips/${tripId}/places/${placeIndex}/activities`, activity);
    return response.data;
  },

  // Update all activities for a place
  updateActivities: async (tripId, placeIndex, activities) => {
    const response = await api.put(`/trips/${tripId}/places/${placeIndex}/activities`, activities);
    return response.data;
  },

  // Delete an activity from a place
  deleteActivity: async (tripId, placeIndex, activityIndex) => {
    const response = await api.delete(`/trips/${tripId}/places/${placeIndex}/activities/${activityIndex}`);
    return response.data;
  }
};

import React, { useEffect, useRef, useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultMapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Map styling constants
const COLORS = {
  main: '#3b82f6',      // blue for main places
  activity: '#60a5fa',  // light blue for activities
};

// Colors for multiple trips
const TRIP_COLORS = [
  '#3b82f6',  // blue
  '#ef4444',  // red
  '#10b981',  // green
  '#f59e0b',  // yellow
  '#8b5cf6',  // purple
  '#ec4899',  // pink
  '#14b8a6',  // teal
  '#f97316',  // orange
  '#6366f1',  // indigo
  '#84cc16',  // lime
];

const TripMap = ({ places = [], selectedPlaceIndex, onMarkerClick, allTrips = null, onTripSelect }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const polylinesRef = useRef({});
  const { isLoaded } = useGoogleMaps();

  // Get map center and zoom based on places
  const getMapBounds = useCallback((placesToBound) => {
    if (!placesToBound?.length) {
      return { lat: 39.8283, lng: -98.5795, zoom: 4 }; // Default to US center
    }

    const bounds = {
      north: -90, south: 90, east: -180, west: 180
    };

    // Include all places and their activities in bounds
    placesToBound.forEach(place => {
      if (place && typeof place.lat === 'number' && typeof place.lng === 'number') {
        bounds.north = Math.max(bounds.north, place.lat);
        bounds.south = Math.min(bounds.south, place.lat);
        bounds.east = Math.max(bounds.east, place.lng);
        bounds.west = Math.min(bounds.west, place.lng);

        place.activities?.forEach(activity => {
          if (activity && typeof activity.lat === 'number' && typeof activity.lng === 'number') {
            bounds.north = Math.max(bounds.north, activity.lat);
            bounds.south = Math.min(bounds.south, activity.lat);
            bounds.east = Math.max(bounds.east, activity.lng);
            bounds.west = Math.min(bounds.west, activity.lng);
          }
        });
      }
    });

    return {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
      zoom: 11
    };
  }, []);

  // Clear all markers and polylines
  const clearMap = useCallback(() => {
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    Object.values(polylinesRef.current).forEach(polyline => polyline.setMap(null));
    markersRef.current = {};
    polylinesRef.current = {};
  }, []);

  // Create a marker with given properties
  const createMarker = useCallback((position, title, color, scale = 10) => {
    if (!mapRef.current) return null;
    return new window.google.maps.Marker({
      position,
      map: mapRef.current,
      title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: 'white',
        scale,
      }
    });
  }, []);

  // Create a polyline between two points
  const createPolyline = useCallback((start, end, color, opacity = 0.8, weight = 3) => {
    if (!mapRef.current) return null;
    return new window.google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: color,
      strokeOpacity: opacity,
      strokeWeight: weight,
      map: mapRef.current
    });
  }, []);

  // Handle map initialization
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    
    // Initial render of markers if data is available
    if (allTrips?.length > 0 || places?.length > 0) {
      clearMap();
      if (allTrips) {
        renderTrips();
      } else {
        renderPlaces();
      }
    }
  }, [allTrips, places]);

  // Render all trips on the map
  const renderTrips = useCallback(() => {
    if (!mapRef.current || !allTrips) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidPlaces = false;

    allTrips.forEach((trip, tripIndex) => {
      const color = TRIP_COLORS[tripIndex % TRIP_COLORS.length];
      
      trip.places?.forEach((place, placeIndex) => {
        if (!place || typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
        
        hasValidPlaces = true;
        const marker = createMarker(
          { lat: place.lat, lng: place.lng },
          place.name,
          color,
          10
        );
        
        if (marker) {
          marker.addListener('click', () => onTripSelect(trip));
          markersRef.current[`${tripIndex}-${placeIndex}`] = marker;
          bounds.extend({ lat: place.lat, lng: place.lng });
        }

        if (placeIndex < trip.places.length - 1) {
          const nextPlace = trip.places[placeIndex + 1];
          if (nextPlace && typeof nextPlace.lat === 'number' && typeof nextPlace.lng === 'number') {
            const polyline = createPolyline(
              { lat: place.lat, lng: place.lng },
              { lat: nextPlace.lat, lng: nextPlace.lng },
              color
            );
            if (polyline) {
              polylinesRef.current[`${tripIndex}-${placeIndex}`] = polyline;
            }
          }
        }
      });
    });

    if (hasValidPlaces) {
      mapRef.current.fitBounds(bounds, { 
        padding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        }
      });
    } else {
      const center = getMapBounds([]);
      mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      mapRef.current.setZoom(center.zoom);
    }
  }, [allTrips, createMarker, createPolyline, getMapBounds, onTripSelect]);

  // Render places for a single trip
  const renderPlaces = useCallback(() => {
    if (!mapRef.current || !places.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidPlaces = false;

    places.forEach((place, placeIndex) => {
      if (!place || typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
      
      hasValidPlaces = true;
      const marker = createMarker(
        { lat: place.lat, lng: place.lng },
        place.name,
        COLORS.main,
        10
      );
      
      if (marker) {
        marker.addListener('click', () => onMarkerClick(place, placeIndex));
        markersRef.current[placeIndex] = marker;
        bounds.extend({ lat: place.lat, lng: place.lng });
      }

      // Add connecting lines and activities
      if (placeIndex < places.length - 1) {
        const nextPlace = places[placeIndex + 1];
        if (nextPlace && typeof nextPlace.lat === 'number' && typeof nextPlace.lng === 'number') {
          const polyline = createPolyline(
            { lat: place.lat, lng: place.lng },
            { lat: nextPlace.lat, lng: nextPlace.lng },
            COLORS.main
          );
          if (polyline) {
            polylinesRef.current[placeIndex] = polyline;
          }
        }
      }

      // Add activities
      place.activities?.forEach((activity, activityIndex) => {
        if (!activity || typeof activity.lat !== 'number' || typeof activity.lng !== 'number') return;
        
        const activityMarker = createMarker(
          { lat: activity.lat, lng: activity.lng },
          activity.name,
          COLORS.activity,
          6
        );
        
        if (activityMarker) {
          markersRef.current[`${placeIndex}-${activityIndex}`] = activityMarker;
          bounds.extend({ lat: activity.lat, lng: activity.lng });
        }

        // Connect activities
        if (activityIndex < place.activities.length - 1) {
          const nextActivity = place.activities[activityIndex + 1];
          if (nextActivity && typeof nextActivity.lat === 'number' && typeof nextActivity.lng === 'number') {
            const polyline = createPolyline(
              { lat: activity.lat, lng: activity.lng },
              { lat: nextActivity.lat, lng: nextActivity.lng },
              COLORS.activity,
              0.6,
              2
            );
            if (polyline) {
              polylinesRef.current[`${placeIndex}-${activityIndex}`] = polyline;
            }
          }
        }

        // Connect first activity to place
        if (activityIndex === 0) {
          const polyline = createPolyline(
            { lat: place.lat, lng: place.lng },
            { lat: activity.lat, lng: activity.lng },
            COLORS.activity,
            0.4,
            2
          );
          if (polyline) {
            polylinesRef.current[`${placeIndex}-start`] = polyline;
          }
        }
      });
    });

    if (hasValidPlaces) {
      mapRef.current.fitBounds(bounds, { 
        padding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        }
      });
    } else {
      const center = getMapBounds([]);
      mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      mapRef.current.setZoom(center.zoom);
    }
  }, [places, createMarker, createPolyline, getMapBounds, onMarkerClick]);

  // Effect to update markers and polylines when data changes
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    clearMap();
    if (allTrips) {
      renderTrips();
    } else {
      renderPlaces();
    }
  }, [isLoaded, allTrips, places, clearMap, renderTrips, renderPlaces]);

  // Effect to handle zooming to selected place
  useEffect(() => {
    if (!isLoaded || !mapRef.current || selectedPlaceIndex === null || !places[selectedPlaceIndex]) return;

    const selectedPlace = places[selectedPlaceIndex];
    if (!selectedPlace || typeof selectedPlace.lat !== 'number' || typeof selectedPlace.lng !== 'number') return;

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: selectedPlace.lat, lng: selectedPlace.lng });

    selectedPlace.activities?.forEach(activity => {
      if (activity && typeof activity.lat === 'number' && typeof activity.lng === 'number') {
        bounds.extend({ lat: activity.lat, lng: activity.lng });
      }
    });

    mapRef.current.fitBounds(bounds, { padding: 50 });

    if (!selectedPlace.activities?.length) {
      mapRef.current.setZoom(15);
    }
  }, [isLoaded, selectedPlaceIndex, places]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      options={defaultMapOptions}
      onLoad={onMapLoad}
    />
  );
};

export default TripMap;

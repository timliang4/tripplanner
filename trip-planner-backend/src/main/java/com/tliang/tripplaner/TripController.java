package com.tliang.tripplaner;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripController(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Trip> getAllTrips(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return tripRepository.findByUserId(user.getId());
    }

    @GetMapping("/{id}")
    public Trip getTrip(@PathVariable String id, @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);
        return trip;
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        trip.setUserId(user.getId());
        trip.setCreatedAt(new Date());
        trip.setUpdatedAt(new Date());

        Trip savedTrip = tripRepository.save(trip);

        // Update user's trip list
        user.getTripIds().add(savedTrip.getId());
        userRepository.save(user);

        return savedTrip;
    }

    @PutMapping("/{id}")
    public Trip updateTrip(@PathVariable String id, @RequestBody Trip tripDetails,
            @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        trip.setName(tripDetails.getName());
        trip.setNotes(tripDetails.getNotes());
        trip.setUpdatedAt(new Date());

        return tripRepository.save(trip);
    }

    @PutMapping("/{id}/places")
    public Trip updateTripPlaces(@PathVariable String id, @RequestBody List<Place> places,
            @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        trip.setPlaces(places);
        trip.setUpdatedAt(new Date());

        return tripRepository.save(trip);
    }

    @PutMapping("/{tripId}/places/{placeIndex}/activities")
    public Trip updatePlaceActivities(@PathVariable String tripId,
            @PathVariable int placeIndex,
            @RequestBody List<Place> activities,
            @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        if (placeIndex < 0 || placeIndex >= trip.getPlaces().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid place index");
        }

        Place place = trip.getPlaces().get(placeIndex);
        place.setActivities(activities);
        trip.setUpdatedAt(new Date());

        return tripRepository.save(trip);
    }

    @PostMapping("/{tripId}/places/{placeIndex}/activities")
    public Trip addPlaceActivity(@PathVariable String tripId,
            @PathVariable int placeIndex,
            @RequestBody Place activity,
            @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        if (placeIndex < 0 || placeIndex >= trip.getPlaces().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid place index");
        }

        Place place = trip.getPlaces().get(placeIndex);
        if (place.getActivities() == null) {
            place.setActivities(new ArrayList<>());
        }
        place.getActivities().add(activity);
        trip.setUpdatedAt(new Date());

        return tripRepository.save(trip);
    }

    @DeleteMapping("/{tripId}/places/{placeIndex}/activities/{activityIndex}")
    public Trip removePlaceActivity(@PathVariable String tripId,
            @PathVariable int placeIndex,
            @PathVariable int activityIndex,
            @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        if (placeIndex < 0 || placeIndex >= trip.getPlaces().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid place index");
        }

        Place place = trip.getPlaces().get(placeIndex);
        if (place.getActivities() == null || activityIndex < 0 || activityIndex >= place.getActivities().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid activity index");
        }

        place.getActivities().remove(activityIndex);
        trip.setUpdatedAt(new Date());

        return tripRepository.save(trip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable String id, @AuthenticationPrincipal OAuth2User principal) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        verifyTripOwnership(trip, principal);

        // Remove trip ID from user's list
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email).orElseThrow();
        user.getTripIds().remove(id);
        userRepository.save(user);

        tripRepository.delete(trip);
        return ResponseEntity.ok().build();
    }

    private void verifyTripOwnership(Trip trip, OAuth2User principal) {
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email).orElseThrow();

        if (!trip.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}

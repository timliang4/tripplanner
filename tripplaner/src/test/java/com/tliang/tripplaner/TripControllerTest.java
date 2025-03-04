package com.tliang.tripplaner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class TripControllerTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuth2User principal;

    private TripController tripController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        tripController = new TripController(tripRepository, userRepository);
    }

    @Test
    void getAllTrips_ReturnsUserTrips() {
        // Arrange
        String email = "test@example.com";
        String userId = "user123";

        User user = new User();
        user.setId(userId);
        user.setEmail(email);

        List<Trip> userTrips = new ArrayList<>();
        Trip trip1 = new Trip();
        trip1.setId("trip1");
        trip1.setUserId(userId);
        userTrips.add(trip1);

        when(principal.getAttribute("email")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(tripRepository.findByUserId(userId)).thenReturn(userTrips);

        // Act
        List<Trip> result = tripController.getAllTrips(principal);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("trip1", result.get(0).getId());
    }

    @Test
    void createTrip_Success() {
        // Arrange
        String email = "test@example.com";
        String userId = "user123";

        User user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setTripIds(new ArrayList<>());

        Trip newTrip = new Trip();
        newTrip.setName("Test Trip");

        when(principal.getAttribute("email")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(tripRepository.save(any(Trip.class))).thenReturn(newTrip);

        // Act
        Trip result = tripController.createTrip(newTrip, principal);

        // Assert
        assertNotNull(result);
        assertEquals("Test Trip", result.getName());
        verify(tripRepository).save(any(Trip.class));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deleteTrip_Success() {
        // Arrange
        String email = "test@example.com";
        String userId = "user123";
        String tripId = "trip123";

        User user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setTripIds(new ArrayList<>(List.of(tripId)));

        Trip trip = new Trip();
        trip.setId(tripId);
        trip.setUserId(userId);

        when(principal.getAttribute("email")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));

        // Act & Assert
        assertDoesNotThrow(() -> tripController.deleteTrip(tripId, principal));
        verify(tripRepository).delete(trip);
        verify(userRepository).save(user);
    }

    @Test
    void getTrip_NotFound_ThrowsException() {
        // Arrange
        String tripId = "nonexistent";
        when(tripRepository.findById(tripId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> tripController.getTrip(tripId, principal));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }
}
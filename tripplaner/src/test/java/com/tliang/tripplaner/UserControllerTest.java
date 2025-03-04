package com.tliang.tripplaner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuth2User principal;

    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController(userRepository);
    }

    @Test
    void getCurrentUser_ExistingUser_ReturnsUser() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setName("Test User");

        when(principal.getAttribute("email")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<?> response = userController.getCurrentUser(principal);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof User);
        assertEquals(email, ((User) response.getBody()).getEmail());
    }

    @Test
    void getCurrentUser_UserNotFound_ThrowsException() {
        // Arrange
        String email = "nonexistent@example.com";
        when(principal.getAttribute("email")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userController.getCurrentUser(principal));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void getCurrentUser_NullPrincipal_ReturnsUnauthorized() {
        // Act
        ResponseEntity<?> response = userController.getCurrentUser(null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }
}
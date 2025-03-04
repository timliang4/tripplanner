package com.tliang.tripplaner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigTest {

    @Mock
    private UserRepository userRepository;

    private SecurityConfig securityConfig;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        securityConfig = new SecurityConfig(userRepository);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    void successHandler_ExistingUser_UpdatesUser() throws Exception {
        // Arrange
        String email = "test@example.com";
        String name = "Test User";
        String pictureUrl = "http://example.com/picture.jpg";

        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", email);
        attributes.put("name", name);
        attributes.put("picture", pictureUrl);

        OAuth2User oauth2User = new DefaultOAuth2User(
                new ArrayList<>(),
                attributes,
                "email");

        OAuth2AuthenticationToken authentication = mock(OAuth2AuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(oauth2User);

        User existingUser = new User();
        existingUser.setEmail(email);
        existingUser.setName("Old Name");
        existingUser.setPictureUrl("old-picture.jpg");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        securityConfig.successHandler(request, response, authentication);

        // Assert
        verify(userRepository).findByEmail(email);
        verify(userRepository).save(any(User.class));
        assertEquals("http://localhost:5173/", response.getRedirectedUrl());
    }

    @Test
    void successHandler_NewUser_CreatesUser() throws Exception {
        // Arrange
        String email = "new@example.com";
        String name = "New User";
        String pictureUrl = "http://example.com/new-picture.jpg";

        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", email);
        attributes.put("name", name);
        attributes.put("picture", pictureUrl);

        OAuth2User oauth2User = new DefaultOAuth2User(
                new ArrayList<>(),
                attributes,
                "email");

        OAuth2AuthenticationToken authentication = mock(OAuth2AuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(oauth2User);

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setPictureUrl(pictureUrl);
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        // Act
        securityConfig.successHandler(request, response, authentication);

        // Assert
        verify(userRepository).findByEmail(email);
        verify(userRepository).save(any(User.class));
        assertEquals("http://localhost:5173/", response.getRedirectedUrl());
    }
}
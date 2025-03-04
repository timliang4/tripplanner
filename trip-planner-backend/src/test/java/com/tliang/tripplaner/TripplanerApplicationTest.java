package com.tliang.tripplaner;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TripplanerApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        assertNotNull(applicationContext);
    }

    @Test
    void mainComponents_ArePresent() {
        // Verify that all main components are present in the application context
        assertTrue(applicationContext.containsBean("tripController"));
        assertTrue(applicationContext.containsBean("userController"));
        assertTrue(applicationContext.containsBean("securityFilterChain"));
    }

    @Test
    void repositories_ArePresent() {
        // Verify that repositories are present
        assertTrue(applicationContext.containsBean("tripRepository"));
        assertTrue(applicationContext.containsBean("userRepository"));
    }

    @Test
    void configurations_ArePresent() {
        // Verify that configuration beans are present
        assertTrue(applicationContext.containsBean("webConfig"));
        assertTrue(applicationContext.containsBean("securityConfig"));
    }
}
package com.tliang.tripplaner;

import lombok.Data;
import java.util.List;

@Data
public class Place {
    private String placeId; // Google Place ID
    private String name;
    private String address;
    private double lat;
    private double lng;
    private String notes;
    private List<Place> activities; // List of activities/places within this place
}

package com.tliang.tripplaner;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Document(collection = "trips")
@Data
public class Trip {
    @Id
    private String id;
    private String userId;
    private String name;
    private String notes;
    private List<Place> places;
    private Date createdAt;
    private Date updatedAt;
}

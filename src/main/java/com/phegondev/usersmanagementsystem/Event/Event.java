package com.phegondev.usersmanagementsystem.Event;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String location;
    private LocalDateTime dateTime;
    private String link;
    private boolean remindMe;

    // Add user ID field
    private Integer userId;
}

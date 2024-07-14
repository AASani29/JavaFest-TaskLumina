package com.phegondev.usersmanagementsystem.task;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private String category;

    // Getters and Setters

}

enum Priority {
    HIGH, MEDIUM, LOW
}
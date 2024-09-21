package com.TaskLumina.taskmanagementsystem.task;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Category category;

    // Add user ID field
    private Integer userId;

    private boolean completed;

    // Getters and Setters
}

enum Priority {
    HIGH, MEDIUM, LOW
}

enum Category {
    EDUCATION, FOOD, HEALTH, WORK, ENTERTAINMENT, HOUSEHOLD, TRAVEL, OTHERS
}

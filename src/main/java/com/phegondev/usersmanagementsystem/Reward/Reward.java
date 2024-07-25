package com.phegondev.usersmanagementsystem.Reward;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "rewards")
@Data
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer userId;
    private LocalDate date;
    private String badge; // e.g., "Daily Achiever"
}

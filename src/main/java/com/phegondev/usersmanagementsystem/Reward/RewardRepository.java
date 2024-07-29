package com.phegondev.usersmanagementsystem.Reward;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByUserId(Integer userId);
    List<Reward> findByUserIdAndBadge(Integer userId, String badge);
    List<Reward> findByUserIdAndBadgeAndDate(Integer userId, String badge, LocalDate date);
    List<Reward> findByUserIdAndNotified(Integer userId, boolean notified); // New method
}

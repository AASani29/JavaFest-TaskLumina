package com.phegondev.usersmanagementsystem.Event;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserId(Integer userId);

    Optional<Event> findByIdAndUserId(Long id, Integer userId);

    void deleteByIdAndUserId(Long id, Integer userId);
    List<Event> findAllByRemindMeTrueAndReminderSentFalseAndDateTimeBetween(LocalDateTime start, LocalDateTime end);
}

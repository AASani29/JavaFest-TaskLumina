package com.TaskLumina.taskmanagementsystem.task;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Integer userId);

    Optional<Task> findByIdAndUserId(Long id, Integer userId);


    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.dateTime BETWEEN :start AND :end")
    List<Task> findByUserIdAndDateTimeBetween(@Param("userId") Integer userId,
                                              @Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);// Optional to handle non-existent tasks

    void deleteByIdAndUserId(Long id, Integer userId);
}
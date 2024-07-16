package com.phegondev.usersmanagementsystem.task;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Integer userId);

    Optional<Task> findByIdAndUserId(Long id, Integer userId); // Optional to handle non-existent tasks

    void deleteByIdAndUserId(Long id, Integer userId);
}


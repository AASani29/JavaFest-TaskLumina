package com.phegondev.usersmanagementsystem.task;

import com.phegondev.usersmanagementsystem.Reward.Reward;
import com.phegondev.usersmanagementsystem.Reward.RewardRepository;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private RewardRepository rewardRepository;

    @Transactional
    public ResponseEntity<String> addTask(Task task) {
        taskRepository.save(task);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    public List<Task> getUserTasks(Integer userId) {
        return taskRepository.findByUserId(userId);
    }

    @Transactional
    public ResponseEntity<String> updateTask(Long id, Task updatedTask, Integer userId) {
        Optional<Task> taskOptional = taskRepository.findByIdAndUserId(id, userId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setName(updatedTask.getName());
            task.setDescription(updatedTask.getDescription());
            task.setDateTime(updatedTask.getDateTime());
            task.setPriority(updatedTask.getPriority());
            task.setCategory(updatedTask.getCategory());
            taskRepository.save(task);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public ResponseEntity<String> deleteTask(Long id, Integer userId) {
        Optional<Task> taskOptional = taskRepository.findByIdAndUserId(id, userId);
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(id);
            return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }
    @Transactional
    public ResponseEntity<String> completeTask(Long id, Integer userId) {
        Optional<Task> taskOptional = taskRepository.findByIdAndUserId(id, userId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setCompleted(true);
            taskRepository.save(task);

            // Check if all tasks for today are completed
            LocalDate today = LocalDate.now();
            List<Task> todayTasks = taskRepository.findByUserIdAndDateTimeBetween(
                    userId, today.atStartOfDay(), today.plusDays(1).atStartOfDay());

            // Check if user has already earned the badge
            List<Reward> existingRewards = rewardRepository.findByUserIdAndBadgeAndDate(userId, "Daily Achiever", today);
            if (existingRewards.isEmpty()) {
                boolean allCompleted = todayTasks.stream().allMatch(Task::isCompleted);
                long completedTasksCount = todayTasks.stream().filter(Task::isCompleted).count();

                if (allCompleted && completedTasksCount >= 5) {
                    Reward reward = new Reward();
                    reward.setUserId(userId);
                    reward.setDate(today);
                    reward.setBadge("Daily Achiever");
                    rewardRepository.save(reward);
                }
            }

            return new ResponseEntity<>("Task completed successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }

    public List<Reward> getAchievements(Integer userId) {
        return rewardRepository.findByUserIdAndBadge(userId, "Daily Achiever");
    }


}
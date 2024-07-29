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

            // Check and award "Rookie Starter" badge if first task is completed
            long completedTasksCount = todayTasks.stream().filter(Task::isCompleted).count();
            if (completedTasksCount == 1) {
                Reward rookieStarterReward = new Reward();
                rookieStarterReward.setUserId(userId);
                rookieStarterReward.setDate(today);
                rookieStarterReward.setBadge("Rookie Starter");
                rookieStarterReward.setNotified(false); // Set notified to false
                rewardRepository.save(rookieStarterReward);
            }

            // Check and award "Daily Achiever" badge if 5 tasks are completed
            if (completedTasksCount == 5) {
                Reward dailyAchieverReward = new Reward();
                dailyAchieverReward.setUserId(userId);
                dailyAchieverReward.setDate(today);
                dailyAchieverReward.setBadge("Daily Achiever");
                dailyAchieverReward.setNotified(false); // Set notified to false
                rewardRepository.save(dailyAchieverReward);
            }

            return new ResponseEntity<>("Task completed successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }

    public List<Reward> getAchievements(Integer userId) {
        return rewardRepository.findByUserId(userId);
    }

    public Progress getTaskProgress(Integer userId) {
        LocalDate today = LocalDate.now();
        List<Task> todayTasks = taskRepository.findByUserIdAndDateTimeBetween(
                userId, today.atStartOfDay(), today.plusDays(1).atStartOfDay());
        long completedTasksCount = todayTasks.stream().filter(Task::isCompleted).count();

        Progress progress = new Progress();
        progress.setTotalTasks(todayTasks.size());
        progress.setCompletedTasks(completedTasksCount);

        return progress;
    }
}

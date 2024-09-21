package com.TaskLumina.taskmanagementsystem.task;

import com.TaskLumina.taskmanagementsystem.Reward.Reward;
import com.TaskLumina.taskmanagementsystem.Reward.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
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

            // Check and award "Weekly Warrior" badge
            boolean weeklyWarrior = true;
            for (int i = 0; i < 7; i++) {
                LocalDate date = today.minusDays(i);
                List<Task> dayTasks = taskRepository.findByUserIdAndDateTimeBetween(
                        userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
                if (dayTasks.isEmpty() || dayTasks.stream().anyMatch(daytask -> !daytask.isCompleted())) {
                    weeklyWarrior = false;
                    break;
                }
            }
            if (weeklyWarrior) {
                Reward weeklyWarriorReward = new Reward();
                weeklyWarriorReward.setUserId(userId);
                weeklyWarriorReward.setDate(today);
                weeklyWarriorReward.setBadge("Weekly Warrior");
                weeklyWarriorReward.setNotified(false);
                rewardRepository.save(weeklyWarriorReward);
            }

            // Check and award "Monthly Master" badge
            boolean monthlyMaster = true;
            for (int i = 0; i < 30; i++) {
                LocalDate date = today.minusDays(i);
                List<Task> dayTasks = taskRepository.findByUserIdAndDateTimeBetween(
                        userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
                if (dayTasks.isEmpty() || dayTasks.stream().anyMatch(daytask -> !daytask.isCompleted())) {
                    monthlyMaster = false;
                    break;
                }
            }
            if (monthlyMaster) {
                Reward monthlyMasterReward = new Reward();
                monthlyMasterReward.setUserId(userId);
                monthlyMasterReward.setDate(today);
                monthlyMasterReward.setBadge("Monthly Master");
                monthlyMasterReward.setNotified(false);
                rewardRepository.save(monthlyMasterReward);
            }

            boolean consistentPerformer = true;
            for (int i = 0; i < 15; i++) {
                LocalDate date = today.minusDays(i);
                List<Task> dayTasks = taskRepository.findByUserIdAndDateTimeBetween(
                        userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
                if (dayTasks.isEmpty() || dayTasks.stream().anyMatch(daytask -> !daytask.isCompleted())) {
                    consistentPerformer = false;
                    break;
                }
            }
            if (consistentPerformer) {
                Reward consistentPerformerReward = new Reward();
                consistentPerformerReward.setUserId(userId);
                consistentPerformerReward.setDate(today);
                consistentPerformerReward.setBadge("Consistent Performer");
                consistentPerformerReward.setNotified(false);
                rewardRepository.save(consistentPerformerReward);
            }

            // Check and award "Task Marathoner" badge
            if (completedTasksCount == 10) {
                Reward taskMarathonerReward = new Reward();
                taskMarathonerReward.setUserId(userId);
                taskMarathonerReward.setDate(today);
                taskMarathonerReward.setBadge("Task Marathoner");
                taskMarathonerReward.setNotified(false);
                rewardRepository.save(taskMarathonerReward);
            }

            // Check and award "Weekend Warrior" badge
            DayOfWeek day = today.getDayOfWeek();
            if (day == DayOfWeek.SUNDAY || day == DayOfWeek.SATURDAY) {
                boolean weekendWarrior = true;
                for (DayOfWeek d : new DayOfWeek[]{DayOfWeek.SATURDAY, DayOfWeek.SUNDAY}) {
                    LocalDate date = today.with(TemporalAdjusters.previousOrSame(d));
                    List<Task> weekendTasks = taskRepository.findByUserIdAndDateTimeBetween(
                            userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
                    if (weekendTasks.isEmpty() || weekendTasks.stream().anyMatch(daytask -> !daytask.isCompleted())) {
                        weekendWarrior = false;
                        break;
                    }
                }
                if (weekendWarrior) {
                    Reward weekendWarriorReward = new Reward();
                    weekendWarriorReward.setUserId(userId);
                    weekendWarriorReward.setDate(today);
                    weekendWarriorReward.setBadge("Weekend Warrior");
                    weekendWarriorReward.setNotified(false);
                    rewardRepository.save(weekendWarriorReward);
                }
            }

            // Check and award "Early Bird" badge
            if (task.getDateTime().toLocalTime().isBefore(LocalTime.of(9, 0)) && completedTasksCount == 1) {
                Reward earlyBirdReward = new Reward();
                earlyBirdReward.setUserId(userId);
                earlyBirdReward.setDate(today);
                earlyBirdReward.setBadge("Early Bird");
                earlyBirdReward.setNotified(false);
                rewardRepository.save(earlyBirdReward);
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

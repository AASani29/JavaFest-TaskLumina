package com.phegondev.usersmanagementsystem.MakeMeARoutine;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class RoutineService {

    // Fixed time slots for known tasks
    private final Map<String, String> fixedTimeSlots = new HashMap<>() {{
        put("breakfast", "07:00-09:00");
        put("lunch", "12:00-14:00");
        put("dinner", "19:00-21:00");
        put("morning exercise", "06:00-08:00");
        put("evening walk", "17:30-19:30");
        put("sleep", "21:30-06:30");
        put("afternoon nap", "14:00-16:00");
        put("evening bath/relaxation", "19:00-20:00");
        put("lunch break", "12:00-14:00");
        put("morning coffee/tea", "07:00-07:30");
        put("check emails/messages", "08:30-09:00");
        put("morning news/reading", "07:30-08:00");
        put("morning meeting (work/school)", "09:00-10:00");
        put("morning snack", "10:00-10:30");
        put("watering plants (morning)", "06:30-07:00");
        put("watering plants (evening)", "18:30-19:00");
        put("post-lunch walk", "13:00-13:30");
        put("prepare breakfast", "06:30-07:00");
        put("nightly skincare routine", "21:30-22:00");
    }};

    public RoutineResponse generateRoutine(RoutineRequest request) {
        List<Task> tasks = request.getTasks();
        String[] timeRange = request.getTimeRange().split("-");
        LocalTime userStartTime = LocalTime.parse(timeRange[0]);
        LocalTime userEndTime = LocalTime.parse(timeRange[1]);

        List<ScheduledTask> scheduledTasks = new ArrayList<>();
        List<FailedTask> failedTasks = new ArrayList<>();

        // First, schedule tasks with specific starting times
        for (Task task : tasks) {
            if (task.getFixedStartTime() != null) {
                LocalTime fixedStartTime = LocalTime.parse(task.getFixedStartTime());
                if (canFitTask(fixedStartTime, fixedStartTime.plusMinutes(task.getDuration()), scheduledTasks)) {
                    scheduledTasks.add(new ScheduledTask(task.getName(), fixedStartTime, fixedStartTime.plusMinutes(task.getDuration())));
                } else {
                    failedTasks.add(new FailedTask(task.getName(), "Time conflict with other tasks."));
                }
            }
        }

        // Next, schedule tasks with fixed time ranges based on known slots
        for (Task task : tasks) {
            if (task.getFixedStartTime() == null && fixedTimeSlots.containsKey(task.getName().toLowerCase())) {
                String[] fixedTimeRange = fixedTimeSlots.get(task.getName().toLowerCase()).split("-");
                LocalTime fixedStartTime = LocalTime.parse(fixedTimeRange[0]);
                LocalTime fixedEndTime = LocalTime.parse(fixedTimeRange[1]);

                // Try to fit within the range
                LocalTime actualStartTime = fixedStartTime.isAfter(userStartTime) ? fixedStartTime : userStartTime;
                if (actualStartTime.plusMinutes(task.getDuration()).isAfter(fixedEndTime)) {
                    actualStartTime = fixedEndTime.minusMinutes(task.getDuration());
                }

                if (canFitTask(actualStartTime, actualStartTime.plusMinutes(task.getDuration()), scheduledTasks)) {
                    scheduledTasks.add(new ScheduledTask(task.getName(), actualStartTime, actualStartTime.plusMinutes(task.getDuration())));
                } else {
                    LocalTime earliestPossibleStart = findNextAvailableSlot(task.getDuration(), scheduledTasks, fixedEndTime, userEndTime);
                    if (earliestPossibleStart != null) {
                        scheduledTasks.add(new ScheduledTask(task.getName(), earliestPossibleStart, earliestPossibleStart.plusMinutes(task.getDuration())));
                    } else {
                        failedTasks.add(new FailedTask(task.getName(), "Cannot fit into the available time range."));
                    }
                }
            }
        }

        // Finally, schedule remaining tasks based on priority and available time slots
        tasks.sort(Comparator.comparingInt(Task::getPriority).reversed());

        for (Task task : tasks) {
            if (task.getFixedStartTime() == null && !fixedTimeSlots.containsKey(task.getName().toLowerCase())) {
                LocalTime nextAvailableStart = findNextAvailableSlot(task.getDuration(), scheduledTasks, userStartTime, userEndTime);
                if (nextAvailableStart != null && canFitTask(nextAvailableStart, nextAvailableStart.plusMinutes(task.getDuration()), scheduledTasks)) {
                    scheduledTasks.add(new ScheduledTask(task.getName(), nextAvailableStart, nextAvailableStart.plusMinutes(task.getDuration())));
                } else {
                    failedTasks.add(new FailedTask(task.getName(), "Time conflict with other tasks or insufficient time available."));
                }
            }
        }

        return new RoutineResponse(scheduledTasks, failedTasks);
    }

    // Ensure tasks don't overlap
    private boolean canFitTask(LocalTime startTime, LocalTime endTime, List<ScheduledTask> scheduledTasks) {
        for (ScheduledTask scheduledTask : scheduledTasks) {
            if (startTime.isBefore(scheduledTask.getEndTime()) && endTime.isAfter(scheduledTask.getStartTime())) {
                return false; // Conflict with an existing task
            }
        }
        return true;
    }

    // Find the next available slot for a task
    private LocalTime findNextAvailableSlot(int duration, List<ScheduledTask> scheduledTasks, LocalTime startTime, LocalTime endTime) {
        // Start by checking the time before the first task
        if (scheduledTasks.isEmpty() || startTime.plusMinutes(duration).isBefore(scheduledTasks.get(0).getStartTime())) {
            return startTime;
        }

        // Check all gaps between scheduled tasks
        for (int i = 0; i < scheduledTasks.size() - 1; i++) {
            ScheduledTask currentTask = scheduledTasks.get(i);
            ScheduledTask nextTask = scheduledTasks.get(i + 1);

            LocalTime gapStart = currentTask.getEndTime();
            LocalTime gapEnd = nextTask.getStartTime();

            if (gapStart.plusMinutes(duration).isBefore(gapEnd) || gapStart.plusMinutes(duration).equals(gapEnd)) {
                return gapStart;
            }
        }

        // Check time after the last task
        ScheduledTask lastTask = scheduledTasks.get(scheduledTasks.size() - 1);
        if (lastTask.getEndTime().plusMinutes(duration).isBefore(endTime) || lastTask.getEndTime().plusMinutes(duration).equals(endTime)) {
            return lastTask.getEndTime();
        }

        return null; // No available slot found
    }

}
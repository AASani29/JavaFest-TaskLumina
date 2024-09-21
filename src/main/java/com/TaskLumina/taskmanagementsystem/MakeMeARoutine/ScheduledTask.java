package com.TaskLumina.taskmanagementsystem.MakeMeARoutine;


import java.time.LocalTime;

public class ScheduledTask {
    private String taskName;
    private LocalTime startTime;
    private LocalTime endTime;

    // Constructor
    public ScheduledTask(String taskName, LocalTime startTime, LocalTime endTime) {
        this.taskName = taskName;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}

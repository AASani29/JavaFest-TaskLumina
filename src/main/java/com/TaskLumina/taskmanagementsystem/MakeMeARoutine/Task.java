package com.TaskLumina.taskmanagementsystem.MakeMeARoutine;

public class Task {
    private String name;
    private int duration; // Duration in minutes
    private int priority; // Optional, can be 0 if not provided
    private String fixedStartTime; // Optional, can be null if not specified
    private String fixedTimeRange; // Example: "07:00-09:00" for Breakfast

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public String getFixedStartTime() {
        return fixedStartTime;
    }

    public void setFixedStartTime(String fixedStartTime) {
        this.fixedStartTime = fixedStartTime;
    }

    public String getFixedTimeRange() {
        return fixedTimeRange;
    }

    public void setFixedTimeRange(String fixedTimeRange) {
        this.fixedTimeRange = fixedTimeRange;
    }
}

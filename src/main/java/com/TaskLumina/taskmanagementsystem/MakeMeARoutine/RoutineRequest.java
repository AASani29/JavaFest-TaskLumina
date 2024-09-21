package com.TaskLumina.taskmanagementsystem.MakeMeARoutine;


import java.util.List;

public class RoutineRequest {
    private String timeRange;
    private List<Task> tasks;

    // Getters and Setters
    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}

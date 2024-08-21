package com.phegondev.usersmanagementsystem.MakeMeARoutine;

import java.util.List;

public class RoutineResponse {
    private List<ScheduledTask> scheduledTasks;
    private List<FailedTask> failedTasks;  // New field for failed tasks

    public RoutineResponse(List<ScheduledTask> scheduledTasks, List<FailedTask> failedTasks) {
        this.scheduledTasks = scheduledTasks;
        this.failedTasks = failedTasks;
    }

    public List<ScheduledTask> getScheduledTasks() {
        return scheduledTasks;
    }

    public void setScheduledTasks(List<ScheduledTask> scheduledTasks) {
        this.scheduledTasks = scheduledTasks;
    }

    public List<FailedTask> getFailedTasks() {
        return failedTasks;
    }

    public void setFailedTasks(List<FailedTask> failedTasks) {
        this.failedTasks = failedTasks;
    }
}

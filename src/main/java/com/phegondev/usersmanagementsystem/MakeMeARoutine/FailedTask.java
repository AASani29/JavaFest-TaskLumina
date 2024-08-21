package com.phegondev.usersmanagementsystem.MakeMeARoutine;

public class FailedTask {
    private String taskName;
    private String reason;

    public FailedTask(String taskName, String reason) {
        this.taskName = taskName;
        this.reason = reason;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

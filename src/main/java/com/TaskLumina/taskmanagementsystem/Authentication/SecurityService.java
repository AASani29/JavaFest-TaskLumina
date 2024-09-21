package com.TaskLumina.taskmanagementsystem.Authentication;

import org.springframework.security.core.Authentication;

public interface SecurityService {
    boolean canDeleteTask(Long taskId, Authentication authentication);
}

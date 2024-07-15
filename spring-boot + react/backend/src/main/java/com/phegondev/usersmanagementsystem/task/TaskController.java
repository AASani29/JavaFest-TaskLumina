package com.phegondev.usersmanagementsystem.task;

import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.boot.autoconfigure.pulsar.PulsarProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adminuser/task")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/add")
    public ResponseEntity<String> addTask(@RequestBody Task task, Authentication authentication) {
        // Get the logged-in user's ID from Authentication
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();

        // Set the user ID in the task
        task.setUserId(userId);

        return taskService.addTask(task);
    }
}

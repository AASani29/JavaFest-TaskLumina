package com.phegondev.usersmanagementsystem.task;

import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminuser/task")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class TaskController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private SecurityService securityService;



    @PostMapping("/add")
    public ResponseEntity<String> addTask(@RequestBody Task task, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        task.setUserId(userId);
        return taskService.addTask(task);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getUserTasks(Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        List<Task> tasks = taskService.getUserTasks(userId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody Task updatedTask, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        return taskService.updateTask(id, updatedTask, userId);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        return taskService.deleteTask(id, userId);
    }
}
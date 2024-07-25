package com.phegondev.usersmanagementsystem.task;


import com.phegondev.usersmanagementsystem.Reward.Reward;
import com.phegondev.usersmanagementsystem.dto.ReqRes;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.SecurityService;
import com.phegondev.usersmanagementsystem.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminuser/task")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class TaskController {
    @Autowired
    private TaskService taskService;


    @Autowired
    private UsersManagementService usersManagementService;




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

    @GetMapping("/profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PutMapping("/complete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> completeTask(@PathVariable Long id, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        return taskService.completeTask(id, userId);
    }
    @GetMapping("/achievements")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Reward>> getAchievements(Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        List<Reward> achievements = taskService.getAchievements(userId);
        return new ResponseEntity<>(achievements, HttpStatus.OK);
    }




}
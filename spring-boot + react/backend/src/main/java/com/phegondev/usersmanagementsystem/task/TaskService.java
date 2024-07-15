package com.phegondev.usersmanagementsystem.task;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public ResponseEntity<String> addTask(Task task) {
        taskRepository.save(task);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }
}

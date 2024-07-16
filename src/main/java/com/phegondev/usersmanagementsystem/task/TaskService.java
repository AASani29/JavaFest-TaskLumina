package com.phegondev.usersmanagementsystem.task;

import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public ResponseEntity<String> addTask(Task task) {
        taskRepository.save(task);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    public List<Task> getUserTasks(Integer userId) {
        return taskRepository.findByUserId(userId);
    }

    @Transactional
    public ResponseEntity<String> updateTask(Long id, Task updatedTask, Integer userId) {
        Optional<Task> taskOptional = taskRepository.findByIdAndUserId(id, userId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setName(updatedTask.getName());
            task.setDescription(updatedTask.getDescription());
            task.setDateTime(updatedTask.getDateTime());
            task.setPriority(updatedTask.getPriority());
            task.setCategory(updatedTask.getCategory());
            taskRepository.save(task);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public ResponseEntity<String> deleteTask(Long id, Integer userId) {
        Optional<Task> taskOptional = taskRepository.findByIdAndUserId(id, userId);
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(id);
            return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
        }
    }
}
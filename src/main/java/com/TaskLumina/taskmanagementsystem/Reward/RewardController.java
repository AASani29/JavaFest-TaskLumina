package com.TaskLumina.taskmanagementsystem.Reward;

import com.TaskLumina.taskmanagementsystem.Notifications.Notification;
import com.TaskLumina.taskmanagementsystem.Notifications.NotificationRepository;
import com.TaskLumina.taskmanagementsystem.UserServiceAPI.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminuser/task/reward")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class RewardController {

    @Autowired
    private RewardRepository rewardRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/name")
    public ResponseEntity<List<Reward>> getMyRewards(Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        List<Reward> rewards = rewardRepository.findByUserIdAndNotified(userId, false);
        return new ResponseEntity<>(rewards, HttpStatus.OK);
    }

    @PutMapping("/{rewardId}/notified")
    public ResponseEntity<String> markRewardAsNotified(@PathVariable Long rewardId) {
        Reward reward = rewardRepository.findById(rewardId).orElse(null);
        if (reward == null) {
            return new ResponseEntity<>("Reward not found", HttpStatus.NOT_FOUND);
        }
        if (!reward.isNotified()) {
            reward.setNotified(true);
            rewardRepository.save(reward);

            // Save the notification
            Notification notification = new Notification();
            notification.setUserId(reward.getUserId());
            notification.setMessage("You have earned the " + reward.getBadge() + " reward!");
            notificationRepository.save(notification);
        }
        return new ResponseEntity<>("Reward marked as notified", HttpStatus.OK);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }



}

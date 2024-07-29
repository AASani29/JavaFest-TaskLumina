package com.phegondev.usersmanagementsystem.Reward;

import com.phegondev.usersmanagementsystem.entity.OurUsers;
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
        reward.setNotified(true);
        rewardRepository.save(reward);
        return new ResponseEntity<>("Reward marked as notified", HttpStatus.OK);
    }
}

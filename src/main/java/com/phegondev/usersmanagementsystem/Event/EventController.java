package com.phegondev.usersmanagementsystem.Event;

import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminuser/event")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/add")
    public ResponseEntity<String> addEvent(@RequestBody Event event, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        event.setUserId(userId);
        return eventService.addEvent(event);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getUserEvents(Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        List<Event> events = eventService.getUserEvents(userId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }


}

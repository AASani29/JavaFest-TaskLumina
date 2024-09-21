package com.TaskLumina.taskmanagementsystem.Event;

import com.TaskLumina.taskmanagementsystem.UserServiceAPI.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        return eventService.updateEvent(id, updatedEvent, userId);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id, Authentication authentication) {
        Integer userId = ((OurUsers) authentication.getPrincipal()).getId();
        return eventService.deleteEvent(id, userId);
    }


}

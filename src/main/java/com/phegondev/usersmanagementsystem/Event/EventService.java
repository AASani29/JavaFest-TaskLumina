package com.phegondev.usersmanagementsystem.Event;

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
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Transactional
    public ResponseEntity<String> addEvent(Event event) {
        eventRepository.save(event);
        return new ResponseEntity<>("Event added successfully", HttpStatus.CREATED);
    }

    public List<Event> getUserEvents(Integer userId) {
        return eventRepository.findByUserId(userId);
    }

}
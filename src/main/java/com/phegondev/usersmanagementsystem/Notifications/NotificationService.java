package com.phegondev.usersmanagementsystem.Notifications;



import com.phegondev.usersmanagementsystem.Event.Event;
import com.phegondev.usersmanagementsystem.Event.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EventRepository eventRepository;

    public void sendReminder(Event event) {
        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setMessage("Reminder: Your event '" + event.getTitle() + "' is scheduled for tomorrow at " + event.getDateTime());

        // Save the notification to the database
        Notification savedNotification = notificationRepository.save(notification);

        System.out.println("Notification saved with ID: " + savedNotification.getId() + " for event: " + event.getTitle());
    }


}

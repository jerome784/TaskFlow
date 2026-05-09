package com.taskflow.service;

import com.taskflow.dto.response.NotificationResponse;
import com.taskflow.entity.Notification;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Transactional
    public void notifyUser(User recipient, String message) {
        if (recipient == null) return;
        Notification notification = Notification.builder()
            .recipient(recipient)
            .message(message)
            .isRead(false)
            .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications() {
        User current = userService.getCurrentUserEntity();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(current.getId())
            .stream()
            .map(NotificationResponse::from)
            .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        User current = userService.getCurrentUserEntity();
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getRecipient().getId().equals(current.getId())) {
            throw new AccessDeniedException("You can only access your own notifications.");
        }

        notification.setRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead() {
        User current = userService.getCurrentUserEntity();
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(current.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}

package com.taskflow.dto.response;

import com.taskflow.entity.Notification;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        if (notification == null) return null;
        return NotificationResponse.builder()
            .id(notification.getId())
            .message(notification.getMessage())
            .read(notification.isRead())
            .createdAt(notification.getCreatedAt())
            .build();
    }
}

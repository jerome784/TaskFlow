package com.taskflow.dto.response;

import com.taskflow.entity.ActivityLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogResponse {
    private Long id;
    private String action;
    private String details;
    private UserResponse actor;
    private Long taskId;
    private Long projectId;
    private LocalDateTime createdAt;

    public static ActivityLogResponse from(ActivityLog log) {
        return ActivityLogResponse.builder()
            .id(log.getId())
            .action(log.getAction())
            .details(log.getDetails())
            .actor(UserResponse.from(log.getActor()))
            .taskId(log.getTaskId())
            .projectId(log.getProjectId())
            .createdAt(log.getCreatedAt())
            .build();
    }
}

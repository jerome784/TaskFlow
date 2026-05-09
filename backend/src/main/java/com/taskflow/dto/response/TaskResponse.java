package com.taskflow.dto.response;

import com.taskflow.entity.Task;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private boolean overdue;
    private LocalDateTime completedAt;
    private UserResponse assignee;
    private UserResponse createdBy;
    private ProjectResponse project;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse from(Task task) {
        if (task == null) {
            return null;
        }

        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .dueDate(task.getDueDate())
            .overdue(task.isOverdue())
            .completedAt(task.getCompletedAt())
            .assignee(UserResponse.from(task.getAssignee()))
            .createdBy(UserResponse.from(task.getCreatedBy()))
            .project(ProjectResponse.from(task.getProject()))
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
}

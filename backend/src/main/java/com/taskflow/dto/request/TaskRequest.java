package com.taskflow.dto.request;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    private TaskStatus status = TaskStatus.TODO;

    private Priority priority = Priority.MEDIUM;

    private LocalDate dueDate;

    private Long assigneeId;

    private Long projectId;
}

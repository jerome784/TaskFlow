package com.taskflow.dto.request;

import com.taskflow.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull
    private TaskStatus status;
}

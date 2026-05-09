package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HabitRequest {
    @NotBlank(message = "Habit name cannot be blank")
    private String name;
}

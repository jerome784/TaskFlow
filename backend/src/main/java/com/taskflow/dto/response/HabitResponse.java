package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HabitResponse {
    private Long id;
    private String name;
    private int streak;
    private boolean completedToday;
}

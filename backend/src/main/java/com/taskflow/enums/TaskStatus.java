package com.taskflow.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    TODO("To Do"),
    IN_PROGRESS("In Progress"),
    DONE("Done");

    private final String label;

    TaskStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static TaskStatus from(String value) {
        if (value == null || value.isBlank()) {
            return TODO;
        }

        String normalized = value.trim().replace("-", "_").replace(" ", "_").toUpperCase();
        if ("TO_DO".equals(normalized)) {
            return TODO;
        }

        return TaskStatus.valueOf(normalized);
    }
}

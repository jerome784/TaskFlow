package com.taskflow.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    CRITICAL("Critical");

    private final String label;

    Priority(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static Priority from(String value) {
        if (value == null || value.isBlank()) {
            return MEDIUM;
        }

        String normalized = value.trim().replace("-", "_").replace(" ", "_").toUpperCase();
        if ("URGENT".equals(normalized)) {
            return CRITICAL;
        }

        return Priority.valueOf(normalized);
    }
}

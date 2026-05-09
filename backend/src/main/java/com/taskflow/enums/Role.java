package com.taskflow.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    ADMIN,
    MANAGER,
    DEVELOPER;

    @JsonValue
    public String getValue() {
        return name();
    }

    @JsonCreator
    public static Role from(String value) {
        if (value == null || value.isBlank()) {
            return DEVELOPER;
        }

        String normalized = value.trim().replace("-", "_").replace(" ", "_").toUpperCase();
        if ("USER".equals(normalized) || "MEMBER".equals(normalized)) {
            return DEVELOPER;
        }

        return Role.valueOf(normalized);
    }
}

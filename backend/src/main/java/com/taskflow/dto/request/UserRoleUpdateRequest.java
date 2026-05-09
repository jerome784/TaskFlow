package com.taskflow.dto.request;

import com.taskflow.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRoleUpdateRequest {
    @NotNull
    private Role role;
}

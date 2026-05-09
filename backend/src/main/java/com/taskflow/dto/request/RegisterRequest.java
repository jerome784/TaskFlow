package com.taskflow.dto.request;

import com.taskflow.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(max = 120)
    private String name;

    @Email
    @NotBlank
    @Size(max = 160)
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    private Role role = Role.DEVELOPER;
}

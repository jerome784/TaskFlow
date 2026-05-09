package com.taskflow.controller;

import com.taskflow.dto.request.UserRoleUpdateRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<List<UserResponse>> listUsers() {
        return ApiResponse.success("Users loaded.", userService.listUsers());
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> currentUser() {
        return ApiResponse.success("User profile loaded.", userService.currentUser());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUser(@PathVariable Long id) {
        return ApiResponse.success("User loaded.", userService.getUser(id));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> updateRole(
        @PathVariable Long id,
        @Valid @RequestBody UserRoleUpdateRequest request
    ) {
        return ApiResponse.success("User role updated.", userService.updateRole(id, request));
    }
}

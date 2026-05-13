package com.taskflow.controller;

import com.taskflow.dto.request.StatusUpdateRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ApiResponse<List<TaskResponse>> listTasks(
        @RequestParam(required = false) TaskStatus status,
        @RequestParam(required = false) Long projectId,
        @RequestParam(required = false) Priority priority,
        @RequestParam(required = false) String search
    ) {
        return ApiResponse.success("Tasks loaded.", taskService.listTasks(status, projectId, priority, search));
    }

    @GetMapping("/{id}")
    public ApiResponse<TaskResponse> getTask(@PathVariable Long id) {
        return ApiResponse.success("Task loaded.", taskService.getTask(id));
    }

    @PostMapping
    public ApiResponse<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        return ApiResponse.success("Task created.", taskService.createTask(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TaskResponse> updateTask(
        @PathVariable Long id,
        @Valid @RequestBody TaskRequest request
    ) {
        return ApiResponse.success("Task updated.", taskService.updateTask(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<TaskResponse> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest request
    ) {
        return ApiResponse.success("Task status updated.", taskService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ApiResponse.success("Task deleted.");
    }
}

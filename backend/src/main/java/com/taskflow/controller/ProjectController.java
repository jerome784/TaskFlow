package com.taskflow.controller;

import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.service.ProjectService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public ApiResponse<List<ProjectResponse>> listProjects() {
        return ApiResponse.success("Projects loaded.", projectService.listProjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjectResponse> getProject(@PathVariable Long id) {
        return ApiResponse.success("Project loaded.", projectService.getProject(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ApiResponse.success("Project created.", projectService.createProject(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<ProjectResponse> updateProject(
        @PathVariable Long id,
        @Valid @RequestBody ProjectRequest request
    ) {
        return ApiResponse.success("Project updated.", projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ApiResponse.success("Project deleted.");
    }

    @PatchMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<ProjectResponse> addMember(@PathVariable Long projectId, @PathVariable Long userId) {
        return ApiResponse.success("Project member added.", projectService.addMember(projectId, userId));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<ProjectResponse> removeMember(@PathVariable Long projectId, @PathVariable Long userId) {
        return ApiResponse.success("Project member removed.", projectService.removeMember(projectId, userId));
    }
}

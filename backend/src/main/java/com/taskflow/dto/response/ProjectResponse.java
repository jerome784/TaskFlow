package com.taskflow.dto.response;

import com.taskflow.entity.Project;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse manager;
    private List<UserResponse> teamMembers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponse from(Project project) {
        if (project == null) {
            return null;
        }

        return ProjectResponse.builder()
            .id(project.getId())
            .name(project.getName())
            .description(project.getDescription())
            .manager(UserResponse.from(project.getManager()))
            .teamMembers(project.getTeamMembers().stream().map(UserResponse::from).toList())
            .createdAt(project.getCreatedAt())
            .updatedAt(project.getUpdatedAt())
            .build();
    }
}

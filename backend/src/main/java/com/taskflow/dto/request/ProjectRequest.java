package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class ProjectRequest {
    @NotBlank
    @Size(max = 160)
    private String name;

    private String description;

    private Long managerId;

    private Set<Long> teamMemberIds;
}

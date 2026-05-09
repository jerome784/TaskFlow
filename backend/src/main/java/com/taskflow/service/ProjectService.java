package com.taskflow.service;

import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Role;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<ProjectResponse> listProjects() {
        User current = userService.getCurrentUserEntity();
        List<Project> projects = canManageAllProjects(current)
            ? projectRepository.findAll()
            : projectRepository.findByManagerIdOrTeamMembersId(current.getId(), current.getId());

        return projects.stream()
            .distinct()
            .map(ProjectResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id) {
        Project project = findById(id);
        assertCanAccessProject(project, userService.getCurrentUserEntity());
        return ProjectResponse.from(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        User current = userService.getCurrentUserEntity();
        User manager = request.getManagerId() != null ? userService.findById(request.getManagerId()) : current;
        Set<User> members = resolveMembers(request.getTeamMemberIds());
        members.add(manager);

        Project project = Project.builder()
            .name(request.getName().trim())
            .description(request.getDescription())
            .manager(manager)
            .teamMembers(members)
            .build();

        Project saved = projectRepository.save(project);
        activityLogService.record("PROJECT_CREATED", "Created project: " + saved.getName(), current, null, saved);
        return ProjectResponse.from(saved);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        User current = userService.getCurrentUserEntity();
        Project project = findById(id);
        assertCanManageProject(project, current);

        project.setName(request.getName().trim());
        project.setDescription(request.getDescription());
        if (request.getManagerId() != null) {
            project.setManager(userService.findById(request.getManagerId()));
        }
        if (request.getTeamMemberIds() != null) {
            project.setTeamMembers(resolveMembers(request.getTeamMemberIds()));
            if (project.getManager() != null) {
                project.getTeamMembers().add(project.getManager());
            }
        }

        Project saved = projectRepository.save(project);
        activityLogService.record("PROJECT_UPDATED", "Updated project: " + saved.getName(), current, null, saved);
        return ProjectResponse.from(saved);
    }

    @Transactional
    public void deleteProject(Long id) {
        User current = userService.getCurrentUserEntity();
        Project project = findById(id);
        assertCanManageProject(project, current);

        List<Task> projectTasks = taskRepository.findByProjectId(id);
        projectTasks.forEach(task -> task.setProject(null));
        taskRepository.saveAll(projectTasks);

        activityLogService.record("PROJECT_DELETED", "Deleted project: " + project.getName(), current, null, project);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectResponse addMember(Long projectId, Long userId) {
        User current = userService.getCurrentUserEntity();
        Project project = findById(projectId);
        assertCanManageProject(project, current);
        project.getTeamMembers().add(userService.findById(userId));
        Project saved = projectRepository.save(project);
        activityLogService.record("PROJECT_MEMBER_ADDED", "Added user " + userId + " to project " + project.getName(), current, null, saved);
        return ProjectResponse.from(saved);
    }

    @Transactional
    public ProjectResponse removeMember(Long projectId, Long userId) {
        User current = userService.getCurrentUserEntity();
        Project project = findById(projectId);
        assertCanManageProject(project, current);
        project.getTeamMembers().removeIf(user -> user.getId().equals(userId));
        Project saved = projectRepository.save(project);
        activityLogService.record("PROJECT_MEMBER_REMOVED", "Removed user " + userId + " from project " + project.getName(), current, null, saved);
        return ProjectResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Project findById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private Set<User> resolveMembers(Set<Long> memberIds) {
        Set<User> members = new HashSet<>();
        if (memberIds != null) {
            memberIds.forEach(id -> members.add(userService.findById(id)));
        }
        return members;
    }

    private void assertCanAccessProject(Project project, User current) {
        if (canManageAllProjects(current)) {
            return;
        }

        boolean isManager = project.getManager() != null && project.getManager().getId().equals(current.getId());
        boolean isMember = project.getTeamMembers().stream().anyMatch(user -> user.getId().equals(current.getId()));
        if (!isManager && !isMember) {
            throw new AccessDeniedException("You can only view projects you belong to.");
        }
    }

    private void assertCanManageProject(Project project, User current) {
        if (current.getRole() == Role.ADMIN) {
            return;
        }

        boolean isManager = current.getRole() == Role.MANAGER
            && project.getManager() != null
            && project.getManager().getId().equals(current.getId());
        if (!isManager) {
            throw new AccessDeniedException("Only admins or the project manager can modify this project.");
        }
    }

    private boolean canManageAllProjects(User user) {
        return user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER;
    }
}

package com.taskflow.service;

import com.taskflow.dto.request.StatusUpdateRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Role;
import com.taskflow.enums.TaskStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final ProjectService projectService;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasks(TaskStatus status, Long projectId, Priority priority, String search) {
        User current = userService.getCurrentUserEntity();
        
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Task> tasks = canManageTasks(current)
            ? taskRepository.findByFilters(status, projectId, priority, searchParam)
            : taskRepository.findByAssigneeIdAndFilters(current.getId(), status, projectId, priority, searchParam);

        return tasks.stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) {
        Task task = findById(id);
        assertCanAccessTask(task, userService.getCurrentUserEntity());
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User current = userService.getCurrentUserEntity();
        
        boolean isPersonalTask = request.getProjectId() == null && request.getAssigneeId() != null && request.getAssigneeId().equals(current.getId());
        if (!isPersonalTask) {
            assertCanManageTasks(current);
        }

        Task task = Task.builder()
            .title(request.getTitle().trim())
            .description(request.getDescription())
            .status(request.getStatus() == null ? TaskStatus.TODO : request.getStatus())
            .priority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority())
            .dueDate(request.getDueDate())
            .assignee(resolveAssignee(request.getAssigneeId()))
            .project(resolveProject(request.getProjectId()))
            .createdBy(current)
            .build();
        updateCompletedAt(task);

        Task saved = taskRepository.save(task);
        activityLogService.record("TASK_CREATED", "Created task: " + saved.getTitle(), current, saved, saved.getProject());

        if (saved.getAssignee() != null && !saved.getAssignee().getId().equals(current.getId())) {
            notificationService.notifyUser(saved.getAssignee(), "You have been assigned to a new task: " + saved.getTitle());
        }

        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        User current = userService.getCurrentUserEntity();
        Task task = findById(id);
        
        boolean isPersonalTask = task.getProject() == null && task.getAssignee() != null && task.getAssignee().getId().equals(current.getId());
        if (!isPersonalTask) {
            assertCanManageTasks(current);
        }
        
        // Prevent changing a personal task into a project task if not admin/manager
        if (isPersonalTask && request.getProjectId() != null && !canManageTasks(current)) {
            throw new AccessDeniedException("Cannot move a personal task to a project without manage permissions.");
        }
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        User oldAssignee = task.getAssignee();
        task.setAssignee(resolveAssignee(request.getAssigneeId()));
        task.setProject(resolveProject(request.getProjectId()));
        updateCompletedAt(task);

        Task saved = taskRepository.save(task);
        activityLogService.record("TASK_UPDATED", "Updated task: " + saved.getTitle(), current, saved, saved.getProject());

        if (saved.getAssignee() != null && (oldAssignee == null || !oldAssignee.getId().equals(saved.getAssignee().getId()))) {
            if (!saved.getAssignee().getId().equals(current.getId())) {
                notificationService.notifyUser(saved.getAssignee(), "You have been assigned to task: " + saved.getTitle());
            }
        }

        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse updateStatus(Long id, StatusUpdateRequest request) {
        User current = userService.getCurrentUserEntity();
        Task task = findById(id);
        assertCanAccessTask(task, current);

        task.setStatus(request.getStatus());
        updateCompletedAt(task);

        Task saved = taskRepository.save(task);
        activityLogService.record(
            "TASK_STATUS_CHANGED",
            "Changed task status to " + saved.getStatus().getLabel() + ": " + saved.getTitle(),
            current,
            saved,
            saved.getProject()
        );

        if (saved.getAssignee() != null && !saved.getAssignee().getId().equals(current.getId())) {
            notificationService.notifyUser(saved.getAssignee(), "Status of your task '" + saved.getTitle() + "' was changed to " + saved.getStatus().getLabel() + " by " + current.getName());
        } else if (!saved.getCreatedBy().getId().equals(current.getId())) {
            notificationService.notifyUser(saved.getCreatedBy(), "Status of task '" + saved.getTitle() + "' was changed to " + saved.getStatus().getLabel() + " by " + current.getName());
        }

        return TaskResponse.from(saved);
    }

    @Transactional
    public void deleteTask(Long id) {
        User current = userService.getCurrentUserEntity();
        Task task = findById(id);
        
        boolean isPersonalTask = task.getProject() == null && task.getAssignee() != null && task.getAssignee().getId().equals(current.getId());
        if (!isPersonalTask) {
            assertCanManageTasks(current);
        }
        activityLogService.record("TASK_DELETED", "Deleted task: " + task.getTitle(), current, task, task.getProject());
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public Task findById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private User resolveAssignee(Long assigneeId) {
        return assigneeId != null ? userService.findById(assigneeId) : null;
    }

    private Project resolveProject(Long projectId) {
        return projectId != null ? projectService.findById(projectId) : null;
    }

    private void updateCompletedAt(Task task) {
        if (task.getStatus() == TaskStatus.DONE && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (task.getStatus() != TaskStatus.DONE) {
            task.setCompletedAt(null);
        }
    }

    private void assertCanAccessTask(Task task, User current) {
        if (canManageTasks(current)) {
            return;
        }

        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(current.getId());
        if (!isAssignee) {
            throw new AccessDeniedException("Developers can only access assigned tasks.");
        }
    }

    private void assertCanManageTasks(User current) {
        if (!canManageTasks(current)) {
            throw new AccessDeniedException("Only admins and managers can manage tasks.");
        }
    }

    private boolean canManageTasks(User user) {
        return user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER;
    }
}

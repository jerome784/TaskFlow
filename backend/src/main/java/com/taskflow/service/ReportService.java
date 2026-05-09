package com.taskflow.service;

import com.taskflow.dto.response.ReportSummaryResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Role;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public ReportSummaryResponse summary() {
        List<Task> tasks = visibleTasks();

        Map<TaskStatus, Long> byStatus = new EnumMap<>(TaskStatus.class);
        Arrays.stream(TaskStatus.values()).forEach(status -> byStatus.put(status, 0L));
        tasks.forEach(task -> byStatus.merge(task.getStatus(), 1L, Long::sum));

        Map<Priority, Long> byPriority = new EnumMap<>(Priority.class);
        Arrays.stream(Priority.values()).forEach(priority -> byPriority.put(priority, 0L));
        tasks.forEach(task -> byPriority.merge(task.getPriority(), 1L, Long::sum));

        List<ReportSummaryResponse.UserTaskCount> byAssignee = tasks.stream()
            .filter(task -> task.getAssignee() != null)
            .collect(Collectors.groupingBy(task -> task.getAssignee().getId()))
            .values()
            .stream()
            .map(assigneeTasks -> {
                User assignee = assigneeTasks.get(0).getAssignee();
                long completed = assigneeTasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
                return ReportSummaryResponse.UserTaskCount.builder()
                    .userId(assignee.getId())
                    .name(assignee.getName())
                    .total(assigneeTasks.size())
                    .completed(completed)
                    .build();
            })
            .toList();

        return ReportSummaryResponse.builder()
            .totalTasks(tasks.size())
            .completedTasks(byStatus.get(TaskStatus.DONE))
            .overdueTasks(tasks.stream().filter(Task::isOverdue).count())
            .tasksByStatus(byStatus)
            .tasksByPriority(byPriority)
            .tasksByAssignee(byAssignee)
            .build();
    }

    @Transactional(readOnly = true)
    public String exportTasksCsv() {
        StringBuilder csv = new StringBuilder("id,title,status,priority,assignee,project,dueDate,overdue\n");
        for (Task task : visibleTasks()) {
            csv.append(task.getId()).append(',')
                .append(csvCell(task.getTitle())).append(',')
                .append(task.getStatus().name()).append(',')
                .append(task.getPriority().name()).append(',')
                .append(csvCell(task.getAssignee() != null ? task.getAssignee().getName() : "")).append(',')
                .append(csvCell(task.getProject() != null ? task.getProject().getName() : "")).append(',')
                .append(task.getDueDate() != null ? task.getDueDate() : "").append(',')
                .append(task.isOverdue())
                .append('\n');
        }
        return csv.toString();
    }

    private List<Task> visibleTasks() {
        User current = userService.getCurrentUserEntity();
        if (current.getRole() == Role.ADMIN || current.getRole() == Role.MANAGER) {
            return taskRepository.findAll();
        }
        return taskRepository.findByAssigneeId(current.getId());
    }

    private String csvCell(String value) {
        String normalized = Objects.toString(value, "");
        if (normalized.contains(",") || normalized.contains("\"") || normalized.contains("\n")) {
            return "\"" + normalized.replace("\"", "\"\"") + "\"";
        }
        return normalized;
    }
}

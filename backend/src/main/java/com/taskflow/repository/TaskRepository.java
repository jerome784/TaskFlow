package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByProjectId(Long projectId);

    long countByStatus(TaskStatus status);

    long countByPriority(Priority priority);

    long countByDueDateBeforeAndStatusNot(LocalDate dueDate, TaskStatus status);
}

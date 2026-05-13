package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByProjectId(Long projectId);

    long countByStatus(TaskStatus status);

    long countByPriority(Priority priority);

    long countByDueDateBeforeAndStatusNot(LocalDate dueDate, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> findByFilters(
        @Param("status") TaskStatus status,
        @Param("projectId") Long projectId,
        @Param("priority") Priority priority,
        @Param("search") String search
    );

    @Query("SELECT t FROM Task t WHERE " +
           "t.assignee.id = :assigneeId AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> findByAssigneeIdAndFilters(
        @Param("assigneeId") Long assigneeId,
        @Param("status") TaskStatus status,
        @Param("projectId") Long projectId,
        @Param("priority") Priority priority,
        @Param("search") String search
    );

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :assigneeId AND t.status != 'DONE' AND t.dueDate < CURRENT_DATE")
    List<Task> findOverdueTasksForAssignee(@Param("assigneeId") Long assigneeId);

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :assigneeId AND t.status = 'TODO' AND t.createdAt >= :since")
    List<Task> findNewTasksForAssignee(@Param("assigneeId") Long assigneeId, @Param("since") java.time.LocalDateTime since);
}

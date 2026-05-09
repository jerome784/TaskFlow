package com.taskflow.dto.response;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ReportSummaryResponse {
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private Map<TaskStatus, Long> tasksByStatus;
    private Map<Priority, Long> tasksByPriority;
    private List<UserTaskCount> tasksByAssignee;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserTaskCount {
        private Long userId;
        private String name;
        private long total;
        private long completed;
    }
}

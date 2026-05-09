package com.taskflow.service;

import com.taskflow.dto.response.ActivityLogResponse;
import com.taskflow.entity.ActivityLog;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void record(String action, String details, User actor, Task task, Project project) {
        activityLogRepository.save(ActivityLog.builder()
            .action(action)
            .details(details)
            .actor(actor)
            .taskId(task != null ? task.getId() : null)
            .projectId(project != null ? project.getId() : null)
            .build());
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> latest() {
        return activityLogRepository.findTop50ByOrderByCreatedAtDesc()
            .stream()
            .map(ActivityLogResponse::from)
            .toList();
    }
}

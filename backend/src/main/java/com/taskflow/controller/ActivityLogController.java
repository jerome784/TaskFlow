package com.taskflow.controller;

import com.taskflow.dto.response.ActivityLogResponse;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ApiResponse<List<ActivityLogResponse>> latest() {
        return ApiResponse.success("Activity logs loaded.", activityLogService.latest());
    }
}

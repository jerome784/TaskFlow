package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.ReportSummaryResponse;
import com.taskflow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/summary")
    public ApiResponse<ReportSummaryResponse> summary() {
        return ApiResponse.success("Report summary loaded.", reportService.summary());
    }

    @GetMapping(value = "/tasks.csv", produces = "text/csv")
    public ResponseEntity<String> exportTasksCsv() {
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/csv"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=taskflow-tasks.csv")
            .body(reportService.exportTasksCsv());
    }
}

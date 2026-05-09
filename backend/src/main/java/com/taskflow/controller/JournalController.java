package com.taskflow.controller;

import com.taskflow.dto.request.JournalRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {
    private final JournalService journalService;

    @GetMapping
    public ApiResponse<String> getEntry(@RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ApiResponse.success("Journal loaded.", journalService.getEntry(date));
    }

    @PostMapping
    public ApiResponse<Void> saveEntry(@RequestParam(required = false) LocalDate date, @RequestBody JournalRequest request) {
        if (date == null) date = LocalDate.now();
        journalService.saveEntry(date, request.getContent());
        return ApiResponse.success("Journal saved.");
    }
}

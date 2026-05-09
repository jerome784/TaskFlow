package com.taskflow.controller;

import com.taskflow.dto.request.HabitRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.HabitResponse;
import com.taskflow.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {
    private final HabitService habitService;

    @GetMapping
    public ApiResponse<List<HabitResponse>> listHabits(@RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ApiResponse.success("Habits loaded.", habitService.listHabits(date));
    }

    @PostMapping
    public ApiResponse<HabitResponse> createHabit(@Valid @RequestBody HabitRequest request) {
        return ApiResponse.success("Habit created.", habitService.createHabit(request.getName()));
    }

    @PostMapping("/{id}/toggle")
    public ApiResponse<Void> toggleHabit(@PathVariable Long id, @RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now();
        habitService.toggleHabit(id, date);
        return ApiResponse.success("Habit toggled.");
    }
}

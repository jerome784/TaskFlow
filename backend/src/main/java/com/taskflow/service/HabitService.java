package com.taskflow.service;

import com.taskflow.dto.response.HabitResponse;
import com.taskflow.entity.Habit;
import com.taskflow.entity.HabitLog;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.HabitLogRepository;
import com.taskflow.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<HabitResponse> listHabits(LocalDate date) {
        User current = userService.getCurrentUserEntity();
        List<Habit> habits = habitRepository.findByUserId(current.getId());
        
        return habits.stream().map(h -> {
            boolean completed = habitLogRepository.existsByHabitIdAndCompletedDate(h.getId(), date);
            return new HabitResponse(h.getId(), h.getName(), h.getStreak(), completed);
        }).collect(Collectors.toList());
    }

    @Transactional
    public HabitResponse createHabit(String name) {
        User current = userService.getCurrentUserEntity();
        Habit habit = Habit.builder()
            .name(name.trim())
            .user(current)
            .streak(0)
            .build();
        Habit saved = habitRepository.save(habit);
        return new HabitResponse(saved.getId(), saved.getName(), saved.getStreak(), false);
    }

    @Transactional
    public void toggleHabit(Long id, LocalDate date) {
        User current = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));
        
        if (!habit.getUser().getId().equals(current.getId())) {
            throw new AccessDeniedException("Cannot toggle someone else's habit.");
        }

        boolean exists = habitLogRepository.existsByHabitIdAndCompletedDate(id, date);
        if (exists) {
            habitLogRepository.deleteByHabitIdAndCompletedDate(id, date);
            if (date.equals(LocalDate.now()) && habit.getStreak() > 0) {
                habit.setStreak(habit.getStreak() - 1);
            }
        } else {
            HabitLog log = HabitLog.builder().habit(habit).completedDate(date).build();
            habitLogRepository.save(log);
            if (date.equals(LocalDate.now())) {
                habit.setStreak(habit.getStreak() + 1);
            }
        }
        habitRepository.save(habit);
    }
}

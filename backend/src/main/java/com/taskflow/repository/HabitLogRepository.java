package com.taskflow.repository;

import com.taskflow.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByHabitIdAndCompletedDate(Long habitId, LocalDate completedDate);
    boolean existsByHabitIdAndCompletedDate(Long habitId, LocalDate completedDate);
    void deleteByHabitIdAndCompletedDate(Long habitId, LocalDate completedDate);
}

package com.taskflow.repository;

import com.taskflow.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    Optional<JournalEntry> findByUserIdAndEntryDate(Long userId, LocalDate entryDate);
    long countByUserId(Long userId);
}

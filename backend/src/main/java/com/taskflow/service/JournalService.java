package com.taskflow.service;

import com.taskflow.entity.JournalEntry;
import com.taskflow.entity.User;
import com.taskflow.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class JournalService {
    private final JournalEntryRepository journalEntryRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public String getEntry(LocalDate date) {
        User current = userService.getCurrentUserEntity();
        return journalEntryRepository.findByUserIdAndEntryDate(current.getId(), date)
            .map(JournalEntry::getContent)
            .orElse("");
    }

    @Transactional
    public void saveEntry(LocalDate date, String content) {
        User current = userService.getCurrentUserEntity();
        JournalEntry entry = journalEntryRepository.findByUserIdAndEntryDate(current.getId(), date)
            .orElse(JournalEntry.builder().user(current).entryDate(date).build());
        
        entry.setContent(content);
        journalEntryRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public long getJournalCount() {
        User current = userService.getCurrentUserEntity();
        return journalEntryRepository.countByUserId(current.getId());
    }
}

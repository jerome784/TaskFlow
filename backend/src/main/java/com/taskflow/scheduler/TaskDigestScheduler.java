package com.taskflow.scheduler;

import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskDigestScheduler {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    // Runs every day at 8:00 AM server time (UTC)
    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional(readOnly = true)
    public void sendDailyDigest() {
        log.info("Starting daily task digest generation...");
        List<User> users = userRepository.findAll();
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);

        for (User user : users) {
            List<Task> overdueTasks = taskRepository.findOverdueTasksForAssignee(user.getId());
            List<Task> newTasks = taskRepository.findNewTasksForAssignee(user.getId(), yesterday);

            if (overdueTasks.isEmpty() && newTasks.isEmpty()) {
                continue;
            }

            String htmlBody = buildHtmlDigest(user, overdueTasks, newTasks);
            emailService.sendHtmlEmail(user.getEmail(), "TaskFlow: Your Daily Task Digest", htmlBody);
        }
        log.info("Finished daily task digest generation.");
    }

    private String buildHtmlDigest(User user, List<Task> overdueTasks, List<Task> newTasks) {
        StringBuilder sb = new StringBuilder();
        sb.append("<h2>Hello ").append(user.getName()).append(",</h2>");
        sb.append("<p>Here is your daily task summary from TaskFlow:</p>");

        if (!overdueTasks.isEmpty()) {
            sb.append("<h3 style='color: red;'>Overdue Tasks (").append(overdueTasks.size()).append(")</h3><ul>");
            for (Task t : overdueTasks) {
                sb.append("<li><b>").append(t.getTitle()).append("</b> - Due: ").append(t.getDueDate()).append("</li>");
            }
            sb.append("</ul>");
        }

        if (!newTasks.isEmpty()) {
            sb.append("<h3 style='color: green;'>New Tasks Today (").append(newTasks.size()).append(")</h3><ul>");
            for (Task t : newTasks) {
                sb.append("<li><b>").append(t.getTitle()).append("</b> - Priority: ").append(t.getPriority()).append("</li>");
            }
            sb.append("</ul>");
        }

        sb.append("<br><p>Log in to TaskFlow to manage your tasks.</p>");
        return sb.toString();
    }
}

package com.taskflow;

import com.taskflow.dto.request.StatusUpdateRequest;
import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.User;
import com.taskflow.enums.Priority;
import com.taskflow.enums.Role;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TaskServiceTest {
    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void managerCreatesTaskAndAssigneeCanCompleteIt() {
        User manager = saveUser("Maya Manager", "manager@example.com", Role.MANAGER);
        User developer = saveUser("Dev User", "dev@example.com", Role.DEVELOPER);
        authenticateAs(manager);

        TaskRequest createRequest = new TaskRequest();
        createRequest.setTitle("Build task API");
        createRequest.setDescription("Implement CRUD endpoints");
        createRequest.setPriority(Priority.HIGH);
        createRequest.setStatus(TaskStatus.TODO);
        createRequest.setDueDate(LocalDate.now().plusDays(2));
        createRequest.setAssigneeId(developer.getId());

        TaskResponse created = taskService.createTask(createRequest);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getAssignee().getEmail()).isEqualTo("dev@example.com");
        assertThat(created.isOverdue()).isFalse();

        authenticateAs(developer);
        StatusUpdateRequest statusUpdate = new StatusUpdateRequest();
        statusUpdate.setStatus(TaskStatus.DONE);

        TaskResponse completed = taskService.updateStatus(created.getId(), statusUpdate);

        assertThat(completed.getStatus()).isEqualTo(TaskStatus.DONE);
        assertThat(completed.getCompletedAt()).isNotNull();
    }

    private User saveUser(String name, String email, Role role) {
        return userRepository.save(User.builder()
            .name(name)
            .email(email)
            .password("{noop}password")
            .role(role)
            .build());
    }

    private void authenticateAs(User user) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
            user.getEmail(),
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        ));
    }
}

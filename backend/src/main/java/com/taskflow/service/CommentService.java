package com.taskflow.service;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.entity.Comment;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Role;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long taskId) {
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, userService.getCurrentUserEntity());
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
            .stream()
            .map(CommentResponse::from)
            .toList();
    }

    @Transactional
    public CommentResponse addComment(Long taskId, CommentRequest request) {
        User current = userService.getCurrentUserEntity();
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, current);

        Comment comment = Comment.builder()
            .content(request.getContent().trim())
            .task(task)
            .author(current)
            .build();

        Comment saved = commentRepository.save(comment);

        if (task.getAssignee() != null && !task.getAssignee().getId().equals(current.getId())) {
            notificationService.notifyUser(task.getAssignee(), current.getName() + " commented on your task: " + task.getTitle());
        } else if (!task.getCreatedBy().getId().equals(current.getId())) {
            notificationService.notifyUser(task.getCreatedBy(), current.getName() + " commented on task: " + task.getTitle());
        }

        return CommentResponse.from(saved);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        User current = userService.getCurrentUserEntity();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getAuthor().getId().equals(current.getId()) && current.getRole() == Role.DEVELOPER) {
            throw new AccessDeniedException("You can only delete your own comments.");
        }

        commentRepository.delete(comment);
    }

    private void assertCanAccessTask(Task task, User current) {
        if (current.getRole() == Role.ADMIN || current.getRole() == Role.MANAGER) {
            return;
        }
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(current.getId());
        if (!isAssignee) {
            throw new AccessDeniedException("Developers can only access assigned tasks.");
        }
    }
}

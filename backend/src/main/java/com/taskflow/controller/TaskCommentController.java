package com.taskflow.controller;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class TaskCommentController {
    private final CommentService commentService;

    @GetMapping
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Long taskId) {
        return ApiResponse.success("Comments loaded.", commentService.getComments(taskId));
    }

    @PostMapping
    public ApiResponse<CommentResponse> addComment(
        @PathVariable Long taskId,
        @Valid @RequestBody CommentRequest request
    ) {
        return ApiResponse.success("Comment added.", commentService.addComment(taskId, request));
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long taskId, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.success("Comment deleted.");
    }
}

package com.taskflow.dto.response;

import com.taskflow.entity.Comment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private UserResponse author;
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        if (comment == null) return null;
        return CommentResponse.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .author(UserResponse.from(comment.getAuthor()))
            .createdAt(comment.getCreatedAt())
            .build();
    }
}

package com.taskflow.dto.response;

import com.taskflow.entity.Attachment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private UserResponse uploadedBy;
    private LocalDateTime createdAt;
    private String downloadUrl;

    public static AttachmentResponse from(Attachment attachment) {
        if (attachment == null) return null;
        return AttachmentResponse.builder()
            .id(attachment.getId())
            .fileName(attachment.getFileName())
            .fileType(attachment.getFileType())
            .uploadedBy(UserResponse.from(attachment.getUploadedBy()))
            .createdAt(attachment.getCreatedAt())
            .downloadUrl("/api/tasks/" + attachment.getTask().getId() + "/attachments/" + attachment.getId() + "/download")
            .build();
    }
}

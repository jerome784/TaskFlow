package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.AttachmentResponse;
import com.taskflow.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/attachments")
@RequiredArgsConstructor
public class TaskAttachmentController {
    private final AttachmentService attachmentService;

    @GetMapping
    public ApiResponse<List<AttachmentResponse>> getAttachments(@PathVariable Long taskId) {
        return ApiResponse.success("Attachments loaded.", attachmentService.getAttachments(taskId));
    }

    @PostMapping
    public ApiResponse<AttachmentResponse> uploadAttachment(
        @PathVariable Long taskId,
        @RequestParam("file") MultipartFile file
    ) {
        return ApiResponse.success("Attachment uploaded.", attachmentService.uploadAttachment(taskId, file));
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<Resource> downloadAttachment(
        @PathVariable Long taskId,
        @PathVariable Long attachmentId
    ) {
        Resource resource = attachmentService.downloadAttachment(taskId, attachmentId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);
    }

    @DeleteMapping("/{attachmentId}")
    public ApiResponse<Void> deleteAttachment(
        @PathVariable Long taskId,
        @PathVariable Long attachmentId
    ) {
        attachmentService.deleteAttachment(taskId, attachmentId);
        return ApiResponse.success("Attachment deleted.");
    }
}

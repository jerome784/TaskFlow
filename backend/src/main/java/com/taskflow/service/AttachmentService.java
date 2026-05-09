package com.taskflow.service;

import com.taskflow.dto.response.AttachmentResponse;
import com.taskflow.entity.Attachment;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.Role;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachmentRepository attachmentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final NotificationService notificationService;

    @Value("${file.upload-dir:/app/uploads}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachments(Long taskId) {
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, userService.getCurrentUserEntity());
        return attachmentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
            .stream()
            .map(AttachmentResponse::from)
            .toList();
    }

    @Transactional
    public AttachmentResponse uploadAttachment(Long taskId, MultipartFile file) {
        User current = userService.getCurrentUserEntity();
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, current);

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String newFileName = UUID.randomUUID() + fileExtension;
            Path targetLocation = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = Attachment.builder()
                .fileName(originalFileName)
                .fileType(file.getContentType())
                .filePath(targetLocation.toString())
                .task(task)
                .uploadedBy(current)
                .build();

            Attachment saved = attachmentRepository.save(attachment);

            if (task.getAssignee() != null && !task.getAssignee().getId().equals(current.getId())) {
                notificationService.notifyUser(task.getAssignee(), current.getName() + " added a file to your task: " + task.getTitle());
            }

            return AttachmentResponse.from(saved);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }

    @Transactional(readOnly = true)
    public Resource downloadAttachment(Long taskId, Long attachmentId) {
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, userService.getCurrentUserEntity());

        Attachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getTask().getId().equals(taskId)) {
            throw new AccessDeniedException("Attachment does not belong to this task");
        }

        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found");
        }
    }

    @Transactional
    public void deleteAttachment(Long taskId, Long attachmentId) {
        User current = userService.getCurrentUserEntity();
        Task task = taskService.findById(taskId);
        assertCanAccessTask(task, current);

        Attachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getUploadedBy().getId().equals(current.getId()) && current.getRole() == Role.DEVELOPER) {
            throw new AccessDeniedException("You can only delete your own attachments.");
        }

        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log the error but proceed to delete from DB
        }

        attachmentRepository.delete(attachment);
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

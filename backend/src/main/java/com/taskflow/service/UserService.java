package com.taskflow.service;

import com.taskflow.dto.request.UserRoleUpdateRequest;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.User;
import com.taskflow.enums.Role;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll()
            .stream()
            .map(UserResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        User current = getCurrentUserEntity();
        User user = findById(id);
        if (!canManagePeople(current) && !current.getId().equals(user.getId())) {
            throw new AccessDeniedException("Users can only view their own profile.");
        }
        return UserResponse.from(user);
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser() {
        return UserResponse.from(getCurrentUserEntity());
    }

    @Transactional
    public UserResponse updateRole(Long id, UserRoleUpdateRequest request) {
        User target = findById(id);
        target.setRole(request.getRole());
        return UserResponse.from(userRepository.save(target));
    }

    @Transactional(readOnly = true)
    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication required.");
        }

        String email = authentication.getName();
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        }

        return userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UnauthorizedException("Authenticated user no longer exists."));
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public boolean canManagePeople(User user) {
        return user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER;
    }
}

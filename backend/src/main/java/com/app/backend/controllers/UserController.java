package com.app.backend.controllers;

import com.app.backend.dtos.ApiResponse;
import com.app.backend.dtos.UserProfileRequest;
import com.app.backend.dtos.UserProfileResponse;
import com.app.backend.filters.FirebaseAuthFilter;
import com.app.backend.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v1/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(HttpServletRequest request) {
        String uid = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        String email = (String) request.getAttribute(FirebaseAuthFilter.USER_EMAIL_ATTRIBUTE);
        
        log.info("Getting user profile: uid={}", uid);
        UserProfileResponse response = userService.getOrCreateUser(uid, email);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUser(
            HttpServletRequest request,
            @Valid @RequestBody UserProfileRequest profileRequest) {
        
        String uid = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        
        log.info("Updating user profile: uid={}", uid);
        UserProfileResponse response = userService.updateUser(uid, profileRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


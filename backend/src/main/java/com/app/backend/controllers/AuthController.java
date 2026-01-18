package com.app.backend.controllers;

import com.app.backend.dtos.ApiResponse;
import com.app.backend.dtos.AuthVerifyResponse;
import com.app.backend.filters.FirebaseAuthFilter;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/api/auth")
public class AuthController {

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<AuthVerifyResponse>> verifyToken(HttpServletRequest request) {
        String uid = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        String email = (String) request.getAttribute(FirebaseAuthFilter.USER_EMAIL_ATTRIBUTE);
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.FIREBASE_TOKEN_ATTRIBUTE);

        Map<String, Object> claims = new HashMap<>(token.getClaims());
        // Remove standard claims that are already exposed
        claims.remove("iss");
        claims.remove("aud");
        claims.remove("auth_time");
        claims.remove("user_id");
        claims.remove("sub");
        claims.remove("iat");
        claims.remove("exp");
        claims.remove("email");
        claims.remove("email_verified");

        AuthVerifyResponse response = AuthVerifyResponse.builder()
                .uid(uid)
                .email(email)
                .name(token.getName())
                .picture(token.getPicture())
                .emailVerified(token.isEmailVerified())
                .claims(claims.isEmpty() ? null : claims)
                .build();

        log.info("Token verified for user: uid={}", uid);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


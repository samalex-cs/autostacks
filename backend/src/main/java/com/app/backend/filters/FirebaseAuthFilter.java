package com.app.backend.filters;

import com.app.backend.dtos.ApiResponse;
import com.app.backend.dtos.ErrorDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Slf4j
@Component
public class FirebaseAuthFilter implements Filter {

    public static final String USER_UID_ATTRIBUTE = "userUid";
    public static final String USER_EMAIL_ATTRIBUTE = "userEmail";
    public static final String FIREBASE_TOKEN_ATTRIBUTE = "firebaseToken";

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/health",
            "/actuator/health"
    );

    private final ObjectMapper objectMapper;

    public FirebaseAuthFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();

        // Allow public paths without authentication
        if (isPublicPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        // Check for Authorization header
        String authHeader = httpRequest.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            sendUnauthorizedResponse(httpResponse, "Missing or invalid Authorization header");
            return;
        }

        String idToken = authHeader.substring(BEARER_PREFIX.length());

        try {
            // Verify the Firebase ID token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            // Inject user info into request attributes
            httpRequest.setAttribute(USER_UID_ATTRIBUTE, uid);
            httpRequest.setAttribute(USER_EMAIL_ATTRIBUTE, email);
            httpRequest.setAttribute(FIREBASE_TOKEN_ATTRIBUTE, decodedToken);

            log.debug("Authenticated user: uid={}, email={}", uid, email);

            chain.doFilter(request, response);

        } catch (FirebaseAuthException e) {
            log.warn("Firebase token verification failed: {}", e.getMessage());
            sendUnauthorizedResponse(httpResponse, "Invalid or expired token");
        }
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::equals);
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(false)
                .error(new ErrorDetails(message, "UNAUTHORIZED"))
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}


package com.app.backend.utils;

import com.app.backend.filters.FirebaseAuthFilter;
import jakarta.servlet.http.HttpServletRequest;

public final class RequestUtils {

    private RequestUtils() {
        // Utility class - prevent instantiation
    }

    public static String getUserId(HttpServletRequest request) {
        return (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
    }

    public static String getUserEmail(HttpServletRequest request) {
        return (String) request.getAttribute(FirebaseAuthFilter.USER_EMAIL_ATTRIBUTE);
    }
}


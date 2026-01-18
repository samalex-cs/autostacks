package com.app.backend.services;

import com.app.backend.dtos.UserProfileRequest;
import com.app.backend.dtos.UserProfileResponse;
import com.app.backend.exceptions.ResourceNotFoundException;
import com.app.backend.firestore.FirestoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserService {

    private final FirestoreService firestoreService;

    public UserService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public UserProfileResponse getOrCreateUser(String uid, String email) {
        try {
            return firestoreService.getUser(uid);
        } catch (ResourceNotFoundException e) {
            log.info("User not found, creating new user: uid={}", uid);
            UserProfileRequest defaultProfile = UserProfileRequest.builder()
                    .name("")
                    .city("")
                    .build();
            return firestoreService.saveUser(uid, email, defaultProfile);
        }
    }

    public UserProfileResponse getUser(String uid) {
        return firestoreService.getUser(uid);
    }

    public UserProfileResponse updateUser(String uid, UserProfileRequest request) {
        return firestoreService.updateUser(uid, request);
    }
}


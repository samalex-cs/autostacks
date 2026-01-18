package com.app.backend.services;

import com.app.backend.dtos.TestDriveRequest;
import com.app.backend.dtos.TestDriveResponse;
import com.app.backend.firestore.FirestoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TestDriveService {

    private final FirestoreService firestoreService;

    public TestDriveService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public TestDriveResponse createTestDrive(String userId, TestDriveRequest request) {
        log.info("Creating test drive for user: userId={}, carId={}, dealerId={}", 
                userId, request.getCarId(), request.getDealerId());
        return firestoreService.saveTestDrive(userId, request);
    }

    public List<TestDriveResponse> getTestDrivesByUserId(String userId) {
        log.info("Fetching test drives for user: userId={}", userId);
        return firestoreService.listTestDrivesByUserId(userId);
    }
}


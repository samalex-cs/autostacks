package com.app.backend.controllers;

import com.app.backend.dtos.ApiResponse;
import com.app.backend.dtos.TestDriveRequest;
import com.app.backend.dtos.TestDriveResponse;
import com.app.backend.filters.FirebaseAuthFilter;
import com.app.backend.services.TestDriveService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/api/test-drives")
public class TestDriveController {

    private final TestDriveService testDriveService;

    public TestDriveController(TestDriveService testDriveService) {
        this.testDriveService = testDriveService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestDriveResponse>> createTestDrive(
            HttpServletRequest request,
            @Valid @RequestBody TestDriveRequest testDriveRequest) {
        
        String userId = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        
        log.info("Creating test drive: userId={}, carId={}, dealerId={}", 
                userId, testDriveRequest.getCarId(), testDriveRequest.getDealerId());
        TestDriveResponse response = testDriveService.createTestDrive(userId, testDriveRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getTestDrives(HttpServletRequest request) {
        String userId = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        
        log.info("Getting test drives for user: userId={}", userId);
        List<TestDriveResponse> testDrives = testDriveService.getTestDrivesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(testDrives));
    }
}


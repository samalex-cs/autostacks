package com.app.backend.controllers;

import com.app.backend.dtos.ApiResponse;
import com.app.backend.dtos.InterestRequest;
import com.app.backend.dtos.InterestResponse;
import com.app.backend.filters.FirebaseAuthFilter;
import com.app.backend.services.InterestService;
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
@RequestMapping("/v1/api/interests")
public class InterestController {

    private final InterestService interestService;

    public InterestController(InterestService interestService) {
        this.interestService = interestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InterestResponse>> createInterest(
            HttpServletRequest request,
            @Valid @RequestBody InterestRequest interestRequest) {
        
        String userId = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        
        log.info("Creating interest: userId={}, carId={}", userId, interestRequest.getCarId());
        InterestResponse response = interestService.createInterest(userId, interestRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterestResponse>>> getInterests(HttpServletRequest request) {
        String userId = (String) request.getAttribute(FirebaseAuthFilter.USER_UID_ATTRIBUTE);
        
        log.info("Getting interests for user: userId={}", userId);
        List<InterestResponse> interests = interestService.getInterestsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(interests));
    }
}


package com.app.backend.services;

import com.app.backend.dtos.InterestRequest;
import com.app.backend.dtos.InterestResponse;
import com.app.backend.firestore.FirestoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class InterestService {

    private final FirestoreService firestoreService;

    public InterestService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public InterestResponse createInterest(String userId, InterestRequest request) {
        log.info("Creating interest for user: userId={}, carId={}", userId, request.getCarId());
        return firestoreService.saveInterest(userId, request);
    }

    public List<InterestResponse> getInterestsByUserId(String userId) {
        log.info("Fetching interests for user: userId={}", userId);
        return firestoreService.listInterestsByUserId(userId);
    }
}


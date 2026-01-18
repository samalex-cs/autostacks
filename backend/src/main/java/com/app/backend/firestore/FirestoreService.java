package com.app.backend.firestore;

import com.app.backend.dtos.InterestRequest;
import com.app.backend.dtos.InterestResponse;
import com.app.backend.dtos.TestDriveRequest;
import com.app.backend.dtos.TestDriveResponse;
import com.app.backend.dtos.UserProfileRequest;
import com.app.backend.dtos.UserProfileResponse;
import com.app.backend.exceptions.FirestoreOperationException;
import com.app.backend.exceptions.ResourceNotFoundException;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
public class FirestoreService {

    private static final String USERS_COLLECTION = "users";
    private static final String INTERESTS_COLLECTION = "interests";
    private static final String TEST_DRIVES_COLLECTION = "test_drives";

    private final Firestore firestore;

    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    // ==================== User Operations ====================

    public UserProfileResponse saveUser(String uid, String email, UserProfileRequest request) {
        try {
            DocumentReference docRef = firestore.collection(USERS_COLLECTION).document(uid);
            Timestamp now = Timestamp.now();

            Map<String, Object> userData = new HashMap<>();
            userData.put("email", email);
            userData.put("name", request.getName());
            userData.put("city", request.getCity());
            userData.put("attributes", request.getAttributes() != null ? request.getAttributes() : new HashMap<>());
            userData.put("audiences", request.getAudiences() != null ? request.getAudiences() : new ArrayList<>());
            userData.put("abTestGroup", request.getAbTestGroup());
            userData.put("createdAt", now);
            userData.put("updatedAt", now);

            ApiFuture<WriteResult> result = docRef.set(userData);
            result.get(); // Wait for completion

            log.info("User saved successfully: uid={}", uid);
            return buildUserProfileResponse(uid, userData);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to save user: uid={}", uid, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to save user", e);
        }
    }

    public UserProfileResponse getUser(String uid) {
        try {
            DocumentReference docRef = firestore.collection(USERS_COLLECTION).document(uid);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (!document.exists()) {
                throw new ResourceNotFoundException("User not found: " + uid);
            }

            Map<String, Object> data = document.getData();
            log.info("User retrieved successfully: uid={}", uid);
            return buildUserProfileResponse(uid, data);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to get user: uid={}", uid, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to get user", e);
        }
    }

    public UserProfileResponse updateUser(String uid, UserProfileRequest request) {
        try {
            DocumentReference docRef = firestore.collection(USERS_COLLECTION).document(uid);
            
            // Check if user exists
            DocumentSnapshot existing = docRef.get().get();
            if (!existing.exists()) {
                throw new ResourceNotFoundException("User not found: " + uid);
            }

            Map<String, Object> updates = new HashMap<>();
            if (request.getName() != null) {
                updates.put("name", request.getName());
            }
            if (request.getCity() != null) {
                updates.put("city", request.getCity());
            }
            if (request.getAttributes() != null) {
                updates.put("attributes", request.getAttributes());
            }
            if (request.getAudiences() != null) {
                updates.put("audiences", request.getAudiences());
            }
            if (request.getAbTestGroup() != null) {
                updates.put("abTestGroup", request.getAbTestGroup());
            }
            updates.put("updatedAt", Timestamp.now());

            ApiFuture<WriteResult> result = docRef.update(updates);
            result.get(); // Wait for completion

            log.info("User updated successfully: uid={}", uid);
            return getUser(uid);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to update user: uid={}", uid, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to update user", e);
        }
    }

    // ==================== Interest Operations ====================

    public InterestResponse saveInterest(String userId, InterestRequest request) {
        try {
            CollectionReference collection = firestore.collection(INTERESTS_COLLECTION);
            DocumentReference docRef = collection.document();
            String interestId = docRef.getId();
            Timestamp now = Timestamp.now();

            Map<String, Object> interestData = new HashMap<>();
            interestData.put("userId", userId);
            interestData.put("carId", request.getCarId());
            interestData.put("carOwner", request.getCarOwner());
            interestData.put("createdAt", now);

            ApiFuture<WriteResult> result = docRef.set(interestData);
            result.get(); // Wait for completion

            log.info("Interest saved successfully: id={}, userId={}", interestId, userId);
            return buildInterestResponse(interestId, interestData);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to save interest for user: {}", userId, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to save interest", e);
        }
    }

    public List<InterestResponse> listInterestsByUserId(String userId) {
        try {
            CollectionReference collection = firestore.collection(INTERESTS_COLLECTION);
            ApiFuture<QuerySnapshot> future = collection
                    .whereEqualTo("userId", userId)
                    .get();

            QuerySnapshot querySnapshot = future.get();
            List<InterestResponse> interests = new ArrayList<>();

            for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
                interests.add(buildInterestResponse(document.getId(), document.getData()));
            }

            log.info("Retrieved {} interests for user: {}", interests.size(), userId);
            return interests;

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to list interests for user: {}", userId, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to list interests", e);
        }
    }

    // ==================== Test Drive Operations ====================

    public TestDriveResponse saveTestDrive(String userId, TestDriveRequest request) {
        try {
            CollectionReference collection = firestore.collection(TEST_DRIVES_COLLECTION);
            DocumentReference docRef = collection.document();
            String testDriveId = docRef.getId();
            Timestamp now = Timestamp.now();

            Map<String, Object> testDriveData = new HashMap<>();
            testDriveData.put("userId", userId);
            testDriveData.put("carId", request.getCarId());
            testDriveData.put("carOwner", request.getCarOwner());
            testDriveData.put("dealerId", request.getDealerId());
            testDriveData.put("preferredDate", Timestamp.of(Date.from(request.getPreferredDate().atZone(ZoneId.systemDefault()).toInstant())));
            testDriveData.put("status", "requested");
            testDriveData.put("createdAt", now);

            ApiFuture<WriteResult> result = docRef.set(testDriveData);
            result.get(); // Wait for completion

            log.info("Test drive saved successfully: id={}, userId={}", testDriveId, userId);
            return buildTestDriveResponse(testDriveId, testDriveData);

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to save test drive for user: {}", userId, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to save test drive", e);
        }
    }

    public List<TestDriveResponse> listTestDrivesByUserId(String userId) {
        try {
            CollectionReference collection = firestore.collection(TEST_DRIVES_COLLECTION);
            ApiFuture<QuerySnapshot> future = collection
                    .whereEqualTo("userId", userId)
                    .get();

            QuerySnapshot querySnapshot = future.get();
            List<TestDriveResponse> testDrives = new ArrayList<>();

            for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
                testDrives.add(buildTestDriveResponse(document.getId(), document.getData()));
            }

            log.info("Retrieved {} test drives for user: {}", testDrives.size(), userId);
            return testDrives;

        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to list test drives for user: {}", userId, e);
            Thread.currentThread().interrupt();
            throw new FirestoreOperationException("Failed to list test drives", e);
        }
    }

    // ==================== Helper Methods ====================

    @SuppressWarnings("unchecked")
    private UserProfileResponse buildUserProfileResponse(String uid, Map<String, Object> data) {
        return UserProfileResponse.builder()
                .uid(uid)
                .email((String) data.get("email"))
                .name((String) data.get("name"))
                .city((String) data.get("city"))
                .attributes((Map<String, Object>) data.get("attributes"))
                .audiences((List<String>) data.get("audiences"))
                .abTestGroup((String) data.get("abTestGroup"))
                .createdAt(toLocalDateTime(data.get("createdAt")))
                .updatedAt(toLocalDateTime(data.get("updatedAt")))
                .build();
    }

    private InterestResponse buildInterestResponse(String id, Map<String, Object> data) {
        return InterestResponse.builder()
                .id(id)
                .userId((String) data.get("userId"))
                .carId((String) data.get("carId"))
                .carOwner((String) data.get("carOwner"))
                .createdAt(toLocalDateTime(data.get("createdAt")))
                .build();
    }

    private TestDriveResponse buildTestDriveResponse(String id, Map<String, Object> data) {
        return TestDriveResponse.builder()
                .id(id)
                .userId((String) data.get("userId"))
                .carId((String) data.get("carId"))
                .carOwner((String) data.get("carOwner"))
                .dealerId((String) data.get("dealerId"))
                .preferredDate(toLocalDateTime(data.get("preferredDate")))
                .status((String) data.get("status"))
                .createdAt(toLocalDateTime(data.get("createdAt")))
                .build();
    }

    private LocalDateTime toLocalDateTime(Object timestamp) {
        if (timestamp == null) {
            return null;
        }
        if (timestamp instanceof Timestamp ts) {
            Instant instant = Instant.ofEpochSecond(ts.getSeconds(), ts.getNanos());
            return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        }
        return null;
    }
}


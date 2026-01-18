package com.app.backend.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {
    private String uid;
    private String email;
    private String name;
    private String city;
    private Map<String, Object> attributes;
    private List<String> audiences;
    private String abTestGroup;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


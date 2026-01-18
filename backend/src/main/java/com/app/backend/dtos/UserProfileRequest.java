package com.app.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String city;
    
    private Map<String, Object> attributes;
    
    private List<String> audiences;
    
    private String abTestGroup;
}


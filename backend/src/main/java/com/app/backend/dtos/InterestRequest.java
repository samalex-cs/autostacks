package com.app.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestRequest {
    
    @NotBlank(message = "Car ID is required")
    private String carId;
    
    @NotBlank(message = "Car owner is required")
    private String carOwner;
}


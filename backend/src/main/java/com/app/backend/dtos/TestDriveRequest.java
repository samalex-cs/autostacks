package com.app.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestDriveRequest {
    
    @NotBlank(message = "Car ID is required")
    private String carId;
    
    @NotBlank(message = "Car owner is required")
    private String carOwner;
    
    @NotBlank(message = "Dealer ID is required")
    private String dealerId;
    
    @NotNull(message = "Preferred date is required")
    private LocalDateTime preferredDate;
}


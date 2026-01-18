package com.app.backend.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthVerifyResponse {
    private String uid;
    private String email;
    private String name;
    private String picture;
    private boolean emailVerified;
    private Map<String, Object> claims;
}


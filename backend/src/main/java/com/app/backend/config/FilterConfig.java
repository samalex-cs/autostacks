package com.app.backend.config;

import com.app.backend.filters.FirebaseAuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    private final FirebaseAuthFilter firebaseAuthFilter;

    public FilterConfig(FirebaseAuthFilter firebaseAuthFilter) {
        this.firebaseAuthFilter = firebaseAuthFilter;
    }

    @Bean
    public FilterRegistrationBean<FirebaseAuthFilter> authFilterRegistration() {
        FilterRegistrationBean<FirebaseAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(firebaseAuthFilter);
        registration.addUrlPatterns("/v1/api/*");
        registration.setOrder(1);
        return registration;
    }
}


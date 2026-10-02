package com.sumit.bookstore.configurations;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .sessionManagement(management -> management
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Public authentication endpoints
                        .requestMatchers(
                                "/auth/**",
                                "/api/payments/callback",
                                "/actuator/health"
                        ).permitAll()

                        // Admin-only modules
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/subscription-plans/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/list").hasRole("ADMIN")
                        .requestMatchers("/api/subscriptions/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/subscriptions/activate").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/payments").hasRole("ADMIN")

                        // Admin-only book mutations; book reading remains authenticated
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")

                        // Admin-only loan operations
                        .requestMatchers("/api/book-loans/search").hasRole("ADMIN")
                        .requestMatchers("/api/book-loans/checkout/user/**").hasRole("ADMIN")
                        .requestMatchers("/api/book-loans/admin/**").hasRole("ADMIN")

                        // Admin-only fine operations / all-fines view
                        .requestMatchers(HttpMethod.POST, "/api/fines/waive").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/fines").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/fines").hasRole("ADMIN")

                        // Admin-only reservation operations / all-reservations view
                        .requestMatchers("/api/reservations/user/**").hasRole("ADMIN")
                        .requestMatchers("/api/reservations/*/fulfill").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservations").hasRole("ADMIN")

                        // Admin-only genre mutations
                        .requestMatchers(HttpMethod.POST, "/api/genres/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/genres/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/genres/**").hasRole("ADMIN")

                        // All remaining API endpoints require authentication.
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowCredentials(true);
                cfg.setAllowedOrigins(Arrays.asList(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "https://zoshlibrary.com"
                ));
                cfg.setAllowedMethods(Arrays.asList(
                        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
                ));
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Collections.singletonList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

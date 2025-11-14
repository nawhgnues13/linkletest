package com.ggamakun.linkle.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ggamakun.linkle.global.security.CustomUserDetailsService;
import com.ggamakun.linkle.global.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	log.info("[SecurityConfig] filterChain 등록 시작");
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(formLogin -> formLogin.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            
            .cors(cors -> {})
            
            
            .authorizeHttpRequests(auth -> auth
            	.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/chatbot/**").permitAll()
                .requestMatchers("/api/member/activities/**").authenticated()
                .requestMatchers("/api/member/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/file/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/swagger-ui.html").permitAll()
                .requestMatchers("GET","/api/posts/").permitAll()
                .requestMatchers("GET","/api/posts/summary").permitAll()
                .requestMatchers("GET","/api/posts/**").permitAll()
                .requestMatchers("GET","/api/posts/*/comments/**").permitAll()
                .requestMatchers("/api/comments/**").permitAll()
                .requestMatchers("/api/gallery/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("GET", "/api/clubs/joined").authenticated()
                .requestMatchers("GET", "/api/clubs/*/members/my-status").authenticated()
                .requestMatchers("GET", "/api/clubs/search").permitAll()
                .requestMatchers("GET", "/api/clubs/recent").permitAll()
                .requestMatchers("GET", "/api/clubs/recent/all").permitAll()
                .requestMatchers("GET", "/api/clubs/category/**").permitAll()
                .requestMatchers("GET", "/api/clubs/recommend/**").authenticated()
                .requestMatchers("POST", "/api/clubs").authenticated()
                .requestMatchers("GET","/api/clubs/**").permitAll()
                .requestMatchers("GET", "/api/schedules/**").permitAll()
                .anyRequest().authenticated()
                
            )
            .userDetailsService(customUserDetailsService)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
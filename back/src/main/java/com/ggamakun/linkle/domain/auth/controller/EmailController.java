package com.ggamakun.linkle.domain.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ggamakun.linkle.domain.auth.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth/email")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "이메일 인증", description = "이메일 인증 관련 API")
public class EmailController {
    
    private final EmailService emailService;
    
    @GetMapping("/verify")
    @Operation(summary = "이메일 인증", description = "토큰을 통해 이메일 인증을 완료합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인증 성공"),
        @ApiResponse(responseCode = "400", description = "인증 실패")
    })
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        log.info("이메일 인증 요청: {}", token);
        emailService.verifyToken(token);
        return ResponseEntity.ok().build();
    }
}
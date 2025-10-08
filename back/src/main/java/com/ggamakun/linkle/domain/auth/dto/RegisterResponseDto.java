package com.ggamakun.linkle.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "회원가입 응답 DTO")
public class RegisterResponseDto {
    
    @Schema(description = "회원 ID", example = "1")
    private Integer memberId;
    
    @Schema(description = "이메일", example = "user@example.com")
    private String email;
    
    @Schema(description = "이름", example = "홍길동")
    private String name;
    
    @Schema(description = "액세스 토큰")
    private String accessToken;
    
    @Schema(description = "리프레시 토큰")
    private String refreshToken;
}
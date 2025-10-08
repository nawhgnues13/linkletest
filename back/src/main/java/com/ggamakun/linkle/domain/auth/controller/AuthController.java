package com.ggamakun.linkle.domain.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ggamakun.linkle.domain.auth.dto.LoginRequestDto;
import com.ggamakun.linkle.domain.auth.dto.LoginResponseDto;
import com.ggamakun.linkle.domain.auth.dto.RegisterRequestDto;
import com.ggamakun.linkle.domain.auth.dto.RegisterResponseDto;
import com.ggamakun.linkle.domain.auth.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "인증", description = "로그인, 회원가입 등 인증 관련 API")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	@Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
	@ApiResponses(value = {
			@ApiResponse(
					responseCode = "200", 
					description = "로그인 성공",
					content = @Content(schema = @Schema(implementation = LoginResponseDto.class))
					),
			@ApiResponse(
					responseCode = "401", 
					description = "인증 실패 - 이메일 또는 비밀번호가 올바르지 않습니다.",
					content = @Content
					)
	})
	public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
		log.info("로그인 요청: {}", request.getEmail());
		LoginResponseDto response = authService.login(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/register")
	@Operation(summary = "회원가입", description = "이메일, 비밀번호, 이름으로 회원가입합니다.")
	@ApiResponses(value = {
			@ApiResponse(
					responseCode = "201", 
					description = "회원가입 성공",
					content = @Content(schema = @Schema(implementation = RegisterResponseDto.class))
					),
			@ApiResponse(
					responseCode = "400", 
					description = "입력값이 올바르지 않습니다.",
					content = @Content
					),
			@ApiResponse(
					responseCode = "409", 
					description = "이미 사용 중인 이메일입니다.",
					content = @Content
					)
	})
	public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
		log.info("회원가입 요청: {}", request.getEmail());
		RegisterResponseDto response = authService.register(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
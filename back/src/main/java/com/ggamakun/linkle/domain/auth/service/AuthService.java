package com.ggamakun.linkle.domain.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ggamakun.linkle.domain.auth.dto.LoginRequestDto;
import com.ggamakun.linkle.domain.auth.dto.LoginResponseDto;
import com.ggamakun.linkle.domain.auth.dto.RegisterRequestDto;
import com.ggamakun.linkle.domain.auth.dto.RegisterResponseDto;
import com.ggamakun.linkle.domain.member.entity.Member;
import com.ggamakun.linkle.domain.member.repository.IMemberRepository;
import com.ggamakun.linkle.global.exception.DuplicateException;
import com.ggamakun.linkle.global.exception.UnauthorizedException;
import com.ggamakun.linkle.global.security.CustomUserDetails;
import com.ggamakun.linkle.global.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final IMemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	public LoginResponseDto login(LoginRequestDto request) {
		try {
			// 사용자 인증
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getEmail(), 
							request.getPassword()
							)
					);

			// 인증된 사용자 정보 가져오기
			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			Member member = userDetails.getMember();

			// JWT 토큰 생성
			String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
			String refreshToken = jwtUtil.createRefreshToken(member.getMemberId(), member.getEmail());

			// 응답 DTO 생성
			return new LoginResponseDto(
					member.getMemberId(),
					member.getEmail(),
					member.getName(),
					member.getNickname(),
					accessToken,
					refreshToken
					);

		} catch (AuthenticationException e) {
			log.error("Login failed for email: {}", request.getEmail(), e);
			throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
		}
	}

	@Transactional
	public RegisterResponseDto register(RegisterRequestDto request) {
		log.info("회원가입 요청: {}", request.getEmail());

		// 이메일 중복 확인
		int emailCount = memberRepository.countByEmail(request.getEmail());
		if (emailCount > 0) {
			throw new DuplicateException("이미 사용 중인 이메일입니다.");
		}

		// 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(request.getPassword());

		// 회원 엔티티 생성
		Member member = Member.builder()
				.email(request.getEmail())
				.password(encodedPassword)
				.name(request.getName())
				.provider("LOCAL")
				.isWithdrawn("N")
				.isDeleted("N")
				.build();

		// 회원 등록
		int result = memberRepository.insertMember(member);

		if (result > 0) {
			log.info("회원가입 성공 - 회원 ID: {}, 이메일: {}", member.getMemberId(), member.getEmail());

			// JWT 토큰 생성
			String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
			String refreshToken = jwtUtil.createRefreshToken(member.getMemberId(), member.getEmail());

			// 응답 DTO 생성
			return new RegisterResponseDto(
					member.getMemberId(),
					member.getEmail(),
					member.getName(),
					accessToken,
					refreshToken
					);
		} else {
			log.error("회원가입 실패 - 이메일: {}", request.getEmail());
			throw new RuntimeException("회원가입에 실패했습니다.");
		}
	}
}
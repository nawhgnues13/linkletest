package com.ggamakun.linkle.global.oauth2;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.ggamakun.linkle.domain.member.entity.Member;
import com.ggamakun.linkle.global.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final JwtUtil jwtUtil;
    
    @Value("${oauth2.redirect.success-url}")
    private String successUrl;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        Member member = oAuth2User.getMember();
        boolean isNewUser = oAuth2User.isNewUser();
        
        log.info("OAuth2 로그인 성공 - 회원 ID: {}, 신규 회원: {}", member.getMemberId(), isNewUser);
        
        // JWT 토큰 생성
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
        String refreshToken = jwtUtil.createRefreshToken(member.getMemberId(), member.getEmail());
        
        // 프론트엔드로 리다이렉트 (쿼리 파라미터로 토큰 전달)
        String targetUrl = UriComponentsBuilder.fromUriString(successUrl)
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .queryParam("isNewUser", isNewUser)
            .queryParam("memberId", member.getMemberId())
            .queryParam("email", member.getEmail())
            .queryParam("name", member.getName())
            .build()
            .toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
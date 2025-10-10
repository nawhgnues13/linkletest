package com.ggamakun.linkle.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ggamakun.linkle.domain.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "회원", description = "회원 정보 관련 API")
public class MemberController {
    
    private final MemberService memberService;
    
    @GetMapping("/check-nickname")
    @Operation(summary = "닉네임 중복 체크", description = "닉네임 중복 여부를 확인합니다.")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "중복 체크 완료"
        )
    })
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        log.info("닉네임 중복 체크: {}", nickname);
        boolean isDuplicate = memberService.checkNicknameDuplicate(nickname);
        return ResponseEntity.ok(isDuplicate);
    }
    
    // TODO: 향후 추가될 API들
    // - GET /member/profile : 회원 정보 조회
    // - PUT /member/profile : 회원 정보 수정 (updateBasicInfo 사용)
    // - PUT /member/interests : 관심사 수정 (updateInterests 사용)
    // - PUT /member/password : 비밀번호 변경
    // - DELETE /member : 회원 탈퇴
}
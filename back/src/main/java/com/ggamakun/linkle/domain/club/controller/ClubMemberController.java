package com.ggamakun.linkle.domain.club.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ggamakun.linkle.domain.club.dto.ApproveRejectRequest;
import com.ggamakun.linkle.domain.club.dto.ClubMemberDto;
import com.ggamakun.linkle.domain.club.dto.RemoveMemberRequest;
import com.ggamakun.linkle.domain.club.dto.UpdateMemberRoleRequest;
import com.ggamakun.linkle.domain.club.service.IClubMemberService;
import com.ggamakun.linkle.global.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "동호회 회원 관리", description = "동호회 회원 관리 API")
public class ClubMemberController {

    private final IClubMemberService clubMemberService;

    @GetMapping("/clubs/{clubId}/members")
    @Operation(
        summary = "동호회 회원 목록 조회",
        description = "동호회에 가입된 회원 목록을 조회합니다. 권한별로 정렬됩니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<List<ClubMemberDto>> getClubMembers(
            @PathVariable Integer clubId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        List<ClubMemberDto> members = clubMemberService.getClubMembers(clubId, currentMemberId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/clubs/{clubId}/members/waiting")
    @Operation(
        summary = "가입 신청 대기 목록 조회",
        description = "동호회 가입 신청 대기 중인 회원 목록을 조회합니다. 운영진 이상만 조회 가능합니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<List<ClubMemberDto>> getWaitingMembers(
            @PathVariable Integer clubId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        List<ClubMemberDto> members = clubMemberService.getWaitingMembers(clubId, currentMemberId);
        return ResponseEntity.ok(members);
    }

    @PutMapping("/clubs/{clubId}/members/role")
    @Operation(
        summary = "회원 권한 변경",
        description = "동호회 회원의 권한을 변경합니다. 운영진 이상만 가능합니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "권한 변경 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<Void> updateMemberRole(
            @PathVariable Integer clubId,
            @Valid @RequestBody UpdateMemberRoleRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        clubMemberService.updateMemberRole(clubId, request.getMemberId(), request.getRole(), currentMemberId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/clubs/{clubId}/members/remove")
    @Operation(
        summary = "회원 강제 탈퇴",
        description = "동호회 회원을 강제로 탈퇴시킵니다. 운영진 이상만 가능합니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "강제 탈퇴 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<Void> removeMember(
            @PathVariable Integer clubId,
            @Valid @RequestBody RemoveMemberRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        clubMemberService.removeMember(clubId, request.getMemberId(), request.getReason(), 
                                      request.getAllowRejoin(), currentMemberId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/clubs/{clubId}/members/approve")
    @Operation(
        summary = "가입 신청 승인",
        description = "동호회 가입 신청을 승인합니다. 운영진 이상만 가능합니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "승인 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<Void> approveMember(
            @PathVariable Integer clubId,
            @Valid @RequestBody ApproveRejectRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        clubMemberService.approveMember(clubId, request.getMemberId(), currentMemberId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/clubs/{clubId}/members/reject")
    @Operation(
        summary = "가입 신청 거절",
        description = "동호회 가입 신청을 거절합니다. 운영진 이상만 가능합니다.",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "거절 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    public ResponseEntity<Void> rejectMember(
            @PathVariable Integer clubId,
            @Valid @RequestBody ApproveRejectRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Integer currentMemberId = userDetails.getMember().getMemberId();
        clubMemberService.rejectMember(clubId, request.getMemberId(), 
                                      request.getRejectionReason(), currentMemberId);
        return ResponseEntity.ok().build();
    }
}
package com.ggamakun.linkle.domain.member.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    
    private Integer memberId;
    private Integer fileId;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private LocalDate birthDate;
    private String gender;
    private String sido;
    private String sigungu;
    private String description;
    private String interests;
    private LocalDate joinDate;
    private String isWithdrawn;
    private LocalDate leaveDate;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private Integer updatedBy;
    private LocalDateTime updatedAt;
    private String provider;
    private String providerId;
    private String isDeleted;
    
    public boolean isSocialUser() {
        return provider != null && !provider.equals("LOCAL");
    }
    
    public boolean isLocalUser() {
        return provider == null || provider.equals("LOCAL");
    }
}
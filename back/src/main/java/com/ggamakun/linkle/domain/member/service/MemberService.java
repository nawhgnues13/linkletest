package com.ggamakun.linkle.domain.member.service;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ggamakun.linkle.domain.category.entity.Category;
import com.ggamakun.linkle.domain.category.repository.ICategoryRepository;
import com.ggamakun.linkle.domain.member.dto.MemberProfileDto;
import com.ggamakun.linkle.domain.member.entity.Member;
import com.ggamakun.linkle.domain.member.repository.IMemberRepository;
import com.ggamakun.linkle.global.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    
    private final IMemberRepository memberRepository;
    private final ICategoryRepository categoryRepository;
    
    /**
     * 회원 프로필 조회
     */
    public MemberProfileDto getProfile(Integer memberId) {
        log.info("회원 프로필 조회 - Member ID: {}", memberId);
        
        Member member = memberRepository.findById(memberId);
        if (member == null) {
            throw new BadRequestException("존재하지 않는 회원입니다.");
        }
        
        // 관심사 문자열을 리스트로 변환
        List<Integer> interestIds = Collections.emptyList();
        List<String> interestNames = Collections.emptyList();
        
        if (member.getInterests() != null && !member.getInterests().isEmpty()) {
            interestIds = Arrays.stream(member.getInterests().split("/"))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            // 카테고리 이름 조회
            interestNames = interestIds.stream()
                    .map(categoryRepository::findById)
                    .filter(cat -> cat != null)
                    .map(Category::getName)
                    .collect(Collectors.toList());
        }
        
        return MemberProfileDto.builder()
                .memberId(member.getMemberId())
                .fileId(member.getFileId())
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .birthDate(member.getBirthDate())
                .gender(member.getGender())
                .sido(member.getSido())
                .sigungu(member.getSigungu())
                .description(member.getDescription())
                .interests(interestIds)
                .interestNames(interestNames)
                .joinDate(member.getJoinDate())
                .build();
    }
    
    /**
     * 기본 정보 업데이트 (닉네임, 생년월일, 성별, 주소)
     */
    @Transactional
    public void updateBasicInfo(Integer memberId, String nickname, Timestamp birthDate, 
                                String gender, String sido, String sigungu) {
        log.info("회원 기본 정보 업데이트 시작 - Member ID: {}", memberId);
        
        // 회원 존재 확인
        Member member = memberRepository.findById(memberId);
        if (member == null) {
            throw new BadRequestException("존재하지 않는 회원입니다.");
        }
        
        // 닉네임 중복 확인 (닉네임이 변경되는 경우에만)
        if (nickname != null && !nickname.equals(member.getNickname())) {
            if (memberRepository.countByNickname(nickname) > 0) {
                throw new BadRequestException("이미 사용 중인 닉네임입니다.");
            }
        }
        
        // 회원 정보 업데이트
        member.setNickname(nickname);
        member.setBirthDate(birthDate);
        member.setGender(gender);
        member.setSido(sido);
        member.setSigungu(sigungu);
        member.setUpdatedBy(memberId);
        
        int result = memberRepository.updateMember(member);
        
        if (result <= 0) {
            throw new BadRequestException("회원 정보 업데이트에 실패했습니다.");
        }
        
        log.info("회원 기본 정보 업데이트 완료 - Member ID: {}", memberId);
    }
    
    /**
     * 관심사 업데이트
     */
    @Transactional
    public void updateInterests(Integer memberId, String interests) {
        log.info("회원 관심사 업데이트 시작 - Member ID: {}", memberId);
        
        // 회원 존재 확인
        Member member = memberRepository.findById(memberId);
        if (member == null) {
            throw new BadRequestException("존재하지 않는 회원입니다.");
        }
        
        // 관심사 업데이트
        member.setInterests(interests);
        member.setUpdatedBy(memberId);
        
        int result = memberRepository.updateMember(member);
        
        if (result <= 0) {
            throw new BadRequestException("관심사 등록에 실패했습니다.");
        }
        
        log.info("회원 관심사 업데이트 완료 - Member ID: {}, 관심사: {}", memberId, interests);
    }
    
    /**
     * 닉네임 중복 체크
     */
    public boolean checkNicknameDuplicate(String nickname) {
        return memberRepository.countByNickname(nickname) > 0;
    }
    
    /**
     * 회원 조회
     */
    public Member getMemberById(Integer memberId) {
        Member member = memberRepository.findById(memberId);
        if (member == null) {
            throw new BadRequestException("존재하지 않는 회원입니다.");
        }
        return member;
    }
}
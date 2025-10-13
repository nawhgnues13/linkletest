package com.ggamakun.linkle.domain.auth.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ggamakun.linkle.domain.member.entity.Member;
import com.ggamakun.linkle.domain.member.repository.IMemberRepository;
import com.ggamakun.linkle.global.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final IMemberRepository memberRepository;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${mail.verification.expiry}")
    private Integer expiryTime;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    @Transactional
    public void sendVerificationEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        
        if (member == null) {
            throw new BadRequestException("존재하지 않는 이메일입니다.");
        }
        
        if ("Y".equals(member.getEmailVerified())) {
            throw new BadRequestException("이미 인증된 이메일입니다.");
        }
        
        String token = generateVerificationToken();
        
        member.setVerificationToken(token);
        member.setTokenExpiryDate(Timestamp.valueOf(LocalDateTime.now().plusSeconds(expiryTime / 1000)));
        
        memberRepository.updateMember(member);
        
        sendEmail(email, token);
        
        log.info("인증 이메일 발송 완료: {}", email);
    }
    
    @Transactional
    public boolean verifyToken(String token) {
        Member member = memberRepository.findByVerificationToken(token);
        
        if (member == null) {
            throw new BadRequestException("유효하지 않은 인증 토큰입니다.");
        }
        
        if (member.getTokenExpiryDate().before(Timestamp.valueOf(LocalDateTime.now()))) {
            throw new BadRequestException("인증 토큰이 만료되었습니다.");
        }
        
        member.setEmailVerified("Y");
        member.setVerificationToken(null);
        member.setTokenExpiryDate(null);
        
        memberRepository.updateMember(member);
        
        log.info("이메일 인증 완료: {}", member.getEmail());
        
        return true;
    }
    
    public boolean isVerified(String email) {
        Member member = memberRepository.findByEmail(email);
        return member != null && "Y".equals(member.getEmailVerified());
    }
    
    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
    
    private void sendEmail(String to, String token) {
        try {
            String verificationUrl = frontendUrl + "/auth/verify-email?token=" + token;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("[링클] 이메일 인증을 완료해주세요");
            message.setText(
                "링클에 가입해주셔서 감사합니다.\n\n" +
                "아래 링크를 클릭하여 이메일 인증을 완료해주세요.\n\n" +
                verificationUrl + "\n\n" +
                "이 링크는 24시간 동안 유효합니다.\n\n" +
                "본인이 가입하지 않으셨다면 이 메일을 무시하셔도 됩니다."
            );
            
            mailSender.send(message);
            log.info("인증 이메일 전송 성공: {}", to);
        } catch (Exception e) {
            log.error("이메일 전송 실패: {}", to, e);
            throw new BadRequestException("이메일 전송에 실패했습니다.");
        }
    }
}
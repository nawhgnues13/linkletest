package com.ggamakun.linkle.domain.notification.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ggamakun.linkle.domain.notification.dto.CreateNotificationRequestDto;
import com.ggamakun.linkle.domain.notification.dto.NotificationDto;
import com.ggamakun.linkle.domain.notification.repository.INotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService implements INotificationService{

    private final INotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<NotificationDto> getNotifications(Integer memberId) {
        return notificationRepository.findByReceiverId(memberId);
    }

    @Transactional
    public void sendNotification(CreateNotificationRequestDto request) {
    	// 1. DB에 저장 (Mapper가 notificationId를 자동으로 채워줌)
        notificationRepository.insertNotification(request);
        
        // 2. WebSocket으로 실시간 전송
        NotificationDto dto = NotificationDto.builder()
            .notificationId(request.getNotificationId())  // ⭐ 생성된 ID 사용
            .title(request.getTitle())
            .content(request.getContent())
            .linkUrl(request.getLinkUrl())
            .isRead("N")
            .build();
        
        messagingTemplate.convertAndSendToUser(
            request.getReceiverId().toString(),
            "/queue/notifications",
            dto
        );
        
        log.info("실시간 알림 전송 완료 - receiverId: {}, notificationId: {}", 
                 request.getReceiverId(), request.getNotificationId());
    }

    @Transactional
    public void markAsRead(Integer notificationId, Integer memberId) {
        notificationRepository.markAsRead(notificationId, memberId);
    }

    @Transactional
    public void markAllAsRead(Integer memberId) {
        notificationRepository.markAllAsRead(memberId);
    }

    @Transactional
    public void deleteNotification(Integer notificationId, Integer memberId) {
        notificationRepository.deleteNotification(notificationId, memberId);
    }
}
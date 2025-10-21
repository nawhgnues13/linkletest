package com.ggamakun.linkle.domain.schedule.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ggamakun.linkle.domain.schedule.dto.AttendeeInfo;
import com.ggamakun.linkle.domain.schedule.dto.ScheduleDetail;
import com.ggamakun.linkle.domain.schedule.dto.ScheduleSummary;
import com.ggamakun.linkle.domain.schedule.entity.Schedule;

@Mapper
public interface IScheduleRepository {
    
    // 일정 생성
    int insertSchedule(Schedule schedule);
    
    // 일정 취소
    int cancelSchedule(@Param("scheduleId") Integer scheduleId, @Param("canceledBy") Integer canceledBy);
    
 // 일정 상세 조회
    ScheduleDetail findById(Integer scheduleId);
    
    // 동호회별 일정 목록 조회
    List<ScheduleSummary> findByClubId(Integer clubId);
    
    // 일정 참석자 목록 조회
    List<AttendeeInfo> findAttendeesByScheduleId(Integer scheduleId);
    
}
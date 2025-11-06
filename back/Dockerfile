# OpenJDK 17 이미지 사용
FROM eclipse-temurin:17-jdk-jammy

# 타임존 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY build/libs/*.jar app.jar

# 애플리케이션 실행 (JVM 옵션 추가)
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-Doracle.jdbc.timezoneAsRegion=false", "-jar", "app.jar"]

# 포트 노출
EXPOSE 8080

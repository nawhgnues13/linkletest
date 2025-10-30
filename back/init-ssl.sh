#!/bin/bash

# SSL 인증서 초기 발급 스크립트
# 이 스크립트는 EC2 인스턴스에서 처음 한 번만 실행합니다

echo "Let's Encrypt SSL 인증서 발급을 시작합니다..."

# 필요한 디렉토리 생성
mkdir -p certbot/conf
mkdir -p certbot/www

# 임시 nginx 설정으로 HTTP만 활성화
cat > nginx/nginx-temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name linkle.shop www.linkle.shop;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'OK';
        }
    }
}
EOF

# 기존 nginx 설정 백업
if [ -f nginx/nginx.conf ]; then
    mv nginx/nginx.conf nginx/nginx.conf.backup
fi

# 임시 설정으로 교체
mv nginx/nginx-temp.conf nginx/nginx.conf

# Nginx 컨테이너만 시작
docker-compose up -d nginx

echo "Nginx 시작 대기 중..."
sleep 5

# SSL 인증서 발급
docker-compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email nawhgnues1313@gmail.com \
    --agree-tos \
    --no-eff-email \
    -d linkle.shop \
    -d www.linkle.shop

# 인증서 발급 확인
if [ $? -eq 0 ]; then
    echo "SSL 인증서가 성공적으로 발급되었습니다."
    
    # 원래 nginx 설정 복원
    if [ -f nginx/nginx.conf.backup ]; then
        mv nginx/nginx.conf.backup nginx/nginx.conf
    fi
    
    # 전체 컨테이너 재시작
    docker-compose down
    docker-compose up -d
    
    echo "배포가 완료되었습니다."
else
    echo "SSL 인증서 발급에 실패했습니다."
    echo "도메인 DNS 설정을 확인하고 다시 시도해주세요."
    exit 1
fi

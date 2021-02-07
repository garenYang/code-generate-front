FROM nginx

MAINTAINER kakusilong@163.com

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN mkdir -p /devp-ui-vue

WORKDIR /devp-ui-vue

VOLUME /tmp
ENV LANG en_US.UTF-8
ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443

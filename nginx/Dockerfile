FROM nginx:1.31.1

RUN rm -f /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/certs

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY certs/cortaai.local.pem /etc/nginx/certs/cortaai.local.pem
COPY certs/cortaai.local-key.pem /etc/nginx/certs/cortaai.local-key.pem
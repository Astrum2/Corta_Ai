FROM nginx:1.31.1

RUN rm -f /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/certs

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
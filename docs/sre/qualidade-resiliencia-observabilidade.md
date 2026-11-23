# SRE — Qualidade, Resiliência e Observabilidade

## SLOs e SLIs

| Indicador | SLO | SLI |
|---|---|---|
| Disponibilidade da API Principal | 99,9% | Porcentagem de requisições com sucesso (`2xx`) |
| Latência de agendamento | 95% dos agendamentos concluídos em menos de 500 ms | Tempo de resposta |

## Estratégias de resiliência

### Retry

O Serviço de Notificações tenta reenviar a mensagem até três vezes quando ocorre uma falha.

### Timeout

A API aguarda no máximo três segundos pelo Serviço de Review. Se o limite for excedido, a resposta do review é ignorada para não bloquear o cliente.

## Observabilidade

Devem ser coletados e acompanhados:

- Métricas de CPU e RAM.
- Taxa de erros HTTP `5xx`.
- Logs com `Correlation ID`, permitindo rastrear uma requisição entre os microsserviços.


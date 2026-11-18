# ADR 001 — Separação do Serviço de Notificações

- **Status:** Aceita
- **Data:** 2026-11-16

## Contexto

O envio de mensagens depende de redes e serviços externos. Processar essas mensagens diretamente na API principal poderia deixar a aplicação lenta e vulnerável a falhas de rede.

## Decisão

Extrair o envio de mensagens para um microsserviço dedicado. A API principal registra o agendamento no MySQL e envia um sinal rápido para o microsserviço de notificações.

## Consequências

### Benefícios

- O agendamento é concluído mais rapidamente.
- Falhas ou lentidão do provedor de mensagens ficam isoladas da API principal.

### Custos e riscos

- A arquitetura fica mais complexa.
- É necessário monitorar a comunicação e o processamento assíncrono entre serviços.


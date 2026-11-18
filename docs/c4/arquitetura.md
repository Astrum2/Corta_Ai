# Arquitetura e Modelos C4

## Diagrama conceitual

Relação conceitual entre `Usuario`, `Agendamento` e `Barbeiro`.

![Diagrama conceitual](./imagens/diagrama-conceitual.png)

## Modelo C4 — Diagrama de Contexto

### Atores e sistemas

- O **Cliente** realiza agendamentos no **Sistema Barbearia**.
- O **Barbeiro/Admin** gerencia a agenda e os serviços no **Sistema Barbearia**.
- O **Sistema Barbearia** envia notificações para o **Serviço de E-mail/SMS Externo**.

![Diagrama de contexto](./imagens/diagrama-contexto.png)

## Modelo C4 — Diagrama de Containers

### Aplicações e comunicação

- A **Aplicação do Cliente [React]** e o **Painel do Barbeiro [React]** comunicam-se via HTTPS/JSON com a **API Principal [Node.js]**.
- A **API Principal** comunica-se:
  - via TCP/IP com o **Banco Corta AI**;
  - via HTTPS/JSON com o **Microsserviço de Review [Node.js]**;
  - por eventos de `novo agendamento` com o **Microsserviço de Notificações [Node.js]**.
- O **Microsserviço de Review** conecta-se via TCP/IP ao **Banco Review**.
- O **Microsserviço de Notificações** conecta-se via TCP/IP ao **Banco Notificação** e ao **Serviço de E-mail/SMS Externo**.

![Diagrama de containers](./imagens/diagrama-containers.png)


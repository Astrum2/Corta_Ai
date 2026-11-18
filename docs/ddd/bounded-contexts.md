# Bounded Contexts (DDD)

## Contexto de Identidade e Contas (Identity & Access)

Cuida exclusivamente de saber quem é a pessoa usando o sistema e garantir a segurança.

### Responsabilidades do cliente

- Registrar novos usuários.
- Realizar login e autenticação.
- Editar as informações do perfil do cliente, incluindo telefone, nome e endereço.
- Concentrar a regra de negócio que impede a edição do e-mail.

## Contexto de Catálogo (Gestão da Barbearia)

É a vitrine e a área de administração do negócio, definindo o que a barbearia oferece e quem trabalha nela.

### Responsabilidades do barbeiro ou administrador

- Adicionar novos barbeiros.
- Editar os serviços oferecidos, como corte, barba e sobrancelha.
- Definir o preço de cada serviço.
- Adicionar fotos.

## Contexto de Agendamento (Scheduling)

É o coração do negócio. Seu foco exclusivo é marcar horários e garantir que não existam conflitos.

### Responsabilidades de agendamento

- Mostrar horários disponíveis.
- Cruzar a disponibilidade do barbeiro com a duração do serviço.
- Criar reservas.
- Permitir que o cliente altere a data ou o horário.
- Permitir o cancelamento do agendamento.

### Elementos do domínio

- **Aggregate Root:** `Agendamento`, responsável por controlar todas as regras da reserva.
- **Entities:**
  - `Cliente`: apenas ID e nome para referência.
  - `Barbeiro`: apenas ID e agenda para referência.
- **Value Objects:**
  - `Horário`: data, hora de início e hora de fim.
  - `StatusAgendamento`: `Pendente`, `Confirmado` ou `Cancelado`.


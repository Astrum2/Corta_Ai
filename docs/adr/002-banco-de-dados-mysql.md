# ADR 002 — Base de Dados MySQL

- **Status:** Aceita
- **Data:** 2026-11-16

## Contexto

O domínio possui relações diretas, como um agendamento pertencente a um cliente e a um barbeiro. A consistência dessas relações é essencial para evitar reservas conflitantes.

## Decisão

Usar o MySQL, um banco de dados relacional, como base principal para os dados do sistema.

## Consequências

### Benefícios

- Integridade referencial entre clientes, barbeiros e agendamentos.
- Maior confiabilidade no controle de reservas e prevenção de *double-booking*.

### Custos e riscos

- A modelagem inicial é mais rígida.
- Alterações no modelo exigem planejamento de schema e migrações.


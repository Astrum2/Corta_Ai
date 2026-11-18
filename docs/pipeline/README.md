# Pipeline CI/CD

O pipeline oficial está em [`../../.github/workflows/pipeline.yaml`](../../.github/workflows/pipeline.yaml).

## Fluxo

- Executa testes para o Backend, o microsserviço de Reviews e o Frontend.
- Usa Node.js 22 e instala as dependências de cada projeto com `npm install`.
- Executa o deploy simulado somente após os testes passarem.
- Aplica uma atualização progressiva (*rolling update*) em pushes para `main` ou `master`.
- Mantém as instâncias antigas disponíveis durante a substituição e prevê rollback em caso de falha.


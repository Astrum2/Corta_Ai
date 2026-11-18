# Operações, Deploy e Runbook

## Estratégia de deploy

API e microsserviços utilizam **Rolling Update (Atualização Progressiva)**:

1. Substituir gradualmente as instâncias antigas pelas novas.
2. Manter instâncias disponíveis durante a atualização, garantindo *zero downtime*.
3. Executar verificações de saúde antes de remover as instâncias antigas.
4. Realizar rollback automático caso a atualização falhe, sem afetar o cliente.

## Runbook de incidentes

### 1. Detecção

Verificar o painel de observabilidade, incluindo logs e métricas, para identificar qual serviço falhou. Priorizar a investigação de erros HTTP `500` e `503`.

### 2. Mitigação

Se a falha ocorrer após um novo deploy, acionar o rollback no pipeline CI/CD para retornar à versão estável.

### 3. Recuperação

Em caso de sobrecarga no MySQL:

- Escalar temporariamente os recursos, aumentando RAM e CPU.
- Reiniciar o serviço afetado.
- Monitorar os indicadores até a normalização.

### 4. Comunicação

Enquanto o incidente estiver sendo resolvido, informar o cliente para realizar agendamentos temporariamente pelo WhatsApp: **55 4499857885**.


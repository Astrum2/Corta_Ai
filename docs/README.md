# Documentação do Corta AI

Documentação arquitetural, operacional e de integração da plataforma Corta AI.

## Estrutura

```text
docs/
├── README.md
├── swagger.yaml
├── adr/
│   ├── 001-separacao-notificacoes.md
│   └── 002-banco-de-dados-mysql.md
├── c4/
│   └── arquitetura.md
├── ddd/
│   └── bounded-contexts.md
├── pipeline/
│   └── README.md
└── sre/
    ├── qualidade-resiliencia-observabilidade.md
    └── runbook.md
```

## Documentos

- [Swagger/OpenAPI](./swagger.yaml): contrato da API HTTP.
- [DDD — Bounded Contexts](./ddd/bounded-contexts.md): limites e responsabilidades dos contextos de domínio.
- [Arquitetura C4](./c4/arquitetura.md): modelos de contexto, containers e visão conceitual.
- [ADRs](./adr/001-separacao-notificacoes.md): decisões arquiteturais registradas.
- [SRE — Qualidade, Resiliência e Observabilidade](./sre/qualidade-resiliencia-observabilidade.md).
- [Runbook de Operações e Incidentes](./sre/runbook.md).
- [Pipeline CI/CD](./pipeline/README.md): referência para o workflow de automação.


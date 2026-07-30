# Changelog

Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.3.0-beta.2] - 2026-07-30

### Adicionado

- `CODEOWNERS` e política formal de governança.
- Guia de adoção e comunicação para desenvolvedores.
- Geração automática de ZIP, pacote npm e checksums em releases.

### Alterado

- GitHub Actions atualizadas para `actions/checkout@v7`, `actions/setup-node@v7` e `github/codeql-action@v4`.
- Processo de release passa a marcar versões beta como pré-release.

### Segurança

- Proteção da branch `main`, checks obrigatórios e atualizações automáticas de segurança habilitados no GitHub.

## [0.3.0-beta.1] - 2026-07-29

### Adicionado

- CLI para compor, validar, renderizar e converter revisões em instruções de correção.
- Políticas modulares para segurança, dados, regressão, arquitetura, criação inicial e código gerado por IA.
- Contratos JSON Schema estritos para configuração e resultados.
- Exclusões por glob, particionamento de diffs grandes e manifesto de cobertura.
- Proteções contra prompt injection em diffs e achados.
- Testes unitários, integração Git e fluxo ponta a ponta.

### Segurança

- Inclusão de diff permanece desabilitada por padrão.
- Conteúdo do repositório é identificado como dado não confiável.

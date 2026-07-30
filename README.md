# AICR Framework

Framework modular e independente de fornecedor para orientar uma IA na revisão de código, validar sua resposta e gerar uma instrução de correção controlada pelo desenvolvedor.

> Status: **beta pública**. O contrato é funcional e testado, mas poderá receber ajustes antes da versão 1.0.

## O que ele faz

- coleta o escopo pelo Git;
- escolhe políticas conforme risco, modo e origem do código;
- compõe uma instrução operacional portátil para a IA usada pelo desenvolvedor;
- valida o relatório JSON com schema estrito;
- transforma o resultado em relatório Markdown;
- gera uma instrução de correção apenas para os achados aceitos.

O framework não chama modelos, não publica comentários em PRs e não altera o código automaticamente. Essa separação mantém o núcleo compatível com Codex, Copilot, Claude, Gemini e outras ferramentas capazes de receber instruções.

## Requisitos

- Node.js 20 ou superior;
- Git no `PATH`;
- repositório Git para `compose`.

## Instalação para desenvolvimento

Na pasta obtida pelo GitHub:

```bash
npm ci
npm link
aicr help
```

Para testar sem instalação global, use `node bin/aicr.mjs` no lugar de `aicr`.

## Fluxo recomendado

```bash
# 1. Inicialize a configuração no projeto que será revisado
aicr init --repo caminho/do/projeto

# 2. Gere a instrução para alterações commitadas
aicr compose --repo caminho/do/projeto --base main --origin ai --output review-prompt.md

# Para revisar toda a implementação inicial, independentemente do número de commits
aicr compose --repo caminho/do/projeto --mode initial --origin ai --output initial-review-prompt.md

# ou inclua alterações locais ainda não commitadas
aicr compose --repo caminho/do/projeto --working-tree --origin mixed --include-diff

# 3. Entregue o prompt à IA e salve a resposta JSON
aicr validate --file review-result.json
aicr report --file review-result.json --output review-report.md

# 4. Após decisão humana, gere a instrução de correção
aicr remediate --file review-result.json --findings F-001,F-003 --output fix-prompt.md
```

Sem `--findings`, `remediate` seleciona achados bloqueantes. `--all` inclui todos os achados.

## Diffs grandes e dados sensíveis

O diff não é incorporado por padrão. Isso é ideal quando a IA já acessa o repositório. `--include-diff` serve para interfaces sem acesso aos arquivos, mas o conteúdo deve ser sanitizado antes do envio a serviços externos.

Se o diff exceder `maxDiffBytes`, `compose` cria `prompt.part-001.md`, `prompt.part-002.md` e assim por diante. O arquivo `prompt.md.json` registra módulos, arquivos e bytes de cada parte para impedir alegação incorreta de cobertura integral.

## Configuração

`.aicr.json` segue `schemas/config.schema.json`. Exemplo:

```json
{
  "$schema": "./.aicr/config.schema.json",
  "mode": "change",
  "origin": "mixed",
  "focus": "general",
  "securityAlways": true,
  "includeDiff": false,
  "maxDiffBytes": 120000,
  "exclude": [".aicr/**", "**/dist/**", "**/build/**", "**/vendor/**", "**/*.min.js"],
  "modules": { "enable": [], "disable": [] }
}
```

Use `aicr modules` para listar módulos. Consulte [Guia de adoção](docs/ADOPTION.md), [Arquitetura](docs/ARCHITECTURE.md), [Modelo de ameaça](docs/THREAT_MODEL.md), [Governança](docs/GOVERNANCE.md), [Contribuição](CONTRIBUTING.md) e [Segurança](SECURITY.md).

## Limites conhecidos

- A qualidade depende do modelo, do contexto e do código acessível.
- Validação estrutural não prova que um achado é verdadeiro.
- Partes de uma revisão grande precisam ser consolidadas com decisão humana.
- A aprovação da IA não substitui testes, CI nem aprovação responsável.

Licenciado sob Apache-2.0.

# Arquitetura

O AICR separa política, orquestração e apresentação para permitir evolução sem acoplamento a um modelo.

```text
Git + .aicr.json
       |
       v
collector -> filter/batcher -> router -> compiler -> prompt(s)
                                                |
                                                v
                                           IA escolhida
                                                |
                                                v
JSON -> schema validator -> Markdown report -> seleção humana -> remediation prompt
```

## Componentes

- `policies/`: regras operacionais e módulos de revisão.
- `src/git.mjs`: coleta, normalização, exclusão e divisão do diff.
- `src/router.mjs`: seleção determinística dos módulos.
- `src/compiler.mjs`: composição do prompt e limites de confiança.
- `schemas/`: contratos versionáveis de configuração e resposta.
- `src/validator.mjs`: validação estrita baseada em JSON Schema.
- `src/report.mjs`: apresentação humana sem alterar o conteúdo semântico.
- `src/remediation.mjs`: instrução de correção restrita aos IDs aceitos.
- `bin/aicr.mjs`: interface de linha de comando e tratamento de erros.

## Princípios

O núcleo é vendor-neutral, a decisão final é humana, evidência executada não pode ser confundida com inferência estática e todo conteúdo proveniente do repositório é não confiável.

No modo de criação inicial, o coletor grava somente o objeto Git imutável de árvore vazia, quando necessário, para comparar toda a implementação. Nenhum arquivo, commit, branch, índice ou referência é alterado.

Adaptadores futuros para GitHub, GitLab, Azure DevOps ou modelos devem consumir os mesmos schemas e não duplicar as políticas.

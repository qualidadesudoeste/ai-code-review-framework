# Governança

## Responsabilidade

`@qualidadesudoeste` é o mantenedor e proprietário inicial do framework. Alterações em código, políticas, schemas, automações e releases exigem revisão do proprietário definido em `.github/CODEOWNERS`.

## Processo de mudança

- Mudanças entram por pull request; push direto na branch `main` não é o fluxo normal.
- CI e CodeQL devem concluir com sucesso.
- Conversas de revisão devem ser resolvidas antes do merge.
- Mudanças incompatíveis em CLI, configuração ou schemas exigem documentação e versão principal apropriada.
- Correções de segurança seguem `SECURITY.md` e podem usar divulgação coordenada.

## Releases

O projeto segue Versionamento Semântico. Tags devem corresponder ao campo `version` do `package.json`. Versões beta são pré-releases; a versão `1.0.0` depende de validação corporativa e estabilização dos contratos.

## Evolução da propriedade

Quando novos mantenedores forem designados, `CODEOWNERS`, esta política e os canais privados de segurança devem ser atualizados no mesmo pull request.

# Publicação no GitHub

## Decisões do proprietário

Antes da primeira publicação, confirme:

- organização ou conta proprietária;
- nome definitivo do repositório;
- licença Apache-2.0 com a área jurídica da empresa;
- responsáveis por manutenção e relatos privados de segurança;
- se o pacote também será publicado no npm e se `aicr-framework` é o nome desejado.

## Primeira publicação

```bash
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
git tag v0.3.0-beta.1
git push origin v0.3.0-beta.1
```

A tag executa testes, valida que a tag corresponde ao `package.json`, monta o pacote e cria uma GitHub Release com o `.tgz` anexado.

## Configurações recomendadas no GitHub

- habilitar **Private vulnerability reporting**;
- habilitar Discussions se desejar suporte comunitário;
- proteger `main` exigindo CI e CodeQL;
- exigir ao menos uma aprovação e resolução de conversas;
- impedir force push e exclusão de `main`;
- permitir que Dependabot abra pull requests;
- definir os mantenedores responsáveis.

## Publicação npm opcional

A automação atual cria o pacote, mas não o envia ao npm. Antes de habilitar isso, confirme propriedade do nome, política de acesso, proveniência, 2FA e uso de trusted publishing. A distribuição pelo GitHub funciona sem npm.

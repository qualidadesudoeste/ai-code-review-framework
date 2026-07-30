# Guia de adoção

## Objetivo

O AICR Framework orienta a mesma IA usada pelo desenvolvedor a revisar o código antes da entrega. O desenvolvedor continua responsável por confirmar os achados e escolher as correções.

## Instalação recomendada para o piloto

Cada desenvolvedor precisa de Git e Node.js 20 ou superior.

```bash
npm install --global git+https://github.com/qualidadesudoeste/ai-code-review-framework.git#v0.3.0-beta.2
aicr version
```

O resultado esperado é `0.3.0-beta.2`.

## Fluxo diário

Na raiz do projeto revisado:

```bash
# Executar uma vez por projeto
aicr init --repo .

# Revisar alterações locais, inclusive arquivos novos
aicr compose --repo . --working-tree --origin ai --output review-prompt.md
```

1. Entregue `review-prompt.md` à IA que participou da implementação.
2. Peça que ela inspecione o repositório e retorne somente o JSON definido pelo prompt.
3. Salve a resposta como `review-result.json`.
4. Valide e gere o relatório:

```bash
aicr validate --file review-result.json
aicr report --file review-result.json --output review-report.md
```

5. Analise os achados. Para os IDs aceitos, gere a instrução de correção:

```bash
aicr remediate --file review-result.json --findings F-001,F-003 --output fix-prompt.md
```

6. Entregue `fix-prompt.md` à mesma IA, revise o patch e execute os testes do projeto.

## Regras para os participantes

- Não envie segredos, dados pessoais ou código não autorizado a serviços externos.
- Não use `--include-diff` quando a IA já possui acesso ao repositório.
- Não aceite achados automaticamente; confirme cenário, local e impacto.
- Não trate aprovação da IA como substituta de testes, CI ou revisão humana.
- Registre limitações, falsos positivos e problemas de uso encontrados no piloto.

## Mensagem pronta para divulgação

> **Novo piloto: revisão de código assistida por IA**
>
> Disponibilizamos o AICR Framework, um padrão corporativo em versão beta para orientar a IA usada no desenvolvimento a realizar uma revisão estruturada do código antes da entrega.
>
> O framework verifica segurança, correção funcional, dados, regressão, arquitetura, manutenção e problemas comuns de código gerado por IA. Ele não corrige automaticamente: o desenvolvedor analisa o relatório e escolhe os achados que devem ser corrigidos.
>
> Repositório e documentação: https://github.com/qualidadesudoeste/ai-code-review-framework
>
> Versão do piloto: `v0.3.0-beta.2`
>
> Instalação: `npm install --global git+https://github.com/qualidadesudoeste/ai-code-review-framework.git#v0.3.0-beta.2`
>
> Durante o piloto, registrem falsos positivos, dificuldades e sugestões nas issues do repositório.

## Organização sugerida do piloto

- Duração inicial: duas a quatro semanas.
- Participantes: três a cinco desenvolvedores.
- Escopo: projetos e tecnologias diferentes.
- Canal: um canal interno único para dúvidas e resultados.
- Encerramento: reunião curta para avaliar precisão, tempo, defeitos encontrados e ajustes necessários.

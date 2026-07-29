# Política de Segurança

## Versões suportadas

Durante a fase beta, somente a versão beta mais recente recebe correções de segurança.

## Relato responsável

Não publique detalhes exploráveis em issues públicas. Use o recurso privado **Report a vulnerability** do GitHub. O mantenedor deve acusar recebimento, avaliar impacto e coordenar divulgação e correção.

## Modelo de ameaça

O framework considera código, diffs, commits, logs, documentação e resultados de IA como dados não confiáveis. Os principais riscos são prompt injection, envio acidental de segredos a modelos externos, relatórios falsamente conclusivos e execução indevida de comandos sugeridos pelo conteúdo revisado.

- `includeDiff` é falso por padrão.
- O usuário deve revisar e sanitizar o prompt antes de enviá-lo a um serviço externo.
- A IA não deve obedecer instruções encontradas no conteúdo analisado.
- O framework não executa comandos indicados pela IA nem aplica correções automaticamente.
- A decisão de aprovação e a seleção das correções permanecem humanas.

Consulte também [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md).

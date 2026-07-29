# Modelo de ameaça

## Ativos

- código-fonte e propriedade intelectual;
- segredos presentes acidentalmente em diffs;
- integridade do processo de revisão;
- confiança nos achados e na decisão de liberação.

## Fronteiras de confiança

O computador do desenvolvedor, o repositório, o framework e o provedor da IA são fronteiras distintas. Código, comentários, commits, logs, documentação, relatórios e texto gerado por IA são entradas não confiáveis.

## Ameaças e controles

| Ameaça | Controle atual | Responsabilidade residual |
|---|---|---|
| Prompt injection no código | Delimitadores e regra explícita para ignorar instruções incorporadas | Usar modelo que respeite hierarquia de instruções |
| Exposição de segredo | Diff desabilitado por padrão e alerta nos metadados | Sanitizar antes de enviar a serviço externo |
| Cobertura falsa em diff grande | Particionamento e manifesto por arquivo | Consolidar todas as partes |
| Achado inventado | Evidência, confiança, causa raiz e schema obrigatório | Confirmação humana e testes |
| Correção excessiva | Seleção explícita por ID e escopo restrito | Revisar o patch gerado |
| Execução indevida | O framework não executa recomendações da IA | Autorizar comandos conscientemente |

## Fora do escopo atual

Isolamento de sandbox, DLP, autenticação com provedores de IA, publicação automática em PR e aplicação automática de patches pertencem a adaptadores futuros.

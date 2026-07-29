# Módulo 06 — Código Gerado por IA

Use para origem `IA`, `MISTO` ou `DESCONHECIDO`, sem presumir defeito pela origem.

- Procure duplicação com variações que possam divergir.
- Procure funções, classes, imports, exports, rotas, handlers, arquivos e dependências sem uso.
- Procure código morto, branches inalcançáveis, fallbacks ocultos e flags permanentes.
- Procure tratamento de erro genérico copiado, sucesso falso e perda de causa.
- Verifique alucinação de API: símbolos inexistentes, propriedades inventadas, assinatura ou parâmetro incompatível e recurso ausente na versão instalada.
- Confirme APIs por tipos, fonte, manifest, lockfile ou documentação da versão; não confie na memória do modelo.
- Verifique inconsistência entre arquivos, tipos, contratos, schemas, validações, eventos e nulabilidade.
- Procure pacote ausente, redundante ou adicionado para recurso já existente.
- Procure TODO, FIXME, stub, placeholder, `NotImplemented`, retorno constante, dado fictício, mock e bypass em produção.
- Verifique comentário ou documentação divergente do código.
- Procure padrão copiado sem adaptar regra, tipo, autorização, transação ou erro.
- Procure wrapper sem valor, generalização especulativa e camadas que escondem o fluxo.
- Verifique teste tautológico, mock sem contrato e asserção que sempre passa.
- Verifique atualização conjunta de implementação, contrato, teste, schema, migração e configuração.

# Módulo 04 — Arquitetura, Manutenibilidade e Entrega

- Verifique aderência à arquitetura e aos padrões realmente existentes no projeto.
- Verifique limites, direção de dependências, coesão, acoplamento, estado global e efeitos colaterais.
- Procure regras duplicadas que possam divergir e abstrações especulativas.
- Verifique interfaces programáticas, encapsulamento, parâmetros, retornos, status HTTP, OpenAPI e versionamento.
- Procure código morto, TODO/FIXME, flags temporárias e caminhos incompletos.
- Verifique comentários e documentação apenas quanto à correção técnica e restrições relevantes.
- Verifique configuração por ambiente, defaults seguros, validação, secrets e feature flags.
- Verifique dependências, lockfiles, breaking changes, scripts de build e runtime.
- Verifique artefatos versionados para empacotamento, migração, implantação e rollback sem afirmar execução.
- Verifique contratos, schemas, dicionário de dados e exemplos afetados.
- Para dados pessoais, verifique minimização, base/finalidade aplicável, retenção, exclusão e auditoria no código.
- Diferencie constante legítima de configuração variável; não trate todo literal como hardcode.

# Módulo 03 — Dados, Concorrência, Integrações e Confiabilidade

- Verifique tipos, nulabilidade, unicidade, constraints, relacionamentos e integridade referencial.
- Verifique transações, atomicidade, atualização parcial, lost update, duplicidade, órfãos e idempotência.
- Verifique migração progressiva, dados existentes, compatibilidade entre versões e rollback.
- Procure update/delete amplo, consulta sem filtro e paginação não determinística.
- Procure race condition, check-then-act, deadlock, lock excessivo e recursos compartilhados inseguros.
- Em filas e jobs, verifique deduplicação, ordem, retry, backoff, ack, dead-letter e reprocessamento.
- Em integrações, verifique timeout, cancelamento, respostas parciais/duplicadas/inválidas e consistência entre sistemas.
- Verifique erros engolidos, catch genérico, sucesso falso, fallback silencioso e liberação de recursos.
- Verifique logs estruturados, correlação, métricas, health checks e sinais operacionais sem dados sensíveis.
- Procure N+1, I/O em loop, chamadas repetidas, complexidade incompatível, materialização excessiva e vazamento de recursos.
- Avalie cache por chave, expiração, invalidação e coerência; não recomende cache especulativo.
- Compare performance apenas com SLA, baseline, volume e ambiente conhecidos.

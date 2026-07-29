# Módulo 02 — Segurança

Avalie separadamente:

1. **Autenticação e autorização:** autenticação por operação; ownership; isolamento de tenant; BOLA; BFLA; bypass por endpoint ou método alternativo.
2. **Entrada e serialização:** tipo, formato, tamanho, allowlist, campos inesperados, traversal, uploads, `pickle`, `BinaryFormatter`, Java Serialization, `ObjectInputStream`, YAML inseguro, eval e carregamento dinâmico.
3. **Injeções:** SQL/NoSQL, command/argument, template, LDAP, expression language, XSS e open redirect. Prefira parametrização e tratamento contextual; não recomende sanitização genérica.
4. **SSRF:** URLs controladas pelo usuário, download por URL, webhooks, fetch remoto, importadores, previews e proxies; verifique esquema, DNS, redirects, IPs privados/link-local e metadados de nuvem.
5. **Dados:** exposição excessiva em DTOs, GraphQL, eventos, logs, erros, cache e filas; enumeração; mascaramento; retenção; vazamento entre tenants.
6. **Secrets:** AWS, Azure, Google Cloud, GitHub, GitLab, JWT, API keys, senhas, connection strings, private keys e certificados com chave. Não reproduza valores; recomende rotação.
7. **Criptografia:** MD5/SHA-1 em segurança, DES/3DES, RC4, ECB, PRNG não criptográfico, armazenamento de senhas, IV/nonce, chaves e comparação sensível. Não sinalize checksum não adversarial sem impacto.
8. **Sessões/tokens:** assinatura, algoritmo, issuer, audience, expiração, algoritmo `none`, revogação, replay, refresh, cookies, CSRF, brute force e enumeração.
9. **APIs:** BOLA, BFLA, Mass Assignment, Excessive Data Exposure, validação, payload, rate limit, profundidade/custo GraphQL e autenticação/replay de webhooks.
10. **Supply chain:** vulnerabilidades confirmadas, abandono, versões não fixadas, lockfile, URLs/GitHub, registry não aprovado, pacote não oficial, typosquatting, dependency confusion e scripts de instalação.
11. **Configuração:** CORS, TLS, headers, debug, stacks, consoles administrativos, credenciais padrão, privilégios, root, portas, rede, buckets e defaults inseguros.

Use scanner ou advisory quando disponível. Sem acesso atual, não invente vulnerabilidade ou estado de manutenção.

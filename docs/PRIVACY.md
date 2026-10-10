# Privacy Policy — Food App

**Last updated:** 2026-10-10  
**Version:** 1.0.0  
**Data protection compliance level:** Basic (LGPD / GDPR aligned)

---

## 1. Introdução

Este documento descreve como o **Food App** coleta, usa e protege os dados dos usuários,
em conformidade com a **Lei Geral de Proteção de Dados (LGPD)** (Lei 13.709/2018) e o
**Regulamento Geral de Proteção de Dados (GDPR)** (UE 2016/679).

O Food App é um aplicativo móvel de demonstração (portfolio project) que exibe ofertas
de alimentos. **Nenhum dado pessoal é coletado, armazenado ou transmitido em servidor no momento.**

---

## 2. Base Legal (LGPD Art. 7º)

| Finalidade | Base Legal | Justificativa |
|---|---|---|
| Exibição de ofertas de alimentos | Não há processamento de dados pessoais | App utiliza dados estáticos embutidos no binário |
| Cache local de preferências do usuário | Não aplicável (Nenhum dado coletado) | Nenhum dado é armazenado localmente em versão atual |

> **Nota:** A base legal "consentimento" será necessária quando o app evoluir para
> incluir autenticação de usuários ou coleta de dados de pedido.

---

## 3. Dados Coletados

### 3.1 Dados que NÃO coletamos (atualmente)

| Categoria | Status | Motivo |
|---|---|---|
| Dados pessoais (nome, email, endereço) | ❌ Não coletado | App é uma demo sem backend |
| Dados de localização | ❌ Não coletado | Nenhuma permissão de localização solicitada |
| Dados de navegação | ❌ Não coletado | Nenhum tracking ou analytics ativo |
| Histórico de pedidos | ❌ Não coletado | Nenhuma funcionalidade de pedido implementada |
| Dados de pagamento | ❌ Não coletado | Nenhuma integração de pagamento |

### 3.2 Dados de uso (desenvolvimento)

| Categoria | Coletado? | Propósito |
|---|---|---|
| Logs de console | ⚠️ Apenas em `__DEV__` | Depuração durante desenvolvimento |
| Crash logs (Sentry) | Opcional via MCP | Correção de bugs (não ativo por padrão) |

> Todos os `console.log` e `console.error` são **desativados em builds de produção**
> via `__DEV__` guards. Veja: [ADR-002](./adr/002-error-boundary-and-safe-failure.md)

---

## 4. Princípio do Mínimo Privilégio

O app segue o princípio de coletar apenas o estritamente necessário:

- **Atualmente:** Nenhum dado coletado
- **Futuro (auth):** Apenas dados necessários para a funcionalidade (ex: email + senha hash)
- **Futuro (pedidos):** Apenas dados necessários para processar o pedido

---

## 5. Compartilhamento de Dados

| Destinatário | Dados Compartilhados | Finalidade | Base Legal |
|---|---|---|---|
| Expo / Apple App Store | Nenhum (app estático) | Distribuição do app | Tarefa de portfólio |
| Sentry (opcional) | Stack traces sanitizados | Correção de bugs | Legítimo interesse |
| Nenhum terceiro | N/A | N/A | N/A |

---

## 6. Retenção de Dados

Como nenhum dado pessoal é coletado, a política de retenção é:

- **Dados de usuário:** Nenhum dado é armazenado
- **Logs de desenvolvimento:** Não persistidos em disco
- **Dados de build:** Versionados no repositório (código-fonte apenas)

**Direito ao esquecimento:** Como nenhum dado pessoal é coletado, não há
necessidade de implementar mecanismos de exclusão.

---

## 7. Segurança dos Dados

### 7.1 Criptografia
- **Em trânsito:** HTTPS/TLS via Expo (quando houver backend)
- **Em repouso:** Dados estáticos embutidos no binário do app (não criptografados, mas não mutáveis)

### 7.2 Controle de Acesso
- Nenhuma credencial ou token é armazenado no app
- `.gitignore` bloqueia arquivos `.env*`
- `.env.example` não contém valores reais

### 7.3 Testes de Segurança
- **Secret scanning:** Jest test escaneia toda a base de código em cada CI
- **Dependency audit:** `audit-ci --high` falha o pipeline em novas vulnerabilidades
- **SAST:** CodeQL analisa código em cada push/PR
- **Schema validation:** Zod valida todos os dados estáticos em runtime

---

## 8. Direitos do Usuário (LGPD Art. 18)

Como o app atualmente não coleta dados pessoais, os direitos do usuário
(art. 18 da LGPD) são teoricamente aplicáveis futuramente:

| Direito | Implementação Futura |
|---|---|
| Confirmação da existência de tratamento | API `/account` retornará dados do usuário autenticado |
| Acesso aos dados | Endpoint `/users/me` |
| Correção de dados incompletos/inexatos | PATCH `/users/me` |
| Eliminação | DELETE `/users/me` (direito ao esquecimento) |
| Portabilidade | Exportação JSON via `/users/me/export` |
| Revogação do consentimento | DELETE `/users/session` (logout) |

---

## 9. Para Perguntas ou Relatar Problemas

- **E-mail:** security@viniciusdilly.dev
- **GitHub Security Advisories:** [Report a Vulnerability](https://github.com/mvdevelop/food-app/security/advisories/new)
- **Tempo de resposta:** Dentro de 48 horas

---

## 10. Mudanças nesta Política

Esta política será atualizada quando:
- Funcionalidades que coletam dados pessoais forem adicionadas
- Novas dependências que processam dados forem introduzidas
- Mudanças na legislação forem necessárias

Notificações de mudança serão feitas via commit no repositório.

---

**⚠️ Aviso Importante:** Este projeto é um **portfolio demonstrativo**. A coleta de dados
pessoais só será implementada com base legal clara (consentimento), consentimento
explícito e mecanismos de revogação, conforme exigido pela LGPD.

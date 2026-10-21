# Food App — Status de Implementação

Atualizado em: 2026-10-20
Branch: `main`

## Estado atual

O projeto passou pelas etapas principais de evolução visual e funcional:

- Home marketplace inspirada em apps de delivery
- Categorias, busca e ofertas promocionais
- Tela de restaurante e itens de menu
- Carrinho global
- Checkout com endereço, pagamento mockado e instruções
- Criação de pedido no `json-server`
- Acompanhamento de pedido com timeline
- Login mockado e sessão em memória
- Perfil, logout e favoritos
- Reviews/comentários carregados do mock backend
- Combos
- Personalização de itens com adicionais
- Cupons promocionais
- Google Maps preparado para build nativo
- Fallback web para mapa
- Navegação por abas
- Timeout e `ApiError` na camada de API
- Bundle web validado

## Verificações aprovadas

```bash
npm run type-check
npm run lint
npm test -- --runInBand
npx expo export --platform web --output-dir .expo-export-check
```

A suíte atual possui 1037 testes aprovados.

## Pendências prioritárias

### 1. Backend mock e dados

- [ ] Confirmar execução documentada do `json-server` em ambiente Windows.
- [ ] Adicionar schemas Zod para respostas de usuários, pedidos, reviews, combos, cupons e endereços retornados pela API.
- [ ] Criar camada de normalização para imagens referenciadas por string no `db.json`.
- [ ] Adicionar endpoint/rotina de health check do mock backend.
- [ ] Definir estratégia de reset dos dados do `db.json` após testes de criação de pedidos.
- [ ] Separar credenciais demo de qualquer fluxo que venha a simular produção; o login atual é exclusivamente demonstrativo.

### 2. Autenticação e persistência

- [ ] Persistir sessão com armazenamento seguro no dispositivo.
- [ ] Implementar cadastro, recuperação de senha e expiração de sessão quando houver backend real.
- [ ] Substituir senha em texto no mock por uma representação explicitamente marcada como fixture de desenvolvimento.
- [ ] Adicionar proteção de rotas autenticadas.

### 3. Pedidos e checkout

- [ ] Persistir o pedido criado no estado da tela de pedidos imediatamente após o checkout.
- [ ] Mostrar o pedido recém-criado em vez de depender apenas do pedido fixo `order-10482`.
- [ ] Conectar alterações reais de status ao mock backend.
- [ ] Implementar aplicação do cupom `FRETEGRATIS`.
- [ ] Validar cupons por API, em vez de validar somente `BEMVINDO10` localmente.
- [ ] Melhorar diferenciação de linhas do carrinho com adicionais e permitir editar extras depois de adicionados.
- [ ] Adicionar validações de endereço, pagamento e observações antes de confirmar o pedido.

### 4. Google Maps

- [ ] Configurar chave real do Google Maps via secrets do Expo/EAS para Android e iOS.
- [ ] Confirmar configuração nativa em `app.json`/config plugin sem commitar chaves.
- [ ] Usar coordenadas reais vindas dos restaurantes do backend.
- [ ] Adicionar interação marcador → detalhe do restaurante.
- [ ] Avaliar implementação web separada caso o mapa também seja necessário no navegador.
- [ ] Testar em dispositivo/emulador nativo; o bundle web não deve importar `react-native-maps`.

### 5. Navegação e UX

- [ ] Remover ou consolidar rotas duplicadas entre `app/index.tsx` e `app/(tabs)/index.tsx` quando a arquitetura estiver estabilizada.
- [ ] Remover rotas de compatibilidade antigas após confirmar todos os links.
- [ ] Corrigir o warning de foco `aria-hidden` observado no React Native Web durante transições.
- [ ] Adicionar estados de loading/skeleton nas telas que consultam a API.
- [ ] Adicionar toasts/feedback não bloqueante para favoritos, cupons e itens adicionados.
- [ ] Melhorar acessibilidade de foco/teclado no web.
- [ ] Validar layouts em telas pequenas, tablets e desktop web.

### 6. Testes e qualidade

- [ ] Adicionar testes para reducer do carrinho com adicionais.
- [ ] Adicionar testes para cálculo de subtotal, entrega, descontos e total.
- [ ] Adicionar testes para login bem-sucedido, login inválido e logout.
- [ ] Adicionar testes para `api.ts`, incluindo timeout, status HTTP e fallback offline.
- [ ] Adicionar testes para timeline de pedidos e reviews.
- [ ] Adicionar teste de export web para evitar regressão de imports nativos.
- [ ] Executar `npm run coverage` e revisar cobertura das novas telas.
- [ ] Executar `npm run audit:ci` e revisar vulnerabilidades do ambiente de desenvolvimento.
- [ ] Executar `npm run format:check`; existem arquivos históricos fora do padrão Prettier.

### 7. Documentação

- [ ] Atualizar README com os fluxos implementados.
- [ ] Documentar execução simultânea do Expo e `json-server`.
- [ ] Documentar credenciais demo e deixar claro que não são autenticação real.
- [ ] Documentar configuração de Google Maps no EAS.
- [ ] Criar ADR sobre a separação web/native do mapa.
- [ ] Criar ADR sobre o mock backend e a futura substituição por API real.

## Como retomar

1. Verificar `git status --short` e preservar alterações locais existentes.
2. Instalar dependências com `npm ci` se necessário.
3. Terminal 1: `npm run mock-api`.
4. Terminal 2: `npm start` ou `npm run web`.
5. Rodar `npm run type-check`, `npm run lint` e `npm test -- --runInBand` antes de novas alterações.
6. Trabalhar na próxima etapa começando pelas pendências de checkout/pedidos e testes do carrinho.

## Restrições mantidas

- Permanecer na branch `main`.
- Não criar outra branch.
- Não criar outro diretório do projeto.
- Não commitar chaves, tokens ou credenciais reais.
- Manter o fallback web sem import direto de `react-native-maps`.

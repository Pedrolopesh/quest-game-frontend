# Quest Game

Quiz em 3 fases (Exatas, Humanas e Natureza) com ranking. Front em **Vue 3 + Vite + TypeScript**, API em [quest-game-api](https://github.com/Pedrolopesh/quest-game-api).

- Login sem senha (código de 6 dígitos no e-mail).
- Partida em 3 fases de 3 perguntas: fácil vale 100, média 200 e difícil 300 pontos. A correção é feita na API.
- Ranking com pódio, perfil com apelido e estatísticas, e painel de questões para admins.

## Rodando local

```bash
cp .env.example .env.local   # VITE_API_URL=http://localhost:3335
npm ci
npm run dev                  # http://localhost:8081
```

## Verificações

```bash
npm run lint && npm test && npm run build
```

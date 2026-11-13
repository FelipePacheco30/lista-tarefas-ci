# Lista de Tarefas — exemplo de CI com GitHub Actions

Aplicação web simples (CRUD de tarefas com Node.js e Express) usada para demonstrar um
pipeline de integração contínua com GitHub Actions.

## Scripts

| Comando                    | O que faz                                  |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | Inicia a aplicação em modo desenvolvimento |
| `npm run lint`             | Análise estática com ESLint                |
| `npm run format:check`     | Verifica a formatação com Prettier         |
| `npm run build`            | Gera o bundle de produção em `dist/`       |
| `npm run test:unit`        | Testes unitários (Vitest)                  |
| `npm run test:integration` | Testes de integração da API (Supertest)    |

## Docker

```bash
npm run build
docker build -t lista-tarefas-ci .
docker run -p 3000:3000 lista-tarefas-ci
```

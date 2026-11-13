import { criarApp } from './app.js';

const porta = Number(process.env.PORT ?? 3000);
const servidor = criarApp().listen(porta, () => {
  console.info(`Servidor rodando em http://localhost:${porta}`);
});

process.on('SIGTERM', () => servidor.close(() => process.exit(0)));

import express from 'express';
import path from 'node:path';
import { criarRepositorio } from './repositorio.js';
import { ErroValidacao, validarTarefa } from './tarefa.js';

const pastaPublica = path.join(process.cwd(), 'public');

export function criarApp(repositorio = criarRepositorio()) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.static(pastaPublica));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/tarefas', (req, res) => {
    const filtro = req.query.concluida;
    const tarefas = repositorio.listar();
    if (filtro === undefined) return res.json(tarefas);
    res.json(tarefas.filter((tarefa) => String(tarefa.concluida) === filtro));
  });

  app.get('/api/tarefas/:id', (req, res) => {
    const tarefa = repositorio.buscar(Number(req.params.id));
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
    res.json(tarefa);
  });

  app.post('/api/tarefas', (req, res) => {
    res.status(201).json(repositorio.criar(validarTarefa(req.body)));
  });

  app.put('/api/tarefas/:id', (req, res) => {
    const tarefa = repositorio.atualizar(Number(req.params.id), validarTarefa(req.body));
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
    res.json(tarefa);
  });

  app.delete('/api/tarefas/:id', (req, res) => {
    if (!repositorio.remover(Number(req.params.id))) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.status(204).end();
  });

  app.use((erro, _req, res, _next) => {
    if (erro instanceof ErroValidacao) return res.status(400).json({ erros: erro.erros });
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });

  return app;
}

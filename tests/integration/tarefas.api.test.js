import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { criarApp } from '../../src/app.js';

describe('API /api/tarefas', () => {
  let app;

  beforeEach(() => {
    app = criarApp();
  });

  it('GET /health responde ok', async () => {
    const resposta = await request(app).get('/health');
    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ status: 'ok' });
  });

  it('POST cria uma tarefa', async () => {
    const resposta = await request(app).post('/api/tarefas').send({ titulo: 'Configurar CI' });
    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({ id: 1, titulo: 'Configurar CI', concluida: false });
  });

  it('POST retorna 400 com os erros de validação', async () => {
    const resposta = await request(app).post('/api/tarefas').send({ titulo: 'a' });
    expect(resposta.status).toBe(400);
    expect(resposta.body.erros).toHaveLength(1);
  });

  it('POST retorna 400 quando o corpo não é um JSON válido', async () => {
    const resposta = await request(app)
      .post('/api/tarefas')
      .set('Content-Type', 'application/json')
      .send('{"titulo": ');
    expect(resposta.status).toBe(400);
  });

  it('GET lista e busca tarefas por id', async () => {
    await request(app).post('/api/tarefas').send({ titulo: 'Configurar CI' });
    expect((await request(app).get('/api/tarefas')).body).toHaveLength(1);
    expect((await request(app).get('/api/tarefas/1')).body.titulo).toBe('Configurar CI');
    expect((await request(app).get('/api/tarefas/99')).status).toBe(404);
  });

  it('PUT atualiza uma tarefa', async () => {
    await request(app).post('/api/tarefas').send({ titulo: 'Configurar CI' });
    const resposta = await request(app)
      .put('/api/tarefas/1')
      .send({ titulo: 'Configurar CI', concluida: true });
    expect(resposta.status).toBe(200);
    expect(resposta.body.concluida).toBe(true);
  });

  it('DELETE remove a tarefa e responde 204', async () => {
    await request(app).post('/api/tarefas').send({ titulo: 'Configurar CI' });
    expect((await request(app).delete('/api/tarefas/1')).status).toBe(204);
    expect((await request(app).delete('/api/tarefas/1')).status).toBe(404);
  });

  it('serve a interface web na raiz', async () => {
    const resposta = await request(app).get('/');
    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain('Lista de Tarefas');
  });
});

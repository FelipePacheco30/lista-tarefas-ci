import { beforeEach, describe, expect, it } from 'vitest';
import { criarRepositorio } from '../../src/repositorio.js';

describe('repositório em memória', () => {
  let repositorio;

  beforeEach(() => {
    repositorio = criarRepositorio();
  });

  it('cria tarefas com ids sequenciais', () => {
    expect(repositorio.criar({ titulo: 'A' }).id).toBe(1);
    expect(repositorio.criar({ titulo: 'B' }).id).toBe(2);
  });

  it('lista e busca as tarefas criadas', () => {
    const tarefa = repositorio.criar({ titulo: 'A' });
    expect(repositorio.listar()).toEqual([tarefa]);
    expect(repositorio.buscar(tarefa.id)).toEqual(tarefa);
  });

  it('retorna null ao buscar ou atualizar id inexistente', () => {
    expect(repositorio.buscar(99)).toBeNull();
    expect(repositorio.atualizar(99, { titulo: 'X' })).toBeNull();
  });

  it('atualiza e remove uma tarefa', () => {
    const { id } = repositorio.criar({ titulo: 'A', concluida: false });
    expect(repositorio.atualizar(id, { titulo: 'A', concluida: true }).concluida).toBe(true);
    expect(repositorio.remover(id)).toBe(true);
    expect(repositorio.listar()).toEqual([]);
  });
});

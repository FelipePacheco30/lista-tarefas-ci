export function criarRepositorio() {
  const tarefas = new Map();
  let proximoId = 1;

  return {
    listar: () => [...tarefas.values()],
    buscar: (id) => tarefas.get(id) ?? null,
    criar(dados) {
      const tarefa = { id: proximoId++, ...dados };
      tarefas.set(tarefa.id, tarefa);
      return tarefa;
    },
    atualizar(id, dados) {
      if (!tarefas.has(id)) return null;
      const tarefa = { id, ...dados };
      tarefas.set(id, tarefa);
      return tarefa;
    },
    remover: (id) => tarefas.delete(id),
  };
}

const lista = document.querySelector('#lista');
const form = document.querySelector('#form');
const campo = document.querySelector('#titulo');
const erro = document.querySelector('#erro');

async function api(caminho, opcoes = {}) {
  const resposta = await fetch(`/api/tarefas${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  if (resposta.status === 204) return null;
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.erros?.join(', ') ?? corpo.erro);
  return corpo;
}

async function carregar() {
  const tarefas = await api('');
  lista.replaceChildren(
    ...tarefas.map((tarefa) => {
      const item = document.createElement('li');
      item.className = tarefa.concluida ? 'concluida' : '';

      const marcador = document.createElement('input');
      marcador.type = 'checkbox';
      marcador.checked = tarefa.concluida;
      marcador.addEventListener('change', async () => {
        await api(`/${tarefa.id}`, {
          method: 'PUT',
          body: JSON.stringify({ titulo: tarefa.titulo, concluida: marcador.checked }),
        });
        carregar();
      });

      const texto = document.createElement('span');
      texto.textContent = tarefa.titulo;

      const remover = document.createElement('button');
      remover.textContent = 'Excluir';
      remover.addEventListener('click', async () => {
        await api(`/${tarefa.id}`, { method: 'DELETE' });
        carregar();
      });

      item.append(marcador, texto, remover);
      return item;
    }),
  );
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('', { method: 'POST', body: JSON.stringify({ titulo: campo.value }) });
    erro.textContent = '';
    campo.value = '';
    carregar();
  } catch (e) {
    erro.textContent = e.message;
  }
});

carregar();

export class ErroValidacao extends Error {
  constructor(erros) {
    super('Dados inválidos');
    this.erros = erros;
  }
}

export function validarTarefa(dados) {
  const erros = [];
  const titulo = typeof dados?.titulo === 'string' ? dados.titulo.trim() : '';

  if (titulo.length < 3) erros.push('O título deve ter pelo menos 3 caracteres');
  if (titulo.length > 100) erros.push('O título deve ter no máximo 100 caracteres');
  if (dados?.concluida !== undefined && typeof dados.concluida !== 'boolean') {
    erros.push('O campo concluida deve ser verdadeiro ou falso');
  }

  if (erros.length > 0) throw new ErroValidacao(erros);
  return { titulo, concluida: dados.concluida ?? false };
}

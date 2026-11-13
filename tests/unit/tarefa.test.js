import { describe, expect, it } from 'vitest';
import { ErroValidacao, validarTarefa } from '../../src/tarefa.js';

describe('validarTarefa', () => {
  it('aceita um título válido e marca a tarefa como pendente', () => {
    expect(validarTarefa({ titulo: 'Estudar CI' })).toEqual({
      titulo: 'Estudar CI',
      concluida: false,
    });
  });

  it('remove espaços extras do título', () => {
    expect(validarTarefa({ titulo: '  Estudar CI  ' }).titulo).toBe('Estudar CI');
  });

  it('mantém o valor de concluida quando informado', () => {
    expect(validarTarefa({ titulo: 'Estudar CI', concluida: true }).concluida).toBe(true);
  });

  it('rejeita título com menos de 3 caracteres', () => {
    expect(() => validarTarefa({ titulo: 'ab' })).toThrow(ErroValidacao);
  });

  it('rejeita título com mais de 100 caracteres', () => {
    expect(() => validarTarefa({ titulo: 'a'.repeat(101) })).toThrow(ErroValidacao);
  });

  it('rejeita concluida que não seja booleano', () => {
    expect(() => validarTarefa({ titulo: 'Estudar CI', concluida: 'sim' })).toThrow(ErroValidacao);
  });

  it('rejeita corpo ausente', () => {
    expect(() => validarTarefa(undefined)).toThrow(ErroValidacao);
  });
});

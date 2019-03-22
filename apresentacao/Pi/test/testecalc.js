const calculadora = require('../demo/calculadora');

var assert = require('assert');

describe('TDD de Operações da Calculadora', () => {
  it('Teste: Deve Somar 2 Números', () => {
    assert.equal(calculadora.adicionar(5, 5), 10);
  });

  it('Teste: Deve Subtrair 2 Números', () => {
    assert.equal(calculadora.subtrair(10, 5), 5);
  });

  it('Teste: Deve Multiplicar 2 Números', () => {
    assert.equal(calculadora.multiplicar(10, 5), 50);
  });

  it('Teste: Deve dividir 2 Números', () => {
    assert.equal(calculadora.dividir(18, 2), 9);
  });

});
  

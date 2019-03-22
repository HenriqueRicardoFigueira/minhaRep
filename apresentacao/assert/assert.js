/*
"strict mode";

var assert = require('assert');

function fun() {
    return false;
}

/////////////////// test ////////////////////////////
assert(fun(), "Erro no primeiro teste");

function fun(num) {
    return num+1;
}

assert.equal(fun(6), 8, "Verificando igualdade com 8");

function fun() {
    return '8';
}

assert.equal(fun(), 8, "Verificando string com número");
assert.deepStrictEqual(fun(), 8, "Verificando string com número");
*/
/*  CHAI

$ npm install chai   // Instala a biblioteca de asserts Chai

// 3 tipos diferentes de interfaces das funcoes do chai
chai.should();  //Primeira interface

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.lengthOf(3);
tea.should.have.property('flavors')
  .with.lengthOf(3);
  
var expect = chai.expect;  //Segunda interface

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.lengthOf(3);
expect(tea).to.have.property('flavors')
  .with.lengthOf(3);
  
var assert = chai.assert; // Terceira Interface

assert.typeOf(foo, 'string');
assert.equal(foo, 'bar');
assert.lengthOf(foo, 3)
assert.property(tea, 'flavors');
assert.lengthOf(tea.flavors, 3);

*/

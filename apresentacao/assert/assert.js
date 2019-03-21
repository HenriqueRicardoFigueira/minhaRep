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
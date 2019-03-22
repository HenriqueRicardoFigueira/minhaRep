describe("Teste", function(){
    var teste = new Teste();
    
    it ("deve fazer a soma dos valores", function(){
        var total
        total = teste.soma(3,10);
        expect(total).toEqual(13);
    });
});
/*console.log('Ola mundo');

let n = 5;
for(let i = 1; i<=10;i++){
    console.log(`${i} X ${n} = ${i*n}`);
}
function somar(n1, n2){
    return n1 + n2;
}
let soma = somar(2 , 4);
//console.log(soma);
function calc(n1, n2, op){
    return eval(`${n1} ${op} ${n2}`);
}
let valor = calc(2,3,"+");
console.log(valor);*/
window.addEventListener('focus', event=>{
    console.log("focus");
});
document.addEventListener('click', event=>{
    console.log("click");
});
let agora = new Date();
//console.log(agora.toLocaleDateString("pt-BR"));
//arrey
let carros = ["Strada", "Toro","uno",25];
/*for(let i = 0;i<carros.length;i++){
    console.log(carros[i]);
}
carros.forEach(function(value,index){
    console.log(index,value);
});
let celular = function(){
    this.cor = "prata";
    this.ligar = function(){
        console.log("uma ligação")
        return "ligando";
    }
}*/
//let objeto = new celular();
//console.log(objeto.ligar());
class celular{
    constructor(){
        this.cor = "Preta";        
    }
    ligar = function(){
        console.log("Estou Ligando");
        return "Ligando";
    }
}
let objeto = new celular();
console.log(objeto.ligar());
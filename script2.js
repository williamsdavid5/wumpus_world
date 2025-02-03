class Sala {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        //elementos que podem ser encontrados na sala
        this.wumpus = false;
        this.buraco = false;
        this.brisa = false;
        this.fedor = false;
        this.ouro = false;
    }
}

class Agente {
    constructor(flechas) {
        this.flechas = flechas;
    }
}

function criarMundo(d, mundo) {
    // um mundo é um vetor de linhas
    // cada linha possui um vetor de salas
    for (let y = 0; y < d; y++) {
        let temp = [];
        for (let x = 0; x < d; x++) {
            temp.push(new Sala(x, y));
        }
        mundo.push(temp);
    }
}

function adicionaEntidades(mundo, d, qtdWumpus, qtdBuracos, qtdOuro) {
    let totalWumpus = 0;
    let totalBuracos = 0;
    let totalOuro = 0;

    // o codigo faz um sorteio dentre uma das posicoes do mundo
    // se a sala sorteada nao foi modificada, o codigo adiciona o elemento
    while (totalWumpus < qtdWumpus || totalBuracos < qtdBuracos || totalOuro < qtdOuro) {
        let x = Math.floor(Math.random() * d);
        let y = Math.floor(Math.random() * d);
        let sala = mundo[x][y];

        if (!sala.wumpus && !sala.buraco && totalWumpus < qtdWumpus && Math.random() < 0.5) {
            sala.wumpus = true;
            adicionarFedor(mundo, x, y, d);
            totalWumpus++;
        } else if (!sala.wumpus && !sala.buraco && totalBuracos < qtdBuracos) {
            sala.buraco = true;
            adicionarBrisa(mundo, x, y, d);
            totalBuracos++;
        } else if (!sala.buraco && !sala.ouro && totalOuro < qtdOuro) {
            sala.ouro = true;
            totalOuro++;
        }
    }
}

// dicionar fedor nas salas adjacentes ao Wumpus
function adicionarFedor(mundo, x, y, d) {
    // recebe a posicao do elemento e usa calculos matematicos para adicionar a sensacao
    let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    direcoes.forEach(([dx, dy]) => {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
            mundo[nx][ny].fedor = true;
        }
    });
}

// adicionar brisa nas salas adjacentes ao Buraco
function adicionarBrisa(mundo, x, y, d) {
    let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    direcoes.forEach(([dx, dy]) => {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
            mundo[nx][ny].brisa = true;
        }
    });
}

let mundo = [];
let agente = new Agente(0);

d = 4;

let buraco = Math.floor(Math.random() * (d - 1)) + 1;
let ouro = Math.floor(Math.random() * (d - buraco - 1)) + 1;
let wumpus = ouro;
let flecha = wumpus;

criarMundo(d, mundo);
adicionaEntidades(mundo, d, wumpus, buraco, ouro);
console.log(mundo);
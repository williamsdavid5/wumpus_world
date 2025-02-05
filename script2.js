class Sala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wumpus = null;
        this.buraco = false;
        this.brisa = false;
        this.fedor = false;
        this.ouro = false;
    }
}

class Wumpus {
    constructor() {
        this.vivo = true;
    }
}

class Agente {
    constructor(flechas) {
        this.flechas = flechas;
    }
}

function criarMundo(d, mundo) {
    for (let x = 0; x < d; x++) {
        let temp = [];
        for (let y = 0; y < d; y++) {
            temp.push(new Sala(x, y));
        }
        mundo.push(temp);
    }
}

function adicionaEntidades(mundo, d, qtdWumpus, qtdBuracos, qtdOuro) {
    let totalWumpus = 0;
    let totalBuracos = 0;
    let totalOuro = 0;

    while (totalWumpus < qtdWumpus || totalBuracos < qtdBuracos || totalOuro < qtdOuro) {
        let x, y;

        // Garante que a posição (0,0) nunca será escolhida
        do {
            x = Math.floor(Math.random() * d);
            y = Math.floor(Math.random() * d);
        } while (x === 0 && y === 0);

        let sala = mundo[x][y];

        if (!sala.wumpus && !sala.buraco && totalWumpus < qtdWumpus && Math.random() < 0.5) {
            sala.wumpus = new Wumpus();
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

function adicionarFedor(mundo, x, y, d) {
    let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    direcoes.forEach(([dx, dy]) => {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
            mundo[nx][ny].fedor = true;
        }
    });
}

function adicionarBrisa(mundo, x, y, d) {
    let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    direcoes.forEach(([dx, dy]) => {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
            mundo[nx][ny].brisa = true;
        }
    });
}

function renderizarMapa(mapaTamanho, d) {
    let mapa = document.getElementById("mapa");
    mapa.style.width = d * mapaTamanho + 'px';
    mapa.style.height = d * mapaTamanho + 'px';
    mapa.style.display = 'grid';
    mapa.style.gridTemplateColumns = 'repeat(' + d + ', ' + mapaTamanho + 'px)';
    mapa.style.gridTemplateRows = 'repeat(' + d + ', ' + mapaTamanho + 'px)';

    for (let x = 0; x < d; x++) {
        for (let y = 0; y < d; y++) {
            const salaDiv = document.createElement("div");
            salaDiv.id = `${x},${y}`;
            salaDiv.className = "sala";

            if (mundo[x][y].buraco) {
                salaDiv.innerHTML += "<img src=\"textures/role.png\" id=\"buraco\" alt=\"\">";
            }
            if (mundo[x][y].wumpus != null) {
                salaDiv.innerHTML += "<img src=\"textures/wumpus.png\" id=\"" + x + "," + y + "_wumpus\" class=\"wumpus\" alt=\"\">";
            }
            // if (mundo[x][y].fedor) {
            //     salaDiv.innerHTML += "<p>fedor</p>";
            // }
            // if (mundo[x][y].brisa) {
            //     salaDiv.innerHTML += "<p>brisa</p>";
            // }
            if (mundo[x][y].ouro) {
                salaDiv.innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
            }

            mapa.appendChild(salaDiv);
        }
    }
}

let mundo = [];
let agente = new Agente(0);

let d = 4;

let buraco = Math.floor(Math.random() * (d - 1)) + 1;
let ouro = Math.floor(Math.random() * (d - buraco - 1)) + 1;
let wumpus = ouro;
let flecha = wumpus;

criarMundo(d, mundo);
adicionaEntidades(mundo, d, wumpus, buraco, ouro);

renderizarMapa(100, d);

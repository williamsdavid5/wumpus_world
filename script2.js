class Sala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wumpus = null;
        this.buraco = false;
        this.brisa = false;
        this.fedor = false;
        this.ouro = false;

        this.norte = null;
        this.sull = null;
        this.leste = null;
        this.oeste = null;
    }
}

class Wumpus {
    constructor() {
        this.vivo = true;
    }
}

class Agente {
    constructor(flechas, mundo) {
        this.flechas = flechas;
        this.mundo = mundo;
        this.ouro = 0;

        this.x = 0;
        this.y = 0;

        this.sala = mundo[this.x][this.y];

        this.mortes = 0;
        this.vitorias = 0;
    }

    moverNorte() {
        try {
            this.sala = mundo[this.x - 1][this.y];
            this.x -= 1;

        } catch (e) {
            console.log("erro ao mover para o norte");
        }
    }

    moverSul() {
        try {
            this.sala = mundo[this.x + 1][this.y];
            this.x += 1;

        } catch (e) {
            console.log("erro ao mover para o sul");
        }
    }

    moverLeste() {
        try {
            this.sala = mundo[this.x][this.y + 1];
            this.y += 1;

        } catch (e) {
            console.log("erro ao mover para o leste");
        }
    }

    moverOeste() {
        try {
            this.sala = mundo[this.x][this.y - 1];
            this.y -= 1;

        } catch (e) {
            console.log("erro ao mover para o oeste");
        }
    }
}

class Mundo {
    constructor(d) {
        this.mundo = [];

        for (let x = 0; x < d; x++) {
            let temp = [];
            for (let y = 0; y < d; y++) {
                temp.push(new Sala(x, y));
            }
            this.mundo.push(temp);
        }

        this.buraco = Math.floor(Math.random() * (d - 1)) + 1;
        this.ouro = Math.floor(Math.random() * (d - this.buraco - 1)) + 1;
        this.wumpus = this.ouro;
        // this.flecha = this.wumpus;
        this.posicoesOuro = [];

        // console.log("Buraco:", buraco);
        // console.log("Ouro:", ouro);
        // console.log("Wumpus:", wumpus);
        // console.log("Flecha:", flecha);
        // console.log("Posições do Ouro:", posicoesOuro);

        this.adicionaEntidades(d);
        let agente = null;
    }


    adicionaEntidades(d) {
        let totalWumpus = 0;
        let totalBuracos = 0;
        let totalOuro = 0;

        while (totalWumpus < this.wumpus || totalBuracos < this.buraco || totalOuro < this.ouro) {
            let x, y;

            // Garante que a posição (0,0) nunca será escolhida
            do {
                x = Math.floor(Math.random() * d);
                y = Math.floor(Math.random() * d);
            } while (x === 0 && y === 0);

            let sala = this.mundo[x][y];

            if (!sala.wumpus && !sala.buraco && totalWumpus < this.wumpus && Math.random() < 0.5) {
                sala.wumpus = new Wumpus();
                this.adicionarFedor(x, y, d);
                totalWumpus++;
            } else if (!sala.wumpus && !sala.buraco && totalBuracos < this.buraco) {
                sala.buraco = true;
                this.adicionarBrisa(x, y, d);
                totalBuracos++;
            } else if (!sala.buraco && !sala.ouro && totalOuro < this.ouro) {
                sala.ouro = true;
                totalOuro++;
            }
        }
    }

    adicionarFedor(x, y, d) {
        let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        direcoes.forEach(([dx, dy]) => {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
                this.mundo[nx][ny].fedor = true;
            }
        });
    }

    adicionarBrisa(x, y, d) {
        let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        direcoes.forEach(([dx, dy]) => {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
                this.mundo[nx][ny].brisa = true;
            }
        });
    }
}

// function criarMundo(d, mundo) {
//     for (let x = 0; x < d; x++) {
//         let temp = [];
//         for (let y = 0; y < d; y++) {
//             temp.push(new Sala(x, y));
//         }
//         mundo.push(temp);
//     }
// }

// function adicionaEntidades(mundo, d, qtdWumpus, qtdBuracos, qtdOuro) {
//     let totalWumpus = 0;
//     let totalBuracos = 0;
//     let totalOuro = 0;

//     while (totalWumpus < qtdWumpus || totalBuracos < qtdBuracos || totalOuro < qtdOuro) {
//         let x, y;

//         // Garante que a posição (0,0) nunca será escolhida
//         do {
//             x = Math.floor(Math.random() * d);
//             y = Math.floor(Math.random() * d);
//         } while (x === 0 && y === 0);

//         let sala = mundo[x][y];

//         if (!sala.wumpus && !sala.buraco && totalWumpus < qtdWumpus && Math.random() < 0.5) {
//             sala.wumpus = new Wumpus();
//             adicionarFedor(mundo, x, y, d);
//             totalWumpus++;
//         } else if (!sala.wumpus && !sala.buraco && totalBuracos < qtdBuracos) {
//             sala.buraco = true;
//             adicionarBrisa(mundo, x, y, d);
//             totalBuracos++;
//         } else if (!sala.buraco && !sala.ouro && totalOuro < qtdOuro) {
//             sala.ouro = true;
//             totalOuro++;
//         }
//     }
// }

// function adicionarFedor(mundo, x, y, d) {
//     let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
//     direcoes.forEach(([dx, dy]) => {
//         let nx = x + dx, ny = y + dy;
//         if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
//             mundo[nx][ny].fedor = true;
//         }
//     });
// }

// function adicionarBrisa(mundo, x, y, d) {
//     let direcoes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
//     direcoes.forEach(([dx, dy]) => {
//         let nx = x + dx, ny = y + dy;
//         if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
//             mundo[nx][ny].brisa = true;
//         }
//     });
// }

function renderizarMapa(mapaTamanho, d, mundo) {
    let mapa = document.getElementById("mapa");
    mapa.style.width = d * mapaTamanho + 'px';
    mapa.style.height = d * mapaTamanho + 'px';
    mapa.style.display = 'grid';
    mapa.style.gridTemplateColumns = 'repeat(' + d + ', ' + mapaTamanho + 'px)';
    mapa.style.gridTemplateRows = 'repeat(' + d + ', ' + mapaTamanho + 'px)';

    for (let x = 0; x < d; x++) {
        for (let y = 0; y < d; y++) {
            // console.log(`Sala (${x}, ${y}) - Buraco: ${mundo.mundo[x][y].buraco}, Wumpus: ${mundo.mundo[x][y].wumpus}, Ouro: ${mundo.mundo[x][y].ouro}`);
            const salaDiv = document.createElement("div");
            salaDiv.id = `${x},${y}`;
            salaDiv.className = "sala";

            // if (mundo.agente != null) {
            //     document.getElementById(mundo.agente.x + "," + mundo.agente.y).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
            // }

            if (mundo.mundo[x][y].buraco) {
                salaDiv.innerHTML += "<img src=\"textures/role.png\" id=\"buraco\" alt=\"\">";
            }
            if (mundo.mundo[x][y].wumpus != null) {
                salaDiv.innerHTML += "<img src=\"textures/wumpus.png\" id=\"" + x + "," + y + "_wumpus\" class=\"wumpus\" alt=\"\">";
            }
            // if (mundo.mundo[x][y].fedor) {
            //     salaDiv.innerHTML += "<p>fedor</p>";
            // }
            // if (mundo.mundo[x][y].brisa) {
            //     salaDiv.innerHTML += "<p>brisa</p>";
            // }
            if (mundo.mundo[x][y].ouro) {
                salaDiv.innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
            }



            mapa.appendChild(salaDiv);
        }
    }
}

// function inserirAgenteNoMundo() {

//     let novoAgente = new Agente(flecha, mundo);

//     document.getElementById(0 + "," + 0).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
//     document.getElementById("mortesPontuacao").textContent = "Mortes: " + novoAgente.mortes;
//     document.getElementById("vitoriasPontuacao").textContent = "Vitorias: " + novoAgente.vitorias;
//     document.getElementById("flechasNumero").textContent = "Flechas: " + novoAgente.flechas;

//     return novoAgente;
// }

function restaurarMundo(mundo, posicoesOuro) {
    posicoesOuro.forEach(([x, y]) => {
        mundo[x][y].ouro = true;
        document.getElementById(x + "," + y).innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
    });

    posicoesOuro.length = 0;

}

function rodarGameAleatorio(agente, mundo, posicoesOuro, ouro, flecha) {
    document.getElementById("agente").remove();

    let movimentos = [];

    if (mundo[agente.x - 1] && mundo[agente.x - 1][agente.y] !== undefined) {
        movimentos.push(() => agente.moverNorte());
    }
    if (mundo[agente.x + 1] && mundo[agente.x + 1][agente.y] !== undefined) {
        movimentos.push(() => agente.moverSul());
    }
    if (mundo[agente.x] && mundo[agente.x][agente.y + 1] !== undefined) {
        movimentos.push(() => agente.moverLeste());
    }
    if (mundo[agente.x] && mundo[agente.x][agente.y - 1] !== undefined) {
        movimentos.push(() => agente.moverOeste());
    }

    movimentos[Math.floor(Math.random() * movimentos.length)]();
    console.log(agente.x, agente.y);

    if (mundo[agente.x][agente.y].wumpus) {
        console.log("wumpus aqui!");
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.ouro = 0;
        agente.flecha = flecha;
        document.getElementById("mortesPontuacao").textContent = "Mortes: " + agente.mortes;
        restaurarMundo(mundo, posicoesOuro);
    }

    if (mundo[agente.x][agente.y].buraco) {
        console.log("buraco aqui!");
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.ouro = 0;
        agente.flecha = flecha;
        document.getElementById("mortesPontuacao").textContent = "Mortes: " + agente.mortes;
        restaurarMundo(mundo, posicoesOuro);
    }

    if (mundo[agente.x][agente.y].ouro) {
        console.log("ouro aqui!");
        posicoesOuro.push([agente.x, agente.y]);
        mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
    }

    if (agente.x == 0 && agente.y == 0 && agente.ouro == ouro) {
        console.log("venceu!");
        agente.vitorias += 1;
        agente.ouro = 0;
        agente.flecha = flecha;
        document.getElementById("vitoriasPontuacao").textContent = "Vitorias: " + agente.vitorias;
        restaurarMundo(mundo, posicoesOuro);
    }

    document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";

}

let d = 4;
let mapaTamanhoPixels = 100;

let mundo = new Mundo(d);
mundo.agente = new Agente(mundo.wumpus, mundo.mundo);
renderizarMapa(mapaTamanhoPixels, d, mundo);

// let mundo = [];
// let d = 6;

// let buraco = Math.floor(Math.random() * (d - 1)) + 1;
// let ouro = Math.floor(Math.random() * (d - buraco - 1)) + 1;
// let wumpus = ouro;
// let flecha = wumpus;

// let posicoesOuro = [];

// criarMundo(d, mundo);
// adicionaEntidades(mundo, d, wumpus, buraco, ouro);

// renderizarMapa(100, d);

// let agente = inserirAgenteNoMundo(mundo, flecha);

// rodarGameAleatorio(agente);



// setInterval(() => {
//     rodarGameAleatorio(agente, mundo, posicoesOuro, ouro);
// }, 500);
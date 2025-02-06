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
    constructor(flecha, mundo) {
        this.flechas = flecha;
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
            this.sala = this.mundo[this.x - 1][this.y];
            this.x -= 1;

        } catch (e) {
            console.log("erro ao mover para o norte");
        }
    }

    moverSul() {
        try {
            this.sala = this.mundo[this.x + 1][this.y];
            this.x += 1;

        } catch (e) {
            console.log("erro ao mover para o sul");
        }
    }

    moverLeste() {
        try {
            this.sala = this.mundo[this.x][this.y + 1];
            this.y += 1;

        } catch (e) {
            console.log("erro ao mover para o leste");
        }
    }

    moverOeste() {
        try {
            this.sala = this.mundo[this.x][this.y - 1];
            this.y -= 1;

        } catch (e) {
            console.log("erro ao mover para o oeste");
        }
    }

    dispararNorte() {
        this.flechas -= 1;

        if (this.mundo[this.x - 1] && this.mundo[this.x - 1][this.y] && this.mundo[this.x - 1][this.y].wumpus != undefined) {
            this.mundo[this.x - 1][this.y].wumpus.vivo = false;
            console.log("wumpus morto!!!!!!!!!!!");
            return [true, this.x - 1, this.y];
        } else {
            console.log("wumpus vivo!");
            return [false, 0, 0];
        }
    }

    dispararSul() {
        this.flechas -= 1;

        if (this.mundo[this.x + 1] && this.mundo[this.x + 1][this.y] && this.mundo[this.x + 1][this.y].wumpus != undefined) {
            this.mundo[this.x + 1][this.y].wumpus.vivo = false;
            console.log("wumpus morto!!!!!!!!!!!");
            return [true, this.x + 1, this.y];
        } else {
            console.log("wumpus vivo!");
            return [false, 0, 0];
        }
    }

    dispararLeste() {
        this.flechas -= 1;

        if (this.mundo[this.x] && this.mundo[this.x][this.y + 1] && this.mundo[this.x][this.y + 1].wumpus != undefined) {
            this.mundo[this.x][this.y + 1].wumpus.vivo = false;
            console.log("wumpus morto!!!!!!!!!!!");
            return [true, this.x, this.y + 1];
        } else {
            console.log("wumpus vivo!");
            return [false, 0, 0];
        }
    }

    dispararOeste() {
        this.flechas -= 1;

        if (this.mundo[this.x] && this.mundo[this.x][this.y - 1] && this.mundo[this.x][this.y - 1].wumpus != undefined) {
            this.mundo[this.x][this.y - 1].wumpus.vivo = false;
            console.log("wumpus morto!!!!!!!!!!!");
            return [true, this.x, this.y - 1];
        } else {
            console.log("wumpus vivo!");
            return [false, 0, 0];
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
        this.posicoesWumpus = [];

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

            if (mundo.agente != null && mundo.agente.x == x && mundo.agente.y == y) {
                salaDiv.innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
                document.getElementById("mortesPontuacao").textContent = "Mortes: " + mundo.agente.mortes;
                document.getElementById("vitoriasPontuacao").textContent = "Ganhou: " + mundo.agente.vitorias;
                document.getElementById("flechasNumero").textContent = "FLechas: " + mundo.agente.flechas;
            }

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

function restaurarMundo(mundo, posicoesOuro, posicoesWumpus) {
    posicoesOuro.forEach(([x, y]) => {
        mundo[x][y].ouro = true;
        document.getElementById(x + "," + y).innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
    });

    if (posicoesWumpus != undefined) {
        posicoesWumpus.forEach(([x, y]) => {
            mundo[x][y].wumpus.vivo = true;
            document.getElementById(x + "," + y + "_wumpus").src = "textures/wumpus.png";
        });
    }

    posicoesWumpus.length = 0;
    posicoesOuro.length = 0;

}

function rodarGameAleatorio(mundo) {
    document.getElementById("agente").remove();

    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    let movimentos = [];

    if (mundo.mundo[agente.x - 1] && mundo.mundo[agente.x - 1][agente.y] !== undefined) {
        movimentos.push(() => agente.moverNorte());
    }
    if (mundo.mundo[agente.x + 1] && mundo.mundo[agente.x + 1][agente.y] !== undefined) {
        movimentos.push(() => agente.moverSul());
    }
    if (mundo.mundo[agente.x] && mundo.mundo[agente.x][agente.y + 1] !== undefined) {
        movimentos.push(() => agente.moverLeste());
    }
    if (mundo.mundo[agente.x] && mundo.mundo[agente.x][agente.y - 1] !== undefined) {
        movimentos.push(() => agente.moverOeste());
    }

    movimentos[Math.floor(Math.random() * movimentos.length)]();
    // console.log(agente.x, agente.y);

    // morreu para wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus) {
        if (mundo.mundo[agente.x][agente.y].wumpus.vivo) {
            agente.x = agente.y = 0;
            agente.mortes += 1;
            agente.ouro = 0;
            agente.flechas = mundo.wumpus;
            document.getElementById("mortesPontuacao").textContent = "Mortes: " + agente.mortes;
            document.getElementById("flechasNumero").textContent = "Flechas: " + agente.flechas;
            restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
        }
    }

    if (mundo.mundo[agente.x][agente.y].buraco) {
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        document.getElementById("mortesPontuacao").textContent = "Mortes: " + agente.mortes;
        document.getElementById("flechasNumero").textContent = "Flechas: " + agente.flechas;
        restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
    }

    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);
        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
    }

    if (mundo.mundo[agente.x][agente.y].fedor && agente.flechas > 0) {

        let disparos = [
            () => agente.dispararNorte(),
            () => agente.dispararSul(),
            () => agente.dispararLeste(),
            () => agente.dispararOeste()
        ];

        let morreu = disparos[Math.floor(Math.random() * disparos.length)]();

        document.getElementById("flechasNumero").textContent = "Flechas: " + agente.flechas;

        if (morreu[0]) {
            // console.log(morreu[1], morreu[2]);
            posicoesWumpus.push([morreu[1], morreu[2]]);
            document.getElementById(morreu[1] + "," + morreu[2] + "_wumpus").src = "textures/wumpus_dead.png";
        }
    }

    if (agente.x == 0 && agente.y == 0 && agente.ouro == ouro) {
        agente.vitorias += 1;
        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        document.getElementById("vitoriasPontuacao").textContent = "Vitorias: " + agente.vitorias;
        document.getElementById("flechasNumero").textContent = "Flechas: " + agente.flechas;
        restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
    }

    document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";

}

let d = 4;
let mapaTamanhoPixels = 100;

let mundo = new Mundo(d);
mundo.agente = new Agente(mundo.wumpus, mundo.mundo);
renderizarMapa(mapaTamanhoPixels, d, mundo);

setInterval(() => {
    rodarGameAleatorio(mundo);
}, 500);
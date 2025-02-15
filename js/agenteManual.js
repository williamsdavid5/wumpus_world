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

        this.sala = mundo[this.x][this.y]; // o agente recebe o mundo como parametro para poder verificar as paredes

        this.mortes = 0;
        this.vitorias = 0;
        this.pontuacao = 0;

        this.tamanhoMundoImaginario = 1;
        this.mundoImaginario = [];
        this.imaginarMundo();
    }

    imaginarMundo() {
        let vetorTemporario = [];

        for (let x = 0; x < this.tamanhoMundoImaginario; x++) {
            for (let y = 0; y < this.tamanhoMundoImaginario; y++) {
                vetorTemporario.push(new Sala(x, y));
            }
            this.mundoImaginario.push(vetorTemporario);
        }
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
            return [true, this.x - 1, this.y];
        } else {
            return [false, 0, 0];
        }
    }

    dispararSul() {
        this.flechas -= 1;

        if (this.mundo[this.x + 1] && this.mundo[this.x + 1][this.y] && this.mundo[this.x + 1][this.y].wumpus != undefined) {
            this.mundo[this.x + 1][this.y].wumpus.vivo = false;
            return [true, this.x + 1, this.y];
        } else {
            return [false, 0, 0];
        }
    }

    dispararLeste() {
        this.flechas -= 1;

        if (this.mundo[this.x] && this.mundo[this.x][this.y + 1] && this.mundo[this.x][this.y + 1].wumpus != undefined) {
            this.mundo[this.x][this.y + 1].wumpus.vivo = false;
            return [true, this.x, this.y + 1];
        } else {
            return [false, 0, 0];
        }
    }

    dispararOeste() {
        this.flechas -= 1;

        if (this.mundo[this.x] && this.mundo[this.x][this.y - 1] && this.mundo[this.x][this.y - 1].wumpus != undefined) {
            this.mundo[this.x][this.y - 1].wumpus.vivo = false;
            return [true, this.x, this.y - 1];
        } else {
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
        this.agentesNumero = 0;

        this.flechasDisparadas = 0;
        this.wumpusMortos = 0;
        this.ouroColetado = 0;
        this.mortesPorWumpus = 0;
        this.mortesPorBuraco = 0;
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

    document.getElementById("flechasNumero").textContent = mundo.flechasDisparadas;
    document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;
    document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
    document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;
    document.getElementById("mortes por wumpus").textContent = "Mortes por wumpus: " + mundo.mortesPorWumpus;
    document.getElementById("mortes por buraco").textContent = "Mortes por buraco: " + mundo.mortesPorBuraco;

    for (let x = 0; x < d; x++) {
        for (let y = 0; y < d; y++) {
            // console.log(`Sala (${x}, ${y}) - Buraco: ${mundo.mundo[x][y].buraco}, Wumpus: ${mundo.mundo[x][y].wumpus}, Ouro: ${mundo.mundo[x][y].ouro}`);
            const salaDiv = document.createElement("div");
            salaDiv.id = `${x},${y}`;
            salaDiv.className = "sala";

            if (mundo.agente != null && mundo.agente.x == x && mundo.agente.y == y) {
                salaDiv.innerHTML += "<img src=\"textures/linoAgenteArmado.png\" id=\"agente\" alt=\"\">";
                document.getElementById("mortesPontuacao").textContent = mundo.agente.mortes;
                document.getElementById("vitoriasPontuacao").textContent = mundo.agente.vitorias;
                document.getElementById("flechasNumero").textContent = mundo.agente.flechas;
            }

            if (mundo.mundo[x][y].buraco) {
                salaDiv.innerHTML += "<img src=\"textures/role.png\" id=\"buraco\" alt=\"\">";
            } else {
                if (mundo.mundo[x][y].wumpus != null) {
                    salaDiv.innerHTML += "<img src=\"textures/canvaWumpusVivo.png\" id=\"" + x + "," + y + "_wumpus\" class=\"wumpus\" alt=\"\">";
                }

                if (localStorage.getItem("sensacoes") == "true") {
                    if (mundo.mundo[x][y].fedor) {
                        if (mundo.mundo[x][y].brisa) {
                            salaDiv.innerHTML += "<img src=\"textures/fedorEBrisa.png\" id=\"fedor\" class=\"sensacao\" alt=\"\">";
                        } else {
                            salaDiv.innerHTML += "<img src=\"textures/fedor.png\" id=\"fedor\" class=\"sensacao\" alt=\"\">";
                        }
                    } else {
                        if (mundo.mundo[x][y].brisa) {
                            salaDiv.innerHTML += "<img src=\"textures/brisa.png\" id=\"brisa\" class=\"sensacao\"  alt=\"\">";
                        }
                    }
                }



                if (mundo.mundo[x][y].ouro) {
                    salaDiv.innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
                }
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
            document.getElementById(x + "," + y + "_wumpus").src = "textures/canvaWumpusVivo.png";
        });
    }

    posicoesWumpus.length = 0;
    posicoesOuro.length = 0;

}

function rodarGameManual(direcao) {
    document.getElementById("agente").remove();

    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    agente.pontuacao -= 1;
    document.getElementById("pontuacao").textContent = agente.pontuacao;

    switch (direcao) {
        case "norte":
            agente.moverNorte();
            break;

        case "sul":
            agente.moverSul();
            break;

        case "leste":
            agente.moverLeste();
            break;

        case "oeste":
            agente.moverOeste();
            break;
    }

    // morreu para wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus) {
        if (mundo.mundo[agente.x][agente.y].wumpus.vivo) {
            agente.x = agente.y = 0;
            agente.mortes += 1;
            agente.ouro = 0;
            agente.pontuacao -= 1000;

            mundo.agentesNumero += 1;
            document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", morto por canva" + "\n" + document.getElementById("logPontuacao").value;

            agente.pontuacao = 0;
            agente.flechas = mundo.wumpus;
            mundo.mortesPorWumpus += 1;
            document.getElementById("mortesPontuacao").textContent = agente.mortes;
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("mortes por wumpus").textContent = "Mortes por wumpus: " + mundo.mortesPorWumpus;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
            restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
        }
    }

    // morreu para um buraco
    if (mundo.mundo[agente.x][agente.y].buraco) {
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.pontuacao -= 1000;

        mundo.agentesNumero += 1;
        document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", morto por buraco" + "\n" + document.getElementById("logPontuacao").value;

        agente.pontuacao = 0;
        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        mundo.mortesPorBuraco += 1;
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("mortes por buraco").textContent = "Mortes por buraco: " + mundo.mortesPorBuraco;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
    }

    //achou ouro
    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);
        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        agente.pontuacao -= 1;
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
        document.getElementById("pontuacao").textContent = agente.pontuacao;
    }

    //sentiu fedor, disparou
    if (mundo.mundo[agente.x][agente.y].fedor && agente.flechas > 0) {
        let disparos = [
            () => agente.dispararNorte(),
            () => agente.dispararSul(),
            () => agente.dispararLeste(),
            () => agente.dispararOeste()
        ];
        agente.pontuacao -= 10;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        mundo.flechasDisparadas += 1;
        let morreu = disparos[Math.floor(Math.random() * disparos.length)]();

        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;

        if (morreu[0]) {
            // console.log(morreu[1], morreu[2]);
            posicoesWumpus.push([morreu[1], morreu[2]]);
            document.getElementById(morreu[1] + "," + morreu[2] + "_wumpus").src = "textures/canvaWumpusMorto.png";
            mundo.wumpusMortos += 1;
            document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;
        }

    }

    // chegou em 0,0 com ouro
    if (agente.x == 0 && agente.y == 0 && agente.ouro == ouro) {
        agente.vitorias += 1;
        agente.pontuacao += 1000;
        agente.ouro = 0;

        mundo.agentesNumero += 1;
        document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", VITÓRIA!!!!!!!!!!!!!!!!" + "\n" + document.getElementById("logPontuacao").value;

        agente.pontuacao = 0;
        agente.flechas = mundo.wumpus;
        mundo.ouroColetado += 1;
        document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
        document.getElementById("vitoriasPontuacao").textContent = agente.vitorias;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus);
    }

    if (agente.flechas > 0) {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoAgenteArmado.png\" id=\"agente\" alt=\"\">";
    } else {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoAgente.png\" id=\"agente\" alt=\"\">";
    }



}

document.addEventListener("keydown", function (event) {
    let direcao = null;

    switch (event.key) {
        case "ArrowUp":
            direcao = "norte";
            break;

        case "ArrowDown":
            direcao = "sul";
            break;

        case "ArrowRight":
            direcao = "leste";
            break;

        case "ArrowLeft":
            direcao = "oeste";
            break;
    }

    rodarGameManual(direcao);
});

document.getElementById("atualizarMundo").addEventListener("click", function (event) {
    event.preventDefault();
    location.replace(location.href);
});

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
    });
});

document.getElementById("velocidade").remove();
document.getElementById("playPause").remove();

let d = localStorage.getItem("dimensaoMapa");
let mapaTamanhoPixels = localStorage.getItem("dimensaoSala");

let mundo = new Mundo(d);
mundo.agente = new Agente(mundo.wumpus, mundo.mundo);
renderizarMapa(mapaTamanhoPixels, d, mundo);
let auturaMapa = document.getElementById("mapa").offsetHeight;
document.getElementById("logPontuacao").style.height = auturaMapa - 70 + "px";
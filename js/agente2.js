class Sala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wumpus = null;
        this.buraco = false;
        this.brisa = false;
        this.fedor = false;
        this.ouro = false;
        this.passou = false;
        this.suspeita = false;
        this.suspeitaFedor = false;
        this.objetivo = false; // sala que o agente pretende epxlorar
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Wumpus {
    constructor() {
        this.vivo = true;
    }
}

class Memoria {
    constructor() {
        this.posicoesObjetivo = [];
        this.listaBrancaSuspeita = [];
        this.listaBrancaSuspeitaFedor = [];
        this.mundoImaginario = [];
    }

    salvar(agente) {
        this.posicoesObjetivo = agente.posicoesObjetivo;
        this.listaBrancaSuspeita = agente.listaBrancaSuspeita;
        this.listaBrancaSuspeitaFedor = agente.listaBrancaSuspeitaFedor;
        this.mundoImaginario = agente.mundoImaginario;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Agente {
    constructor(flecha, mundo) {
        this.flechas = flecha;
        this.mundo = mundo;
        this.ouro = 0;
        this.carregandoOuro = 0;
        this.posicoesObjetivo = [];

        this.x = 0;
        this.y = 0;

        this.sala = mundo[this.x][this.y];

        this.mortes = 0;
        this.vitorias = 0;
        this.pontuacao = 0;

        this.pilhaDeMovimentos = [];
        this.listaBrancaSuspeita = [];
        this.listaBrancaSuspeitaFedor = [];

        this.qtdPadrao = 0;
        this.procurarDeCima = true; // variavel que define como o agente irá procurar salas pendentes no mapa
        // dependendo do estado dessa variavel, ele ira atras da primeira sala pendente ou da ultima
        // isso serve para que o agente desista de ir atras de salas inacessiveis

        this.mundoImaginario = [[this.mundo[0][0]]];
        this.mundoImaginario[0][0].passou = true;
        renderizarMapaImaginario(mapaTamanhoPixels * 0.8, this.mundoImaginario.length, this.mundoImaginario, "mapaImaginario");

    }

    imaginarMundo(movimentoPosicao) {

        if (movimentoPosicao == this.mundoImaginario.length) {
            let novoMundoImaginario = [];

            for (let x = 0; x < movimentoPosicao + 1; x++) {
                let vetorTemporario = [];
                for (let y = 0; y < movimentoPosicao + 1; y++) {
                    vetorTemporario.push(new Sala(x, y));
                }
                novoMundoImaginario.push(vetorTemporario);
            }

            for (let x = 0; x < this.mundoImaginario.length; x++) {
                for (let y = 0; y < this.mundoImaginario.length; y++) {
                    novoMundoImaginario[x][y] = this.mundoImaginario[x][y];
                }
            }

            novoMundoImaginario[this.x][this.y] = this.mundo[this.x][this.y];

            this.mundoImaginario = novoMundoImaginario;

        } else {
            this.mundoImaginario[this.x][this.y] = this.mundo[this.x][this.y];
        }

        renderizarMapaImaginario(mapaTamanhoPixels * 0.8, this.mundoImaginario.length, this.mundoImaginario, "mapaImaginario");
    }

    moverNorte() {
        try {
            this.sala = this.mundo[this.x - 1][this.y];
            this.x -= 1;
            this.mundo[this.x][this.y].passou = true;
            this.mundo[this.x][this.y].objetivo = false;
            this.pilhaDeMovimentos.push("N");
            this.imaginarMundo(this.x);
        } catch (e) {
            console.log("erro ao mover para o norte");
        }
    }

    moverSul() {
        try {
            this.sala = this.mundo[this.x + 1][this.y];
            this.x += 1;
            this.mundo[this.x][this.y].passou = true;
            this.mundo[this.x][this.y].objetivo = false;
            this.pilhaDeMovimentos.push("S");
            this.imaginarMundo(this.x);


        } catch (e) {
            console.log(e);
        }
    }

    moverLeste() {
        try {
            this.sala = this.mundo[this.x][this.y + 1];
            this.y += 1;
            this.mundo[this.x][this.y].passou = true;
            this.mundo[this.x][this.y].objetivo = false;
            this.pilhaDeMovimentos.push("L");
            this.imaginarMundo(this.y);
        } catch (e) {
            console.log("erro ao mover para o leste");
        }
    }

    moverOeste() {
        try {
            this.sala = this.mundo[this.x][this.y - 1];
            this.y -= 1;
            this.mundo[this.x][this.y].passou = true;
            this.mundo[this.x][this.y].objetivo = false;
            this.pilhaDeMovimentos.push("O");
            this.imaginarMundo(this.y);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            } while ((x === 0 && y === 0) || (x === 1 && y === 0) || (x === 0 && y === 1) || (x === 1 && y === 1));

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

    exportarMundo() {
        let mundoData = {
            tamanho: this.mundo.length,
            mundo: this.mundo.map(linha => linha.map(sala => ({
                wumpus: sala.wumpus ? { vivo: sala.wumpus.vivo } : null,
                buraco: sala.buraco,
                brisa: sala.brisa,
                fedor: sala.fedor,
                ouro: sala.ouro
            }))),
            numOuros: this.ouro,
            numWumpus: this.wumpus,
            posicoesOuroOriginais: this.posicoesOuro,
            posicoesWumpusOriginais: this.posicoesWumpus
        };

        return JSON.stringify(mundoData);
    }

    importarMundo(mundoData) {
        const tamanho = mundoData.tamanho;
        this.mundo = [];

        for (let x = 0; x < tamanho; x++) {
            let temp = [];
            for (let y = 0; y < tamanho; y++) {
                let salaData = mundoData.mundo[x][y];
                let sala = new Sala(x, y);

                if (salaData.wumpus) {
                    sala.wumpus = new Wumpus();
                    sala.wumpus.vivo = true;
                }
                sala.buraco = salaData.buraco;
                sala.brisa = salaData.brisa;
                sala.fedor = salaData.fedor;
                sala.ouro = salaData.ouro;

                temp.push(sala);
            }
            this.mundo.push(temp);
        }

        this.ouro = mundoData.numOuros || 0;
        this.wumpus = mundoData.numWumpus || 0;

        this.posicoesOuro = mundoData.posicoesOuroOriginais || [];
        this.posicoesWumpus = mundoData.posicoesWumpusOriginais || [];
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderizarMapaImaginario(mapaTamanho, d, mundo, mapaId) {
    let mapa = document.getElementById(mapaId);
    mapa.innerHTML = "";
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

            if (mundo[x][y].passou) {
                salaDiv.className += " passou";
            }

            if (mundo[x][y].suspeita) {
                salaDiv.className += " suspeita";
            }

            if (mundo[x][y].suspeitaFedor) {
                salaDiv.className += " suspeitaFedor";
            }

            if (mundo[x][y].objetivo) {
                salaDiv.className += " objetivo";
            }

            if (mundo[x][y].buraco) {
                salaDiv.innerHTML += "<img src=\"textures/role.png\" id=\"buraco\" alt=\"\">";
            } else {
                if (mundo[x][y].wumpus != null) {

                    if (mundo[x][y].wumpus.vivo) {
                        salaDiv.innerHTML += "<img src=\"textures/canvaWumpusVivo.png\" id=\"" + x + "," + y + "_wumpus\" class=\"wumpus\" alt=\"\">";
                    } else {
                        salaDiv.innerHTML += "<img src=\"textures/canvaWumpusMorto.png\" id=\"" + x + "," + y + "_wumpus\" class=\"wumpus\" alt=\"\">";
                    }
                }

                if (document.getElementById("mostrarSensacoes").checked) {
                    if (mundo[x][y].fedor) {
                        if (mundo[x][y].brisa) {
                            salaDiv.innerHTML += "<img src=\"textures/fedorEBrisa.png\" id=\"fedor\" class=\"sensacao\" alt=\"\">";
                        } else {
                            salaDiv.innerHTML += "<img src=\"textures/fedor.png\" id=\"fedor\" class=\"sensacao\" alt=\"\">";
                        }
                    } else {
                        if (mundo[x][y].brisa) {
                            salaDiv.innerHTML += "<img src=\"textures/brisa.png\" id=\"brisa\" class=\"sensacao\"  alt=\"\">";
                        }
                    }
                }

                if (mundo[x][y].ouro) {
                    salaDiv.innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
                }
            }

            mapa.appendChild(salaDiv);
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderizarMapa(mapaTamanho, d, mundo, mapaId) {
    let mapa = document.getElementById(mapaId);
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

                if (document.getElementById("mostrarSensacoes").checked) {
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

    let auturaMapa = document.getElementById("mapa").offsetHeight;
    document.getElementById("logPontuacao").style.height = auturaMapa * 0.8 + "px";
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function restaurarMundo(mundo, posicoesOuro, posicoesWumpus, agente) {
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
    agente.imaginarMundo(0);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verificarCaminho(x, y, agente, mundo) {
    let mover = true;

    if ((x < 0 || x >= mundo.mundo.length) || (y < 0 || y >= mundo.mundo.length)) {
        return false;
    }

    if (agente.mundoImaginario[x] && agente.mundoImaginario[x][y] !== undefined) {
        if (agente.mundoImaginario[x][y].buraco) {
            mover = false;
        }

        if (agente.mundoImaginario[x][y].wumpus != null && agente.mundoImaginario[x][y].wumpus.vivo == true) {
            agente.pontuacao -= 10;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
            mundo.posicoesWumpus.push([x, y]);
            mundo.flechasDisparadas += 1;
            agente.pontuacao += 1000;
            agente.flechas -= 1;
            mundo.mundo[x][y].wumpus.vivo = false;

            agente.mundoImaginario[x][y].wumpus.vivo = false;
            mundo.wumpusMortos += 1;
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;
            document.getElementById(x + "," + y + "_wumpus").src = "textures/canvaWumpusMorto.png";
            document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;
        }
    }

    return mover;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//funcao que verifica suspeitas de buraco
function verificarSuspeitaBuraco(x, y, agente) {
    agente.imaginarMundo(x > y ? x : y);
    salaSuspeita = agente.mundoImaginario[x][y].suspeita;
    return salaSuspeita;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//função que verifica suspeitas de wumpus, diz se ha um wumpus la se baseando nas percepcoes ao redor
function verificarSuspeitaWumpus(x, y, agente, mundo) {
    agente.imaginarMundo(x > y ? x : y); //caso a sala esteja fora dos limites do mundo imaginário, ele é expandido
    let salaSuspeita = agente.mundoImaginario[x][y].suspeitaFedor;

    if (salaSuspeita) {
        let qtdFedor = 0;

        const direcoes = [
            [x - 1, y], // Norte
            [x + 1, y], // Sul
            [x, y + 1], // Leste
            [x, y - 1]  // Oeste
        ];

        for (let [dx, dy] of direcoes) {
            if (dx >= 0 && dx < agente.mundoImaginario.length && dy >= 0 && dy < agente.mundoImaginario[dx].length) {
                if (agente.mundoImaginario[dx][dy].fedor && agente.mundoImaginario[dx][dy].passou) {
                    qtdFedor++;
                }
            }
        }

        if (qtdFedor >= 2) {
            if (agente.flechas > 0) {
                agente.pontuacao -= 10;
                mundo.flechasDisparadas += 1;
                agente.flechas -= 1;
                agente.listaBrancaSuspeitaFedor.push([x, y]);
                agente.mundoImaginario[x][y].suspeitaFedor = false;
                salaSuspeita = false;

                // se existe um wumpus na posicao onde ele atirou
                if (mundo.mundo[x][y].wumpus !== null && mundo.mundo[x][y].wumpus.vivo == true) {
                    mundo.posicoesWumpus.push([x, y]);
                    agente.pontuacao += 1000;
                    mundo.mundo[x][y].wumpus.vivo = false;
                    //guarda a posicao do wumpus, agora ele sabe onde ta
                    agente.posicoesObjetivo.push([x, y, false]);
                    let novoWUmpus = new Wumpus();
                    novoWUmpus.vivo = false;
                    agente.mundoImaginario[x][y].wumpus = novoWUmpus;
                    agente.imaginarMundo(x > y ? x : y);
                    mundo.wumpusMortos += 1;
                    document.getElementById(x + "," + y + "_wumpus").src = "textures/canvaWumpusMorto.png";
                    document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;

                } else {
                    console.log("errou! ------------------------------------------------");
                }

                console.log(`tiro na sala (${x}, ${y}).`);
                document.getElementById("flechasNumero").textContent = agente.flechas;
                document.getElementById("pontuacao").textContent = agente.pontuacao;
                document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;
            }
        }
    }

    return salaSuspeita;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//verifica wumpus e buraco ao mesmo tempo, assim o agente pode se desviar dos dois, quando possivel
function verificarMovimento(x, y, agente, mundo) {
    return verificarCaminho(x, y, agente, mundo) &&
        !verificarSuspeitaBuraco(x, y, agente) &&
        !verificarSuspeitaWumpus(x, y, agente, mundo);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//usa o log de movimentos que o agente guarda para verificar se ha algum padrao, indicando que ele ficou preso atras de obastaculos
function verificarPadraoDeMovimentos(agente) {
    let padraoDeMovimentos = false;
    if (agente.pilhaDeMovimentos.length >= 4) {
        let movimentos = agente.pilhaDeMovimentos.slice(-12).join("");
        let expressaoRegex = new RegExp(/(.{3,}.*)\1+/);
        let expressaoRegexMovimentoLinear = new RegExp(/(.)\1{4,}/);

        if (!expressaoRegexMovimentoLinear.test(movimentos)) {
            if (expressaoRegex.test(movimentos)) {
                padraoDeMovimentos = true;
                agente.pilhaDeMovimentos = [agente.pilhaDeMovimentos.at(-1)];
            } else {
                expressaoRegex = new RegExp(/(.{4,}?)(?:\1)+/);
                movimentos = agente.pilhaDeMovimentos.slice(-50).join("");
                padraoDeMovimentos = expressaoRegex.test(movimentos);
                if (padraoDeMovimentos) {
                    agente.pilhaDeMovimentos = [agente.pilhaDeMovimentos.at(-1)];
                }
            }
        }
    }
    return padraoDeMovimentos;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ve se o seu diario possui objetivos anotados, se sim, ele ira atras
function verificarObjetivosNoMapa(agente) {
    let objetivoNoMapa = false;
    let posicaoObjetivoNoMapa = [];

    for (let obj of agente.posicoesObjetivo) {
        if (obj[2]) {
            objetivoNoMapa = true;
            posicaoObjetivoNoMapa = obj;
            break;
        }
    }

    return { objetivoNoMapa, posicaoObjetivoNoMapa };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ve se ha salas pendentes a serem exploradas
function buscarSalasPendentes(agente, objetivoNoMapa) {
    let haSalasPendentes = false;
    let salaPosicao = [];

    buscaSalas: for (let x = 0; x < agente.mundoImaginario.length; x++) {
        for (let y = 0; y < agente.mundoImaginario[x].length; y++) {
            let sala = agente.mundoImaginario[x][y];
            if (!sala.passou && !objetivoNoMapa && !agente.carregandoOuro && !sala.suspeita && !sala.suspeitaFedor) {
                haSalasPendentes = true;
                sala.objetivo = true;
                salaPosicao = [x, y];
                console.log("buscando a sala:", salaPosicao);
                if (agente.procurarDeCima) break buscaSalas;
                else break;
            }
        }
    }
    return { haSalasPendentes, salaPosicao };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//tenta remover falsas suspeitas
function removerFalsasSuspeitas(agente) {
    for (let x = 0; x < agente.mundoImaginario.length; x++) {
        for (let y = 0; y < agente.mundoImaginario[x].length; y++) {
            let sala = agente.mundoImaginario[x][y];
            if (sala.suspeita || sala.suspeitaFedor) {
                let removerSuspeita = false;
                const direcoes = [[x - 1, y], [x + 1, y], [x, y + 1], [x, y - 1]];

                for (let [dx, dy] of direcoes) {
                    if (
                        dx >= 0 && dx < agente.mundoImaginario.length &&
                        dy >= 0 && dy < agente.mundoImaginario[dx].length &&
                        agente.mundoImaginario[dx][dy].passou &&
                        !(sala.suspeita ? agente.mundoImaginario[dx][dy].brisa : agente.mundoImaginario[dx][dy].fedor)
                    ) {
                        removerSuspeita = true;
                        break;
                    }
                }

                if (removerSuspeita) {
                    if (sala.suspeita) {
                        sala.suspeita = false;
                        agente.listaBrancaSuspeita.push([x, y]);
                        console.log(`Removendo suspeita de (${x}, ${y}) e adicionando à lista branca.`);
                    } else {
                        sala.suspeitaFedor = false;
                        agente.listaBrancaSuspeitaFedor.push([x, y]);
                        console.log(`Removendo suspeita de FEDOR (${x}, ${y}) e adicionando à lista branca.`);
                    }
                }
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verificarSalasSuspeitas(agente) {
    for (let x = 0; x < agente.mundoImaginario.length; x++) {
        for (let y = 0; y < agente.mundoImaginario[x].length; y++) {
            let sala = agente.mundoImaginario[x][y];
            if (sala.suspeitaFedor) {
                return true;
            }
        }
    }
    return false;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function encontrarSalaSuspeitaDeWumpus(agente) {
    for (let x = 0; x < agente.mundoImaginario.length; x++) {
        for (let y = 0; y < agente.mundoImaginario[x].length; y++) {
            if (agente.mundoImaginario[x][y].suspeitaFedor) {
                return [x, y]; // Retorna a posição da primeira sala suspeita de Wumpus encontrada
            }
        }
    }
    return null; // Retorna null se não encontrar nenhuma suspeita
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function rodarGame(mundo) {
    document.getElementById("agente").remove();
    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    let padraoDeMovimentos = verificarPadraoDeMovimentos(agente);
    let { objetivoNoMapa, posicaoObjetivoNoMapa } = verificarObjetivosNoMapa(agente);
    let { haSalasPendentes, salaPosicao } = buscarSalasPendentes(agente, objetivoNoMapa);
    removerFalsasSuspeitas(agente);


    //se o agente nao tem mais o que fazer no mapa, a unica opcao é tentar a sorte nas salas suspeitas de wumpus
    //pois isso significa que o proximo ouro esta la
    let haSalasSuspeitas = verificarSalasSuspeitas(agente);
    if (!agente.carregandoOuro && !haSalasPendentes && !objetivoNoMapa && haSalasSuspeitas) {
        salaPosicao = encontrarSalaSuspeitaDeWumpus(agente);
        if (salaPosicao !== null) {
            haSalasPendentes = true;
        }
    }

    let ultimoMovimento = agente.pilhaDeMovimentos[agente.pilhaDeMovimentos.length - 1];

    agente.imaginarMundo(agente.x);

    //o agente possui um objetivo claro no mapa
    if (!padraoDeMovimentos && objetivoNoMapa && agente.y < posicaoObjetivoNoMapa[1] && verificarMovimento(agente.x, agente.y + 1, agente, mundo) && ultimoMovimento !== "O") {
        console.log("Buscando objetivo: movendo para Leste");
        agente.moverLeste();
    } else if (!padraoDeMovimentos && objetivoNoMapa && agente.x < posicaoObjetivoNoMapa[0] && verificarMovimento(agente.x + 1, agente.y, agente, mundo) && ultimoMovimento !== "N") {
        console.log("Buscando objetivo: movendo para Sul");
        agente.moverSul();
    } else if (!padraoDeMovimentos && objetivoNoMapa && agente.y > posicaoObjetivoNoMapa[1] && verificarMovimento(agente.x, agente.y - 1, agente, mundo) && ultimoMovimento !== "L") {
        console.log("Buscando objetivo: movendo para Oeste");
        agente.moverOeste();
    } else if (!padraoDeMovimentos && objetivoNoMapa && agente.x > posicaoObjetivoNoMapa[0] && verificarMovimento(agente.x - 1, agente.y, agente, mundo) && ultimoMovimento !== "S") {
        console.log("Buscando objetivo: movendo para Norte");
        agente.moverNorte();
    }

    // Voltando para a origem com ouro
    else if (!padraoDeMovimentos && agente.carregandoOuro > 0 && verificarMovimento(agente.x - 1, agente.y, agente, mundo) && ultimoMovimento !== "S") {
        console.log("Voltando para a origem com ouro: movendo para Norte");
        agente.moverNorte();
    } else if (!padraoDeMovimentos && agente.carregandoOuro > 0 && verificarMovimento(agente.x, agente.y - 1, agente, mundo) && ultimoMovimento !== "L") {
        console.log("Voltando para a origem com ouro: movendo para Oeste");
        agente.moverOeste();
    } else if (!padraoDeMovimentos && agente.carregandoOuro > 0 && verificarMovimento(agente.x + 1, agente.y, agente, mundo) && ultimoMovimento !== "N") {
        console.log("Voltando para a origem com ouro: movendo para Sul");
        agente.moverSul();
    } else if (!padraoDeMovimentos && agente.carregandoOuro > 0 && verificarMovimento(agente.x, agente.y + 1, agente, mundo) && ultimoMovimento !== "O") {
        console.log("Voltando para a origem com ouro: movendo para Leste");
        agente.moverLeste();
    }

    // Buscando salas pendentes
    else if (!padraoDeMovimentos && haSalasPendentes && agente.y < salaPosicao[1] && verificarMovimento(agente.x, agente.y + 1, agente, mundo) && ultimoMovimento !== "O") {
        console.log("Buscando salas pendentes: movendo para Leste");
        agente.moverLeste();
    } else if (!padraoDeMovimentos && haSalasPendentes && agente.x < salaPosicao[0] && verificarMovimento(agente.x + 1, agente.y, agente, mundo) && ultimoMovimento !== "N") {
        console.log("Buscando salas pendentes: movendo para Sul");
        agente.moverSul();
    } else if (!padraoDeMovimentos && haSalasPendentes && agente.y > salaPosicao[1] && verificarMovimento(agente.x, agente.y - 1, agente, mundo) && ultimoMovimento !== "L") {
        console.log("Buscando salas pendentes: movendo para Oeste");
        agente.moverOeste();
    } else if (!padraoDeMovimentos && haSalasPendentes && agente.x > salaPosicao[0] && verificarMovimento(agente.x - 1, agente.y, agente, mundo) && ultimoMovimento !== "S") {
        console.log("Buscando salas pendentes: movendo para Norte");
        agente.moverNorte();
    }

    // Expandindo o mundo
    else if (!padraoDeMovimentos && verificarMovimento(agente.x + 1, agente.y, agente, mundo) && ultimoMovimento !== "N") {
        console.log("Expandindo o mundo: movendo para Sul");
        agente.moverSul();
    } else if (!padraoDeMovimentos && verificarMovimento(agente.x, agente.y + 1, agente, mundo) && ultimoMovimento !== "O") {
        console.log("Expandindo o mundo: movendo para Leste");
        agente.moverLeste();
    } else if (!padraoDeMovimentos && verificarMovimento(agente.x - 1, agente.y, agente, mundo) && ultimoMovimento !== "S") {
        console.log("Expandindo o mundo: movendo para Norte");
        agente.moverNorte();
    } else if (!padraoDeMovimentos && verificarMovimento(agente.x, agente.y - 1, agente, mundo) && ultimoMovimento !== "L") {
        console.log("Expandindo o mundo: movendo para Oeste");
        agente.moverOeste();
    }

    // Movimento aleatório
    else {
        let movimentos = [];

        agente.qtdPadrao += 1;
        if (haSalasPendentes && agente.qtdPadrao > 10) {
            agente.procurarDeCima = !agente.procurarDeCima;
            agente.mundoImaginario[salaPosicao[0]][salaPosicao[1]].objetivo = false;
            salaPosicao = [];
            haSalasPendentes = false;
            agente.qtdPadrao = 0;
        }

        if (verificarCaminho(agente.x - 1, agente.y, agente, mundo)) {
            movimentos.push(() => { console.log("Moveu aleatório: Norte"); agente.moverNorte(); });
        }

        if (verificarCaminho(agente.x + 1, agente.y, agente, mundo)) {
            movimentos.push(() => { console.log("Moveu aleatório: Sul"); agente.moverSul(); });
        }

        if (verificarCaminho(agente.x, agente.y + 1, agente, mundo)) {
            movimentos.push(() => { console.log("Moveu aleatório: Leste"); agente.moverLeste(); });
        }

        if (verificarCaminho(agente.x, agente.y - 1, agente, mundo)) {
            movimentos.push(() => { console.log("Moveu aleatório: Oeste"); agente.moverOeste(); });
        }

        movimentos[Math.floor(Math.random() * movimentos.length)]();
        // }

    }

    agente.pontuacao -= 1;
    document.getElementById("pontuacao").textContent = agente.pontuacao;

    //achou ouro
    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);

        let posicaoExiste = false;
        for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
            // se a posicao ja existe
            if (agente.posicoesObjetivo[i][0] == agente.x && agente.posicoesObjetivo[i][1] == agente.y) {
                posicaoExiste = true;
                break;
            }
        }

        if (!posicaoExiste) {
            agente.posicoesObjetivo.push([agente.x, agente.y, false]);
        } else {
            for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
                if (agente.posicoesObjetivo[i][0] == agente.x && agente.posicoesObjetivo[i][1] == agente.y) {
                    agente.posicoesObjetivo[i][2] = false;
                    break;
                }
            }
        }

        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        agente.carregandoOuro += 1;
        agente.pontuacao -= 1;
        agente.pilhaDeMovimentos = [];
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
        document.getElementById("pontuacao").textContent = agente.pontuacao;
    }

    // achou para wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus) {
        if (mundo.mundo[agente.x][agente.y].wumpus.vivo) {

            for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
                agente.posicoesObjetivo[i][2] = true;
            }

            agente.posicoesObjetivo.push([agente.x, agente.y, true]);

            agente.x = agente.y = 0;
            agente.mortes += 1;
            agente.ouro = 0;
            agente.pontuacao -= 1000;

            mundo.agentesNumero += 1;
            document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", morto por canva" + "\n" + document.getElementById("logPontuacao").value;

            console.log("morto por wumpus!!!!!!!!!!");

            if (!document.getElementById("usarReencarnacao").checked) {
                agente.posicoesObjetivo = [];
                agente.listaBrancaSuspeita = [];
                agente.listaBrancaSuspeitaFedor = [];
                agente.mundoImaginario = [];
            }

            agente.pontuacao = 0;
            agente.flechas = mundo.wumpus;
            mundo.mortesPorWumpus += 1;
            document.getElementById("mortesPontuacao").textContent = agente.mortes;
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("mortes por wumpus").textContent = "Mortes por wumpus: " + mundo.mortesPorWumpus;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
            restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus, agente);
        } else {
            let achou = false;
            for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
                if (agente.x == agente.posicoesObjetivo[i][0] && agente.y == agente.posicoesObjetivo[i][1]) {
                    achou = true;

                    agente.posicoesObjetivo[i][2] = false;
                    break;
                }
            }
        }
    }

    //sentiu fedor
    if (mundo.mundo[agente.x][agente.y].fedor) {

        if (verificarCaminho(agente.x - 1, agente.y, agente, mundo)) {
            agente.imaginarMundo(agente.x - 1);
            if (!agente.mundoImaginario[agente.x - 1][agente.y].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeitaFedor.length; i++) {
                    if (agente.listaBrancaSuspeitaFedor[i][0] == agente.x - 1 && agente.listaBrancaSuspeitaFedor[i][1] == agente.y) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x - 1][agente.y].suspeitaFedor = true;
                    agente.mundoImaginario[agente.x - 1][agente.y].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x + 1, agente.y, agente, mundo)) {
            agente.imaginarMundo(agente.x + 1);
            if (!agente.mundoImaginario[agente.x + 1][agente.y].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeitaFedor.length; i++) {
                    if (agente.listaBrancaSuspeitaFedor[i][0] == agente.x + 1 && agente.listaBrancaSuspeitaFedor[i][1] == agente.y) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x + 1][agente.y].suspeitaFedor = true;
                    agente.mundoImaginario[agente.x + 1][agente.y].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x, agente.y + 1, agente, mundo)) {
            agente.imaginarMundo(agente.y + 1);
            if (!agente.mundoImaginario[agente.x][agente.y + 1].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeitaFedor.length; i++) {
                    if (agente.listaBrancaSuspeitaFedor[i][0] == agente.x && agente.listaBrancaSuspeitaFedor[i][1] == agente.y + 1) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x][agente.y + 1].suspeitaFedor = true;
                    agente.mundoImaginario[agente.x][agente.y + 1].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x, agente.y - 1, agente, mundo)) {
            agente.imaginarMundo(agente.y - 1);
            if (!agente.mundoImaginario[agente.x][agente.y - 1].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeitaFedor.length; i++) {
                    if (agente.listaBrancaSuspeitaFedor[i][0] == agente.x && agente.listaBrancaSuspeitaFedor[i][1] == agente.y - 1) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x][agente.y - 1].suspeitaFedor = true;
                    agente.mundoImaginario[agente.x][agente.y - 1].objetivo = false;
                }
            }
        }
    }

    // morreu para um buraco
    if (mundo.mundo[agente.x][agente.y].buraco) {
        console.log("morto por buraco!!!!!!!!!!");
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.pontuacao -= 1000;

        mundo.agentesNumero += 1;
        document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", morto por buraco" + "\n" + document.getElementById("logPontuacao").value;

        for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
            agente.posicoesObjetivo[i][2] = true;
        }

        if (!document.getElementById("usarReencarnacao").checked) {
            agente.posicoesObjetivo = [];
            agente.listaBrancaSuspeita = [];
            agente.listaBrancaSuspeitaFedor = [];
            agente.mundoImaginario = [];
        }

        agente.pontuacao = 0;
        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        mundo.mortesPorBuraco += 1;
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("mortes por buraco").textContent = "Mortes por buraco: " + mundo.mortesPorBuraco;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus, agente);
    }

    //sentiu brisa
    if (mundo.mundo[agente.x][agente.y].brisa) {

        if (verificarCaminho(agente.x - 1, agente.y, agente, mundo)) {
            agente.imaginarMundo(agente.x - 1);
            if (!agente.mundoImaginario[agente.x - 1][agente.y].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeita.length; i++) {
                    if (agente.listaBrancaSuspeita[i][0] == agente.x - 1 && agente.listaBrancaSuspeita[i][1] == agente.y) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x - 1][agente.y].suspeita = true;
                    agente.mundoImaginario[agente.x - 1][agente.y].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x + 1, agente.y, agente, mundo)) {
            agente.imaginarMundo(agente.x + 1);
            if (!agente.mundoImaginario[agente.x + 1][agente.y].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeita.length; i++) {
                    if (agente.listaBrancaSuspeita[i][0] == agente.x + 1 && agente.listaBrancaSuspeita[i][1] == agente.y) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x + 1][agente.y].suspeita = true;
                    agente.mundoImaginario[agente.x + 1][agente.y].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x, agente.y + 1, agente, mundo)) {
            agente.imaginarMundo(agente.y + 1);
            if (!agente.mundoImaginario[agente.x][agente.y + 1].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeita.length; i++) {
                    if (agente.listaBrancaSuspeita[i][0] == agente.x && agente.listaBrancaSuspeita[i][1] == agente.y + 1) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x][agente.y + 1].suspeita = true;
                    agente.mundoImaginario[agente.x][agente.y + 1].objetivo = false;
                }
            }
        }

        if (verificarCaminho(agente.x, agente.y - 1, agente, mundo)) {
            agente.imaginarMundo(agente.y - 1);
            if (!agente.mundoImaginario[agente.x][agente.y - 1].passou) {
                let listaBranca = false;
                for (let i = 0; i < agente.listaBrancaSuspeita.length; i++) {
                    if (agente.listaBrancaSuspeita[i][0] == agente.x && agente.listaBrancaSuspeita[i][1] == agente.y - 1) {
                        listaBranca = true;
                        break;
                    }
                }
                if (!listaBranca) {
                    agente.mundoImaginario[agente.x][agente.y - 1].suspeita = true;
                    agente.mundoImaginario[agente.x][agente.y - 1].objetivo = false;
                }
            }
        }
    }

    // chegou em 0,0 com ouro
    if (agente.x == 0 && agente.y == 0) {
        if (agente.carregandoOuro > 0) {
            mundo.ouroColetado += agente.carregandoOuro;
            document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
        }

        agente.carregandoOuro = 0;

        if (agente.ouro == ouro) {
            agente.vitorias += 1;
            agente.pontuacao += 1000;
            agente.ouro = 0;

            if (!document.getElementById("usarReencarnacao").checked) {
                agente.posicoesObjetivo = [];
                agente.listaBrancaSuspeita = [];
                agente.listaBrancaSuspeitaFedor = [];
                agente.mundoImaginario = [];
            }

            for (let i = 0; i < agente.posicoesObjetivo.length; i++) {
                agente.posicoesObjetivo[i][2] = true;
            }

            agente.pilhaDeMovimentos = [];
            mundo.agentesNumero += 1;
            document.getElementById("logPontuacao").value = "Agente " + mundo.agentesNumero + ": " + agente.pontuacao + ", VITÓRIA!!!!!!!!!!!!!!!!" + "\n" + document.getElementById("logPontuacao").value;
            agente.pontuacao = 0;
            agente.flechas = mundo.wumpus;

            document.getElementById("vitoriasPontuacao").textContent = agente.vitorias;
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
            restaurarMundo(mundo.mundo, posicoesOuro, posicoesWumpus, agente);
        }
    }

    if (agente.flechas > 0) {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoAgenteArmado.png\" id=\"agente\" alt=\"\">";
    } else {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoAgente.png\" id=\"agente\" alt=\"\">";
    }

    agente.posicoesObjetivo.sort((a, b) =>
        (b[2] - a[2]) || (a[0] - b[0]) || (a[1] - b[1])
    );
}
function agenteClique() {
    rodarGame(mundo)
}

function salvarMundo(mundo) {
    // Exporta o mundo para JSON
    const mundoJSON = mundo.exportarMundo();

    // Cria um link para download para o mundo
    const blob = new Blob([mundoJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mundo.json';
    a.click();
    URL.revokeObjectURL(url);
}

function carregarMundo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const mundoJSON = e.target.result;
            const mundoData = JSON.parse(mundoJSON);

            const novoMundo = new Mundo(mundoData.tamanho);
            novoMundo.importarMundo(mundoData);

            novoMundo.agente = new Agente(novoMundo.wumpus, novoMundo.mundo);
            mundo = novoMundo;

            document.getElementById("mapa").innerHTML = "";
            renderizarMapa(mapaTamanhoPixels, mundoData.tamanho, mundo, "mapa");

            console.log("Mundo carregado e agente reinicializado com sucesso!");
        };

        reader.readAsText(file);
    });

    input.click();
}

function carregarMundoPredefinido(nomeArquivo) {
    document.getElementById("botaoSalvarMundo").remove();
    document.getElementById("botaoImportarMundo").remove();

    const caminhoCompleto = `worlds/${nomeArquivo}.json`;

    fetch(caminhoCompleto)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o mundo: ${response.statusText}`);
            }
            return response.json();
        })
        .then(mundoData => {
            const novoMundo = new Mundo(mundoData.tamanho);
            novoMundo.importarMundo(mundoData);
            novoMundo.agente = new Agente(novoMundo.wumpus, novoMundo.mundo);

            mundo = novoMundo;
            d = mundoData.tamanho;

            document.getElementById("mapa").innerHTML = "";
            renderizarMapa(mapaTamanhoPixels, mundoData.tamanho, mundo, "mapa");

            console.log(`Mundo "${nomeArquivo}" carregado com sucesso!`);
            console.log(mundo);
        })
        .catch(error => {
            console.error("Erro ao carregar o mundo:", error);
        });
}

document.getElementById("botaoSalvarMundo").addEventListener("click", function () {
    salvarMundo(mundo);
});

document.getElementById("botaoImportarMundo").addEventListener("click", function () {
    carregarMundo();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("playPause").addEventListener("click", () => {
    if (rodando) {
        clearInterval(internal);
        internal = null;
        document.getElementById("playPause").style.backgroundImage = "url(textures/interface/playButton.png)";

        document.getElementById("mapa").addEventListener("click", agenteClique);
    } else {
        internal = setInterval(() => {
            rodarGame(mundo);
        }, velocidades[indiceVelocidade]);
        document.getElementById("playPause").style.backgroundImage = "url(textures/interface/pauseButton.png)";
        document.getElementById("mapa").removeEventListener("click", agenteClique);
    }
    rodando = !rodando;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("velocidadeLink").addEventListener("click", () => {
    if (rodando) {
        indiceVelocidade = (indiceVelocidade + 1) % velocidades.length;

        clearInterval(internal);
        internal = null;

        internal = setInterval(() => {
            rodarGame(mundo);
        }, velocidades[indiceVelocidade]);

        document.getElementById("velocidadeLink").textContent = (velocidades[indiceVelocidade] / 1000).toFixed(1);
    } else {
        indiceVelocidade = (indiceVelocidade + 1) % velocidades.length;
        document.getElementById("velocidadeLink").textContent = (velocidades[indiceVelocidade] / 1000).toFixed(1);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("atualizarMundo").addEventListener("click", function (event) {
    event.preventDefault();
    location.replace(location.href);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
    });
});

document.getElementById("inputTamanhoSala").addEventListener("change", () => {
    mapaTamanhoPixels = document.getElementById("inputTamanhoSala").value;
    localStorage.setItem("dimensaoSala", mapaTamanhoPixels);
    document.getElementById("mapa").innerHTML = "";
    renderizarMapa(mapaTamanhoPixels, d, mundo, "mapa");
    mundo.agente.imaginarMundo(0);
});

document.getElementById("mostrarSensacoes").addEventListener("change", () => {
    document.getElementById("mapa").innerHTML = "";
    renderizarMapa(mapaTamanhoPixels, d, mundo, "mapa");
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let d = localStorage.getItem("dimensaoMapa");
let mapaTamanhoPixels = localStorage.getItem("dimensaoSala");
let mundo;

let mundoSelecionado = localStorage.getItem("mundoSelecionado");
switch (mundoSelecionado) {
    case "4":
        carregarMundoPredefinido("4");
        break;
    case "5":
        carregarMundoPredefinido("5");
        break;
    case "10":
        carregarMundoPredefinido("10");
        break;
    case "15":
        carregarMundoPredefinido("15");
        break;
    case "20":
        carregarMundoPredefinido("20");
        break;
    default:
        mundo = new Mundo(d);
        mundo.agente = new Agente(mundo.wumpus, mundo.mundo);
        renderizarMapa(mapaTamanhoPixels, d, mundo, "mapa");
        console.log("Mundo inicial mantido.");
        break;
}

let velocidades = [2000, 1500, 1000, 500, 100];
let indiceVelocidade = 2;
document.getElementById("velocidadeLink").textContent = (velocidades[indiceVelocidade] / 1000).toFixed(1);

let internal = setInterval(() => {
    rodarGame(mundo);
}, velocidades[indiceVelocidade]);
let rodando = true;
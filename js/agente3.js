const Pontuacoes = {
    MOVIMENTO_INVALIDO: -2000, // Penalidade por movimento inválido
    MOVIMENTO_VALIDO: -100,       // Penalidade por movimento válido
    OURO_COLETADO: 2000,        // Recompensa por coletar ouro
    WUMPUS_MORTO: 2000,         // Recompensa por matar o Wumpus
    FLECHA_DISPARADA: -10,      // Penalidade por disparar uma flecha
    FLECHA_ERRADA: -500,        // Penalidade por errar o disparo
    MORTE_WUMPUS: -1000,        // Penalidade por morrer para o Wumpus
    MORTE_BURACO: -1000,        // Penalidade por morrer para um buraco
    VITORIA: 8000,              // Recompensa por vencer o jogo
    FIM_PERIODO: -250            // Recompensa por terminar o período sem morrer
};

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

//representa cada individuo da população
class Individuo {
    constructor(percurso, pontuacao, disparos) {
        this.percurso = percurso; //vetor percurso, guarda uma condfiguração aleatoria de movimentos
        this.disparos = disparos; //vetor de disparos, para quando o  agente detectar fedor
        this.i = 0; //indice do percurso
        this.j = 0 //indice dos disparos
        this.pontuacao = pontuacao;
        this.venceu = false;
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

        this.individuos = []; //armazena objetos do tipo individuo que representa a população
        this.individuoAtual = 0;

        this.mortes = 0;
        this.vitorias = 0;
        this.pontuacao = 0;
    }

    moverNorte() {
        const novaPosicaoX = this.x - 1;
        if (novaPosicaoX >= 0 && this.mundo[novaPosicaoX] && this.mundo[novaPosicaoX][this.y]) {
            this.sala = this.mundo[novaPosicaoX][this.y];
            this.x = novaPosicaoX;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
            console.log("moveu norte", this.x, this.y);
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            console.log("erro ao mover para o norte", this.x, this.y);
        }
    }

    moverSul() {
        const novaPosicaoX = this.x + 1;
        if (novaPosicaoX < this.mundo.length && this.mundo[novaPosicaoX] && this.mundo[novaPosicaoX][this.y]) {
            this.sala = this.mundo[novaPosicaoX][this.y];
            this.x = novaPosicaoX;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
            console.log("moveu sul", this.x, this.y);
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            console.log("erro ao mover para o sul", this.x, this.y);
        }
    }

    moverLeste() {
        const novaPosicaoY = this.y + 1;
        if (novaPosicaoY < this.mundo[this.x].length && this.mundo[this.x][novaPosicaoY]) {
            this.sala = this.mundo[this.x][novaPosicaoY];
            this.y = novaPosicaoY;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
            console.log("moveu leste", this.x, this.y);
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            console.log("erro ao mover para o leste", this.x, this.y);
        }
    }

    moverOeste() {
        const novaPosicaoY = this.y - 1;
        if (novaPosicaoY >= 0 && this.mundo[this.x][novaPosicaoY]) {
            this.sala = this.mundo[this.x][novaPosicaoY];
            this.y = novaPosicaoY;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
            console.log("moveu oeste", this.x, this.y);
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            console.log("erro ao mover para o oeste", this.x, this.y);
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
        this.contadorExecucoes = 1;

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

        // Restaura as salas do mundo
        for (let x = 0; x < tamanho; x++) {
            let temp = [];
            for (let y = 0; y < tamanho; y++) {
                let salaData = mundoData.mundo[x][y];
                let sala = new Sala(x, y);

                // Restaura as entidades na sala
                if (salaData.wumpus) {
                    sala.wumpus = new Wumpus();
                    sala.wumpus.vivo = true; // Sempre define o Wumpus como vivo
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
                salaDiv.innerHTML += "<img src=\"textures/linoNeandertalArmado.png\" id=\"agente\" alt=\"\">";
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

function restaurarMundo(mundo, posicoesOuro, posicoesWumpus) {
    posicoesOuro.forEach(([x, y]) => {
        mundo.mundo[x][y].ouro = true;
        document.getElementById(x + "," + y).innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + x + "," + y + "_ouroItem\" alt=\"\">";
    });

    if (posicoesWumpus != undefined) {
        posicoesWumpus.forEach(([x, y]) => {
            mundo.mundo[x][y].wumpus.vivo = true;
            document.getElementById(x + "," + y + "_wumpus").src = "textures/canvaWumpusVivo.png";
        });
    }

    posicoesWumpus.length = 0;
    posicoesOuro.length = 0;

}

//para criar um percurso inicial aleatório
function definirPercurso(mundo) {
    let agente = mundo.agente;
    //direções de movimentos possíveis
    let movimentos = [
        agente.moverNorte.bind(agente), agente.moverSul.bind(agente),
        agente.moverLeste.bind(agente), agente.moverOeste.bind(agente)
    ];

    //direções de disparo possíveis
    const direcoesDisparo = [
        agente.dispararNorte.bind(agente), agente.dispararSul.bind(agente),
        agente.dispararLeste.bind(agente), agente.dispararOeste.bind(agente)
    ];

    let individuos = [];
    for (let j = 0; j < 10; j++) {
        let percurso = [];
        let tamanhoPercurso = Math.floor(Math.random() * (d * 2)) + d * 2;

        //percurso aleatório que representa o dna do agente
        for (let i = 0; i < tamanhoPercurso; i++) {
            let movimentoAleatorio = movimentos[Math.floor(Math.random() * movimentos.length)];
            percurso.push(movimentoAleatorio);
        }

        //uma lista de disparos aleatórios referentes à exatamente a quantidade de flechas do agente
        let disparos = [];
        for (let i = 0; i < agente.flechas; i++) {
            let disparoAleatorio = direcoesDisparo[Math.floor(Math.random() * direcoesDisparo.length)];
            disparos.push(disparoAleatorio);
        }

        individuos.push(new Individuo(percurso, 0, disparos));
    }
    agente.individuos = individuos;
    console.log("geração 0");
    console.log(agente.individuos);
}

function selecaoDeInidividuos(agente, tamanhoTorneio = 5) {
    let torneio = [];
    for (let i = 0; i < tamanhoTorneio; i++) {
        let indiceAleatorio = Math.floor(Math.random() * agente.individuos.length);
        torneio.push(agente.individuos[indiceAleatorio]);
    }
    return torneio.reduce((melhor, atual) => (atual.pontuacao > melhor.pontuacao ? atual : melhor));
}


function reproduzirEvoluir(mundo) {
    let agente = mundo.agente;

    // usa de elitismo para manter o melhor individuo na população
    // melhora o desempenho do agente em mapas um pouco maiores
    const melhorIndividuo = agente.individuos.reduce((melhor, atual) =>
        (atual.pontuacao > melhor.pontuacao ? atual : melhor)
    );
    const indexMelhor = agente.individuos.indexOf(melhorIndividuo);
    agente.individuos.splice(indexMelhor, 1);

    // seleciona 3 indivíduos adicionais usando torneio
    //esses 3 somados com o melhor, irão para a reprodução
    const individuosSelecionados = [melhorIndividuo];
    for (let i = 0; i < 3; i++) {
        const individuo = selecaoDeInidividuos(agente);
        const index = agente.individuos.indexOf(individuo);
        agente.individuos.splice(index, 1);
        individuosSelecionados.push(individuo);
    }

    let individuos = [melhorIndividuo]; //o melhor individuo, alem de ir para a reprodução, também vai fazer parte da população
    //isso é elitismo!

    // Gera 9 descendentes a partir de combinações entre os 4 indivíduos selecionados
    for (let i = 0; i < 9; i++) {
        let individuo1 = individuosSelecionados[Math.floor(Math.random() * individuosSelecionados.length)];
        let individuo2;

        // Garante que individuo2 seja diferente de individuo1
        do {
            individuo2 = individuosSelecionados[Math.floor(Math.random() * individuosSelecionados.length)];
        } while (individuo1 === individuo2);

        const percurso = misturarVetores(individuo1.percurso, individuo2.percurso);
        const disparos = misturarVetores(individuo1.disparos, individuo2.disparos);

        const descendente = new Individuo(percurso, 0, disparos);

        // Taxa de mutação dinâmica baseada no desempenho do melhor indivíduo
        const taxaMutacaoBase = 0.1 + (0.2 * (1 - (melhorIndividuo.pontuacao / Pontuacoes.VITORIA)));
        const taxaMutacao = Math.max(0.1, taxaMutacaoBase); // Nunca deixa a mutação abaixo de 0.1


        //taxa de mutação estática
        // const taxaMutacao = 0.5;
        mutarIndividuo(descendente, mundo, taxaMutacao);

        individuos.push(descendente);
    }


    agente.individuos = individuos;

    console.log("nova geração");
    console.log(agente.individuos);
}

function mutarIndividuo(individuo, mundo, taxaMutacao) {
    const TAMANHO_MAXIMO_PERcurso = d * 1000; // Defina um tamanho máximo

    // Mutação do percurso existente
    for (let i = 0; i < individuo.percurso.length; i++) {
        if (Math.random() < taxaMutacao) {
            const movimentos = [
                mundo.agente.moverNorte.bind(mundo.agente),
                mundo.agente.moverSul.bind(mundo.agente),
                mundo.agente.moverLeste.bind(mundo.agente),
                mundo.agente.moverOeste.bind(mundo.agente)
            ];
            individuo.percurso[i] = movimentos[Math.floor(Math.random() * movimentos.length)];
        }
    }

    // Adicionando d movimentos aleatórios ao percurso
    for (let i = 0; i < d; i++) {
        const movimentos = [
            mundo.agente.moverNorte.bind(mundo.agente),
            mundo.agente.moverSul.bind(mundo.agente),
            mundo.agente.moverLeste.bind(mundo.agente),
            mundo.agente.moverOeste.bind(mundo.agente)
        ];
        individuo.percurso.push(movimentos[Math.floor(Math.random() * movimentos.length)]);
    }

    // Limitar o tamanho do percurso
    if (individuo.percurso.length > TAMANHO_MAXIMO_PERcurso) {
        individuo.percurso = individuo.percurso.slice(0, TAMANHO_MAXIMO_PERcurso);
    }

    // Mutação dos disparos
    for (let i = 0; i < individuo.disparos.length; i++) {
        if (Math.random() < taxaMutacao) {
            const direcoesDisparo = [
                mundo.agente.dispararNorte.bind(mundo.agente),
                mundo.agente.dispararSul.bind(mundo.agente),
                mundo.agente.dispararLeste.bind(mundo.agente),
                mundo.agente.dispararOeste.bind(mundo.agente)
            ];
            individuo.disparos[i] = direcoesDisparo[Math.floor(Math.random() * direcoesDisparo.length)];
        }
    }
}


function misturarVetores(vetor1, vetor2) {
    const novoVetor = [];
    const tamanhoMaximo = Math.max(vetor1.length, vetor2.length);

    for (let i = 0; i < tamanhoMaximo; i++) {
        let escolhido;

        if (i < vetor1.length && i < vetor2.length) {
            escolhido = Math.random() < 0.5 ? vetor1[i] : vetor2[i];
        } else if (i < vetor1.length) {
            escolhido = vetor1[i];
        } else {
            escolhido = vetor2[i];
        }

        // Garantir que o escolhido seja uma função válida
        if (typeof escolhido === "function") {
            novoVetor.push(escolhido);
        } else {
            novoVetor.push(vetor1[0] || vetor2[0]);
        }
    }

    return novoVetor;
}

function rodarGame(mundo) {
    document.getElementById("agente").remove();

    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    let individuo = agente.individuos[agente.individuoAtual]; //resgata o individuo usado atualmente
    console.log("individuo: ", agente.individuoAtual, "passo: ", agente.individuos[agente.individuoAtual].i)
    individuo.percurso[individuo.i](); //acessando o passo atual do individuo no seu percurso
    individuo.i += 1; //após o passo, soma o indice

    agente.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
    document.getElementById("pontuacao").textContent = agente.pontuacao;
    // console.log(agente.x, agente.y);

    // morreu para wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus) {
        if (mundo.mundo[agente.x][agente.y].wumpus.vivo) {
            agente.x = agente.y = 0;
            agente.mortes += 1;
            agente.ouro = 0;
            agente.pontuacao += Pontuacoes.MORTE_WUMPUS;

            agente.flechas = mundo.wumpus;
            mundo.mortesPorWumpus += 1;
            restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

            //quando o agente é morto e seu percurso nao acabou, o game ja encerra alterando o indice do agente testado
            individuo.pontuacao = agente.pontuacao;
            individuo.i = 0;
            document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", morto por wumpus" + "\n" + document.getElementById("logPontuacao").value;
            agente.individuoAtual += 1;

            if (agente.individuoAtual == agente.individuos.length) {
                reproduzirEvoluir(mundo);
                agente.individuoAtual = 0;
                document.getElementById("logPontuacao").value = "-- GERAÇÃO " + mundo.contadorExecucoes + " --\n" + document.getElementById("logPontuacao").value;
                mundo.contadorExecucoes += 1;
            }


            agente.pontuacao = 0;
            document.getElementById("mortesPontuacao").textContent = agente.mortes;
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("mortes por wumpus").textContent = "Mortes por wumpus: " + mundo.mortesPorWumpus;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
        }
    }

    // morreu para um buraco
    if (mundo.mundo[agente.x][agente.y].buraco) {
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.pontuacao += Pontuacoes.MORTE_BURACO;

        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        mundo.mortesPorBuraco += 1;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

        //quando o agente é morto e seu percurso nao acabou, o game ja encerra alterando o indice do agente testado
        individuo.pontuacao = agente.pontuacao;
        individuo.i = 0;
        document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", morto por buraco" + "\n" + document.getElementById("logPontuacao").value;
        agente.individuoAtual += 1;

        if (agente.individuoAtual == agente.individuos.length) {
            reproduzirEvoluir(mundo);
            agente.individuoAtual = 0;
            document.getElementById("logPontuacao").value = "-- GERAÇÃO " + mundo.contadorExecucoes + " --\n" + document.getElementById("logPontuacao").value;
            mundo.contadorExecucoes += 1;
        }


        agente.pontuacao = 0;
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("mortes por buraco").textContent = "Mortes por buraco: " + mundo.mortesPorBuraco;
        document.getElementById("pontuacao").textContent = agente.pontuacao
    }

    //achou ouro
    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);
        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        agente.pontuacao += Pontuacoes.OURO_COLETADO;
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
        document.getElementById("pontuacao").textContent = agente.pontuacao;
    }

    //sentiu fedor, disparou
    if (mundo.mundo[agente.x][agente.y].fedor && agente.flechas > 0) {
        agente.pontuacao += Pontuacoes.FLECHA_DISPARADA;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        mundo.flechasDisparadas += 1;

        //caso o agente sinta o fedor, ele usará os disparos de sua lista
        let morreu = individuo.disparos[individuo.j]();
        individuo.j += 1;

        if (individuo.j == individuo.disparos.length) {
            individuo.j = 0;
        }

        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;

        if (morreu[0]) {
            // console.log(morreu[1], morreu[2]);
            agente.pontuacao += Pontuacoes.WUMPUS_MORTO;
            posicoesWumpus.push([morreu[1], morreu[2]]);
            document.getElementById(morreu[1] + "," + morreu[2] + "_wumpus").src = "textures/canvaWumpusMorto.png";
            mundo.wumpusMortos += 1;
            document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;
        } else {
            agente.pontuacao += Pontuacoes.FLECHA_ERRADA;
        }

    }

    // chegou em 0,0 com ouro
    if (agente.x == 0 && agente.y == 0 && agente.ouro == ouro) {
        agente.vitorias += 1;
        agente.pontuacao += Pontuacoes.VITORIA;
        agente.ouro = 0;

        agente.flechas = mundo.wumpus;
        mundo.ouroColetado += 1;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

        //quando o agente é morto e seu percurso nao acabou, o game ja encerra alterando o indice do agente testado
        individuo.pontuacao = agente.pontuacao;
        individuo.venceu = true;
        individuo.i = 0;
        document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", VITÓRIA !!!!!!!!!!!!!!!!!" + "\n" + document.getElementById("logPontuacao").value;
        agente.individuoAtual += 1;

        if (agente.individuoAtual == agente.individuos.length) {
            reproduzirEvoluir(mundo);
            agente.individuoAtual = 0;
            document.getElementById("logPontuacao").value = "-- GERAÇÃO " + mundo.contadorExecucoes + " --\n" + document.getElementById("logPontuacao").value;
            mundo.contadorExecucoes += 1;
        }


        agente.pontuacao = 0;
        document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
        document.getElementById("vitoriasPontuacao").textContent = agente.vitorias;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
    }

    if (agente.flechas > 0) {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoNeandertalArmado.png\" id=\"agente\" alt=\"\">";
    } else {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoNeandertal.png\" id=\"agente\" alt=\"\">";
    }

    //verifica se o percurso do agente ja acabou comparando o indice com a quantidade de movimentos
    if (individuo.i == individuo.percurso.length) {
        //zera o indice do agente atual, atribui a pontuação, zera a pontuação do agente e altera o indice
        individuo.i = 0;
        agente.pontuacao += Pontuacoes.FIM_PERIODO;
        individuo.pontuacao = agente.pontuacao;
        agente.pontuacao = 0;

        //nao terminar é consierado morte
        agente.mortes += 1;
        document.getElementById("mortesPontuacao").textContent = agente.mortes;

        agente.x = agente.y = 0;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);
        agente.flechas = mundo.wumpus;
        agente.ouro = 0;

        document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", fim do percurso" + "\n" + document.getElementById("logPontuacao").value;
        agente.individuoAtual += 1;

    }

    // caso o indice passe, ele volta
    if (agente.individuoAtual == agente.individuos.length) {
        // console.log(agente.individuos);
        reproduzirEvoluir(mundo);
        agente.individuoAtual = 0;
        document.getElementById("logPontuacao").value = "-- GERAÇÃO " + mundo.contadorExecucoes + " --\n" + document.getElementById("logPontuacao").value;
        mundo.contadorExecucoes += 1;
    }
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

            // Cria um novo mundo e importa os dados
            const novoMundo = new Mundo(mundoData.tamanho);
            novoMundo.importarMundo(mundoData);

            // Recria o agente no novo mundo
            novoMundo.agente = new Agente(novoMundo.wumpus, novoMundo.mundo);
            mundo = novoMundo;
            d = mundoData.tamanho;

            //renderizar o novo mundo
            document.getElementById("mapa").innerHTML = "";
            renderizarMapa(mapaTamanhoPixels, mundoData.tamanho, mundo);

            console.log("Mundo carregado e agente reinicializado com sucesso!");
        };

        reader.readAsText(file);
    });

    input.click();
}

// caso o usuario queira escolher um dos mundos predefinidos
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
            renderizarMapa(mapaTamanhoPixels, mundoData.tamanho, mundo);
            definirPercurso(mundo);
            console.log(mundo);
            console.log(`Mundo "${nomeArquivo}" carregado com sucesso!`);
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

document.getElementById("playPause").addEventListener("click", () => {
    if (rodando) {
        clearInterval(internal);
        internal = null;
        document.getElementById("playPause").style.backgroundImage = "url(textures/interface/playButton.png)";

    } else {
        internal = setInterval(() => {
            rodarGame(mundo);
        }, velocidades[indiceVelocidade]);
        document.getElementById("playPause").style.backgroundImage = "url(textures/interface/pauseButton.png)";
    }
    rodando = !rodando;
});

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

document.getElementById("atualizarMundo").addEventListener("click", function (event) {
    event.preventDefault();
    location.replace(location.href);
});

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
    });
});

document.getElementById("mostrarSensacoes").addEventListener("change", () => {
    document.getElementById("mapa").innerHTML = "";
    renderizarMapa(mapaTamanhoPixels, d, mundo, "mapa");
});

document.getElementById("inputTamanhoSala").addEventListener("change", () => {
    mapaTamanhoPixels = parseInt(document.getElementById("inputTamanhoSala").value);
    localStorage.setItem("dimensaoSala", mapaTamanhoPixels);

    document.getElementById("mapa").innerHTML = "";
    renderizarMapa(mapaTamanhoPixels, d, mundo);
    console.log("Tamanho das salas atualizado para:", mapaTamanhoPixels);
});

document.getElementById("fieldMapaImaginario").remove();
document.getElementById("usarReencarnacaoLabel").remove();
document.getElementById("usarReencarnacao").remove();

let d = localStorage.getItem("dimensaoMapa");
let mapaTamanhoPixels = localStorage.getItem("dimensaoSala");
let mundo;

//para verificar se o agente escolheu um dos mundos predefinidos
let mundoSelecionado = localStorage.getItem("mundoSelecionado");
switch (mundoSelecionado) {
    case "aleatorio":
        mundo = new Mundo(d);
        mundo.agente = new Agente(mundo.wumpus, mundo.mundo);
        definirPercurso(mundo);
        console.log(mundo.agente.individuos);
        renderizarMapa(mapaTamanhoPixels, d, mundo);
        console.log("Mundo inicial mantido.");
        document.getElementById("botaoSalvarMundo").style.display = "block";
        document.getElementById("botaoImportarMundo").style.display = "block";

        break;
    default:
        carregarMundoPredefinido(mundoSelecionado);
        break;

}

let velocidades = [2000, 1500, 1000, 500, 100, 1];
let indiceVelocidade = 2;
document.getElementById("velocidadeLink").textContent = (velocidades[indiceVelocidade] / 1000).toFixed(1);

let internal = setInterval(() => {
    rodarGame(mundo);
}, velocidades[indiceVelocidade]);
let rodando = true;
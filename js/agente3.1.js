let dados = {
    totalGeracoes: 0,                   // Total de gerações executadas
    totalExecucoes: 0,                 // Total de execuções realizadas
    vitorias: 0,                      // Total de vitórias
    passosPorGeracao: [],             // Lista com número de passos por geração
    impactosParedePorGeracao: [],     // Lista com impactos na parede por geração
    geracoesParaPrimeiraVitoria: 0, // Geração em que ocorreu a primeira vitória
    vitoriasComWumpusEliminado: 0,    // Vitórias com eliminação do Wumpus
    mortesPorWumpus: 0,               // Total de mortes por Wumpus
    mortesPorBuraco: 0,               // Total de mortes por poço
    pontuacoesVitorias: [],           // Lista com pontuação das vitórias
    wumpusMortos: 0
};

const ValoresGeracao = {
    POPULACAO: 50,
    QTDGERACOES: 1000
}

const Pontuacoes = {
    MOVIMENTO_INVALIDO: -500, // Penalidade por movimento inválido
    MOVIMENTO_VALIDO: -50,       // Penalidade por movimento válido
    OURO_COLETADO: 5000,        // Recompensa por coletar ouro
    WUMPUS_MORTO: 3000,         // Recompensa por matar o Wumpus
    FLECHA_DISPARADA: -100,      // Penalidade por disparar uma flecha
    FLECHA_ERRADA: -2000,        // Penalidade por errar o disparo
    MORTE_WUMPUS: -5000,        // Penalidade por morrer para o Wumpus
    MORTE_BURACO: -5000,        // Penalidade por morrer para um buraco
    VITORIA: 20000,              // Recompensa por vencer o jogo
    FIM_PERIODO: 500            // Recompensa por terminar o período sem morrer
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

        this.impactosParede = 0;
        this.matouWumpus = false;
    }

    moverNorte() {
        const novaPosicaoX = this.x - 1;
        if (novaPosicaoX >= 0 && this.mundo[novaPosicaoX] && this.mundo[novaPosicaoX][this.y]) {
            this.sala = this.mundo[novaPosicaoX][this.y];
            this.x = novaPosicaoX;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            this.impactosParede += 1;
        }
    }

    moverSul() {
        const novaPosicaoX = this.x + 1;
        if (novaPosicaoX < this.mundo.length && this.mundo[novaPosicaoX] && this.mundo[novaPosicaoX][this.y]) {
            this.sala = this.mundo[novaPosicaoX][this.y];
            this.x = novaPosicaoX;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            this.impactosParede += 1;
        }
    }

    moverLeste() {
        const novaPosicaoY = this.y + 1;
        if (novaPosicaoY < this.mundo[this.x].length && this.mundo[this.x][novaPosicaoY]) {
            this.sala = this.mundo[this.x][novaPosicaoY];
            this.y = novaPosicaoY;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            this.impactosParede += 1;
        }
    }

    moverOeste() {
        const novaPosicaoY = this.y - 1;
        if (novaPosicaoY >= 0 && this.mundo[this.x][novaPosicaoY]) {
            this.sala = this.mundo[this.x][novaPosicaoY];
            this.y = novaPosicaoY;
            this.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;
        } else {
            this.pontuacao += Pontuacoes.MOVIMENTO_INVALIDO;
            this.impactosParede += 1;
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
    for (let j = 0; j < ValoresGeracao.POPULACAO; j++) {
        let percurso = [];
        // let tamanhoPercurso = Math.floor(Math.random() * (d * 2)) + d * 2;
        let tamanhoPercurso = d * 10;

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
    let totalIndividuos = agente.individuos.length;
    let quantidadeSelecionados = Math.floor(totalIndividuos * 0.85);

    dados.impactosParedePorGeracao.push(agente.impactosParede);
    agente.impactosParede = 0;

    // Usa elitismo para manter o melhor indivíduo
    const melhorIndividuo = agente.individuos.reduce((melhor, atual) =>
        (atual.pontuacao > melhor.pontuacao ? atual : melhor)
    );
    const indexMelhor = agente.individuos.indexOf(melhorIndividuo);
    agente.individuos.splice(indexMelhor, 1);

    const individuosSelecionados = [melhorIndividuo];
    for (let i = 0; i < quantidadeSelecionados - 1; i++) {
        const individuo = selecaoDeInidividuos(agente);
        const index = agente.individuos.indexOf(individuo);
        agente.individuos.splice(index, 1);
        individuosSelecionados.push(individuo);
    }

    let individuos = [melhorIndividuo];

    for (let i = 0; i < ValoresGeracao.POPULACAO - 1; i++) {
        let individuo1 = individuosSelecionados[Math.floor(Math.random() * individuosSelecionados.length)];
        let individuo2;

        do {
            individuo2 = individuosSelecionados[Math.floor(Math.random() * individuosSelecionados.length)];
        } while (individuo1 === individuo2);

        const percurso = misturarVetores(individuo1.percurso, individuo2.percurso);
        const disparos = misturarVetores(individuo1.disparos, individuo2.disparos);

        const descendente = new Individuo(percurso, 0, disparos);

        mutarIndividuo(descendente, mundo, 0.05);

        individuos.push(descendente);
    }

    agente.individuos = individuos;

    geracoes += 1;

    if (dados.vitorias == 0) {
        dados.geracoesParaPrimeiraVitoria += 1;
    }
}


function mutarIndividuo(individuo, mundo, taxaMutacao) {
    const TAMANHO_MAXIMO_PERcurso = d * 100; // Defina um tamanho máximo

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
    console.log(dados);

    document.getElementById("agente").remove();

    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    let individuo = agente.individuos[agente.individuoAtual]; // Resgata o indivíduo usado atualmente
    individuo.percurso[individuo.i](); // Acessa o passo atual do indivíduo no seu percurso
    individuo.i += 1; // Após o passo, soma o índice

    agente.pontuacao += Pontuacoes.MOVIMENTO_VALIDO; // Corrigido: decrementa a pontuação
    document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela

    // Morreu para Wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus) {
        if (mundo.mundo[agente.x][agente.y].wumpus.vivo) {
            agente.x = agente.y = 0;
            agente.mortes += 1;
            agente.ouro = 0;
            agente.pontuacao += Pontuacoes.MORTE_WUMPUS;

            agente.flechas = mundo.wumpus;
            restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

            // Quando o agente é morto e seu percurso não acabou, o game já encerra alterando o índice do agente testado
            individuo.pontuacao = agente.pontuacao;
            individuo.i = 0;
            document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", morto por wumpus" + "\n" + document.getElementById("logPontuacao").value;

            agente.pontuacao = 0; // Reinicializa a pontuação do agente
            document.getElementById("flechasNumero").textContent = agente.flechas;
            document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
        }
    }

    // Morreu para um buraco
    if (mundo.mundo[agente.x][agente.y].buraco) {
        agente.x = agente.y = 0;
        agente.mortes += 1;
        agente.pontuacao += Pontuacoes.MORTE_BURACO;

        agente.ouro = 0;
        agente.flechas = mundo.wumpus;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

        // Quando o agente é morto e seu percurso não acabou, o game já encerra alterando o índice do agente testado
        individuo.pontuacao = agente.pontuacao;
        individuo.i = 0;
        document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", morto por buraco" + "\n" + document.getElementById("logPontuacao").value;

        agente.pontuacao = 0; // Reinicializa a pontuação do agente
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
    }

    // Achou ouro
    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);
        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        agente.pontuacao += Pontuacoes.OURO_COLETADO;
        document.getElementById(agente.x + "," + agente.y + "_ouroItem").remove();
        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
    }

    // Sentiu fedor, disparou
    if (mundo.mundo[agente.x][agente.y].fedor && agente.flechas > 0) {
        agente.pontuacao += Pontuacoes.FLECHA_DISPARADA;
        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela

        // Caso o agente sinta o fedor, ele usará os disparos de sua lista
        let morreu = individuo.disparos[individuo.j]();
        individuo.j += 1;

        if (individuo.j == individuo.disparos.length) {
            individuo.j = 0;
        }

        document.getElementById("flechasNumero").textContent = agente.flechas;

        if (morreu[0]) {
            agente.pontuacao += Pontuacoes.WUMPUS_MORTO;
            posicoesWumpus.push([morreu[1], morreu[2]]);
            document.getElementById(morreu[1] + "," + morreu[2] + "_wumpus").src = "textures/canvaWumpusMorto.png";
        } else {
            agente.pontuacao += Pontuacoes.FLECHA_ERRADA;
        }

        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
    }

    // Chegou em 0,0 com ouro
    if (agente.x == 0 && agente.y == 0 && agente.ouro == ouro) {
        agente.vitorias += 1;
        agente.pontuacao += Pontuacoes.VITORIA;
        agente.ouro = 0;

        agente.flechas = mundo.wumpus;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);

        // Quando o agente é morto e seu percurso não acabou, o game já encerra alterando o índice do agente testado
        individuo.pontuacao = agente.pontuacao;
        individuo.venceu = true;
        individuo.i = 0;
        document.getElementById("logPontuacao").value = "Agente " + agente.individuoAtual + ": " + individuo.pontuacao + ", VITÓRIA !!!!!!!!!!!!!!!!!" + "\n" + document.getElementById("logPontuacao").value;

        agente.pontuacao = 0; // Reinicializa a pontuação do agente
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
    }

    if (agente.flechas > 0) {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoNeandertalArmado.png\" id=\"agente\" alt=\"\">";
    } else {
        document.getElementById(agente.x + "," + agente.y).innerHTML += "<img src=\"textures/linoNeandertal.png\" id=\"agente\" alt=\"\">";
    }

    // Verifica se o percurso do agente já acabou comparando o índice com a quantidade de movimentos
    if (individuo.i == individuo.percurso.length) {
        // Zera o índice do agente atual, atribui a pontuação, zera a pontuação do agente e altera o índice
        individuo.i = 0;
        agente.pontuacao = 0;

        agente.x = agente.y = 0;
        restaurarMundo(mundo, posicoesOuro, posicoesWumpus);
        agente.flechas = mundo.wumpus;
        agente.ouro = 0;

        document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela
    }
}

function resetarMundo(mundo, posicoesOuro, posicoesWumpus) {
    posicoesOuro.forEach(([x, y]) => {
        mundo.mundo[x][y].ouro = true;
    });

    if (posicoesWumpus) {
        posicoesWumpus.forEach(([x, y]) => {
            mundo.mundo[x][y].wumpus.vivo = true;
        });
    }

    posicoesWumpus.length = 0;
    posicoesOuro.length = 0;
    mundo.agente.matouWumpus = false;
}


function rodarGameBack(mundo) {
    let agente = mundo.agente;
    let posicoesOuro = mundo.posicoesOuro;
    let ouro = mundo.ouro;
    let posicoesWumpus = mundo.posicoesWumpus;

    let individuo = agente.individuos[agente.individuoAtual];
    individuo.percurso[individuo.i]();
    individuo.i += 1;

    agente.pontuacao += Pontuacoes.MOVIMENTO_VALIDO;

    document.getElementById("pontuacao").textContent = agente.pontuacao; // Atualiza a pontuação na tela

    // encontrou wumpus
    if (mundo.mundo[agente.x][agente.y].wumpus?.vivo) {
        dados.mortesPorWumpus += 1;
        agente.mortes += 1;
        agente.pontuacao += Pontuacoes.MORTE_WUMPUS;
        document.getElementById("pontuacao").textContent = agente.pontuacao;

        mundo.mortesPorWumpus += 1;


        // Atualiza as estatísticas na tela
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("mortes por wumpus").textContent = "Mortes por wumpus: " + mundo.mortesPorWumpus;
    }

    // Morreu para buraco
    if (mundo.mundo[agente.x][agente.y].buraco) {
        dados.mortesPorBuraco += 1;
        agente.mortes += 1;
        agente.pontuacao += Pontuacoes.MORTE_BURACO;
        document.getElementById("pontuacao").textContent = agente.pontuacao;

        // Atualiza as estatísticas na tela
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("mortes por buraco").textContent = "Mortes por buraco: " + mundo.mortesPorBuraco;
    }

    // Achou ouro
    if (mundo.mundo[agente.x][agente.y].ouro) {
        posicoesOuro.push([agente.x, agente.y]);
        mundo.mundo[agente.x][agente.y].ouro = false;
        agente.ouro += 1;
        agente.pontuacao += Pontuacoes.OURO_COLETADO;
        document.getElementById("pontuacao").textContent = agente.pontuacao;

        // Atualiza as estatísticas na tela
        document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
    }

    // Sentiu fedor e disparou
    if (mundo.mundo[agente.x][agente.y].fedor && agente.flechas > 0) {
        agente.pontuacao += Pontuacoes.FLECHA_DISPARADA;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        mundo.flechasDisparadas += 1;
        let morreu = individuo.disparos[individuo.j]();
        individuo.j = (individuo.j + 1) % individuo.disparos.length;

        if (morreu[0]) {
            agente.matouWumpus = true;
            dados.wumpusMortos += 1;
            agente.pontuacao += Pontuacoes.WUMPUS_MORTO;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
            posicoesWumpus.push([morreu[1], morreu[2]]);
            mundo.wumpusMortos += 1;
            document.getElementById("Wumpus Mortos").textContent = "Canvas mortos: " + mundo.wumpusMortos;
        } else {
            agente.pontuacao += Pontuacoes.FLECHA_ERRADA;
            document.getElementById("pontuacao").textContent = agente.pontuacao;
        }

        // Atualiza as estatísticas na tela
        document.getElementById("flechasNumero").textContent = agente.flechas;
        document.getElementById("Flechas disparadas").textContent = "Tiros disparados: " + mundo.flechasDisparadas;
    }

    // Chegou em 0,0 com ouro
    if (agente.x === 0 && agente.y === 0 && agente.ouro === ouro) {
        dados.vitorias += 1;
        dados.pontuacoesVitorias.push(agente.pontuacao);

        if (agente.matouWumpus) {
            dados.vitoriasComWumpusEliminado += 1;
        }

        agente.vitorias += 1;
        agente.pontuacao += Pontuacoes.VITORIA;
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        agente.ouro = 0;

        agente.flechas = mundo.wumpus;
        mundo.ouroColetado += 1;
        resetarMundo(mundo, posicoesOuro, posicoesWumpus);

        // Atribui a pontuação ao indivíduo e reinicializa a pontuação do agente
        individuo.pontuacao = agente.pontuacao;
        individuo.venceu = true;
        individuo.i = 0;
        document.getElementById("logPontuacao").value = `Agente ${agente.individuoAtual}: ${individuo.pontuacao}, VITÓRIA !!!!!!!!!!!!!!!!!\n` + document.getElementById("logPontuacao").value;

        agente.pontuacao = 0; // Reinicializa a pontuação do agente
        agente.individuoAtual += 1;

        // Atualiza as estatísticas na tela
        document.getElementById("Ouro Coletado").textContent = "Azedinhas coletadas: " + mundo.ouroColetado;
        document.getElementById("vitoriasPontuacao").textContent = agente.vitorias;
        document.getElementById("flechasNumero").textContent = agente.flechas;
    }

    // Fim do percurso
    if (individuo.i === individuo.percurso.length) {
        dados.totalExecucoes += 1;
        individuo.i = 0;
        agente.pontuacao += Pontuacoes.FIM_PERIODO; // Aplica a penalidade de fim de período
        document.getElementById("pontuacao").textContent = agente.pontuacao;
        individuo.pontuacao = agente.pontuacao; // Atribui a pontuação ao indivíduo
        agente.pontuacao = 0; // Reinicializa a pontuação do agente

        agente.mortes += 1;
        agente.x = agente.y = 0;
        resetarMundo(mundo, posicoesOuro, posicoesWumpus);
        agente.flechas = mundo.wumpus;
        agente.ouro = 0;

        document.getElementById("logPontuacao").value = `Agente ${agente.individuoAtual}: ${individuo.pontuacao}, fim do percurso\n` + document.getElementById("logPontuacao").value;
        agente.individuoAtual += 1;

        // Atualiza as estatísticas na tela
        document.getElementById("mortesPontuacao").textContent = agente.mortes;
        document.getElementById("flechasNumero").textContent = agente.flechas;
    }

    // Verifica se todos os indivíduos foram avaliados
    if (agente.individuoAtual === agente.individuos.length) {
        reproduzirEvoluir(mundo);
        agente.individuoAtual = 0;
        document.getElementById("logPontuacao").value = `-- GERAÇÃO ${mundo.contadorExecucoes} --\n` + document.getElementById("logPontuacao").value;
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
            iniciarGame();
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
});

document.getElementById("botaoSalvarDados").addEventListener("click", () => {
    const dadosJSON = JSON.stringify(dados, null, 2); // Converte 'dados' para JSON com indentação
    const blob = new Blob([dadosJSON], { type: "application/json" }); // Cria o blob JSON
    const url = URL.createObjectURL(blob); // Cria uma URL para o blob

    const link = document.createElement("a");
    link.href = url;
    link.download = "dados.json"; // Nome do arquivo
    document.body.appendChild(link);
    link.click(); // Simula o clique para download
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Libera a URL
});

let geracoes = 0;
let internal;
let rodando;

function iniciarGame() {
    document.getElementById("telaCarregamento").style.display = "flex";

    // Permite que a interface atualize antes de começar a evolução
    setTimeout(() => {

        dados.totalGeracoes = ValoresGeracao.QTDGERACOES;

        while (geracoes < ValoresGeracao.QTDGERACOES) {
            rodarGameBack(mundo);
        }

        let agente = mundo.agente;
        let melhorIndividuo = agente.individuos[0];

        for (let i = 1; i < agente.individuos.length; i++) {
            if (agente.individuos[i].pontuacao > melhorIndividuo.pontuacao) {
                melhorIndividuo = agente.individuos[i];
            }
        }

        melhorIndividuo.pontuacao = 0;
        agente.individuos = [melhorIndividuo];
        agente.individuoAtual = 0;

        internal = setInterval(() => {
            rodarGame(mundo);
        }, velocidades[indiceVelocidade]);
        rodando = true;

        document.getElementById("telaCarregamento").style.display = "none";
    }, 100); // Pequeno atraso para garantir que a interface atualize
}


let velocidades = [2000, 1500, 1000, 500, 100, 1];
let indiceVelocidade = 2;
document.getElementById("velocidadeLink").textContent = (velocidades[indiceVelocidade] / 1000).toFixed(1);

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
        renderizarMapa(mapaTamanhoPixels, d, mundo);
        document.getElementById("botaoSalvarMundo").style.display = "block";
        document.getElementById("botaoImportarMundo").style.display = "block";
        iniciarGame();
        break;
    default:
        carregarMundoPredefinido(mundoSelecionado);

        break;

}
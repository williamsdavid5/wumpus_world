function mapaString(d) {
    //tags de cada elemento
    let pocoTag = "O";
    let outoTag = "$";
    let wumpusTag = ":(";
    let brisaTag = "p#";
    let fedorTag = "w#";

    //gera uma matriz preenchida
    matriz = Array.from({ length: d }, () => Array(d).fill("X"));

    //uma tag é associada a cada elemento
    let elementos = [
        { tag: outoTag, quantidade: ouro },
        { tag: pocoTag, quantidade: poco },
        { tag: wumpusTag, quantidade: wumpus }
    ];

    // a posições sao resgatadas para que os elementos possam ser atribuido aleatoriamente
    let posicoes = [];
    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            if (i !== 0 || j !== 0) {
                posicoes.push([i, j]);
            }

        }
    }

    //as posições resgatadas sao embaralhadas, assim os elementos serao inseridos de forma aleatoria
    posicoes.sort(() => Math.random() - 0.5);

    let index = 0;
    for (let { tag, quantidade } of elementos) {
        for (let k = 0; k < quantidade && index < posicoes.length; k++) {
            let [x, y] = posicoes[index++];

            if (tag === pocoTag) {
                matriz[x][y] = tag;
                marcarPerigo(matriz, x, y, d, brisaTag);
            } else if (tag === wumpusTag) {
                matriz[x][y] = tag;
                marcarPerigo(matriz, x, y, d, fedorTag);
            } else {
                if (matriz[x][y] === "X") {
                    matriz[x][y] = "";
                }

                matriz[x][y] += tag;
            }
        }
    }
    mapaStyle(d, matriz);
}

function marcarPerigo(matriz, x, y, d, perigotag) {
    let direcoes = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    for (let [dx, dy] of direcoes) {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < d && ny >= 0 && ny < d) {
            if (matriz[nx][ny] === "X") {
                matriz[nx][ny] = perigotag;
            } else if (!matriz[nx][ny].includes(perigotag) && matriz[nx][ny] !== "O" && matriz[nx][ny] !== ":(") {
                matriz[nx][ny] += perigotag;
            }
        }
    }
}


function mapaStyle(d, matriz) {

    mapaTamanho = 100;

    let mapa = document.getElementById("mapa");
    mapa.style.width = d * mapaTamanho + 'px';
    mapa.style.height = d * mapaTamanho + 'px';
    mapa.style.display = 'grid';
    mapa.style.gridTemplateColumns = 'repeat(' + d + ', ' + mapaTamanho + 'px)';
    mapa.style.gridTemplateRows = 'repeat(' + d + ', ' + mapaTamanho + 'px)';

    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            document.getElementById("mapa").innerHTML += "<div id=" + i + "," + j + " class = \"sala\"></div>"
        }
    }

    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            if (matriz[i][j].includes("O")) {
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/role.png\" id=\"buraco\" alt=\"\">";
                // document.getElementById(i + "," + j).innerHTML += "<h1>O</h1>";
            }
            if (matriz[i][j].includes(":(")) {
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/wumpus.png\" id=\"" + i + "," + j + "_wumpus\" class = \"wumpus\" alt=\"\">";
                // document.getElementById(i + "," + j).innerHTML += "<h1>:(</h1>";
            }
            if (matriz[i][j].includes("$")) {
                // document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/azedinha.png\" id=\"" + i + "," + j + "_ouroItem\" alt=\"\">";
            }
            if (matriz[i][j].includes("Ag")) {
                // document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
            }
            if (matriz[i][j].includes(":(dead")) {
                // document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/wumpus_dead.png\" id=\"" + i + "," + j + "_wumpusDead\" class = \"wumpus\" alt=\"\">";
            }
        }
    }

}

class Agente {
    constructor(flecha, x, y) {
        this.flecha = flecha;
        this.x = x;
        this.y = y;
        this.ouroColetado = 0;
    }

    disparar(x, y) {
        this.flecha = this.flecha - 1;
        if (matriz[x][y].includes(":(") && !matriz[x][y].includes("dead")) {
            return true;
        } else {
            return false;
        }
    }

    dispararNorte() {
        let grito = this.disparar(this.x, this.y - 1);
        return [grito, "n"];
    }

    dispararSul() {
        let grito = this.disparar(this.x, this.y + 1);
        return [grito, "s"];
    }

    dispararLeste() {
        let grito = this.disparar(this.x + 1, this.y);
        return [grito, "l"];
    }

    dispararOeste() {
        let grito = this.disparar(this.x - 1, this.y);
        return [grito, "o"];
    }

    andarNorte() {
        if (this.y > 0) {
            this.y -= 1;
        }
    }

    andarSul() {
        if (this.y < d - 1) {
            this.y += 1;
        }
    }

    andarLeste() {
        if (this.x < d - 1) {
            this.x += 1;
        }
    }

    andarOeste() {
        if (this.x > 0) {
            this.x -= 1;
        }
    }

    andarAleatorio() {
        let movimentos = [];

        if (this.y > 0) {
            movimentos.push(() => this.andarNorte());
        }
        if (this.y < d - 1) {
            movimentos.push(() => this.andarSul());
        }
        if (this.x > 0) {
            movimentos.push(() => this.andarOeste());
        }
        if (this.x < d - 1) {
            movimentos.push(() => this.andarLeste());
        }


        let movimentoEscolhido = movimentos[Math.floor(Math.random() * movimentos.length)];
        movimentoEscolhido();

    }

    dispararAleatorio() {
        let movimentos = [];

        if (this.y > 0) {
            movimentos.push(() => this.dispararNorte());
        }
        if (this.y < d - 1) {
            movimentos.push(() => this.dispararSul());
        }
        if (this.x > 0) {
            movimentos.push(() => this.dispararOeste());
        }
        if (this.x < d - 1) {
            movimentos.push(() => this.dispararLeste());
        }

        let movimentoEscolhido = movimentos[Math.floor(Math.random() * movimentos.length)];

        return movimentoEscolhido();

    }


    verificaPerigo() {
        if (matriz[this.x][this.y].includes("O") || matriz[this.x][this.y].includes(":(")) {
            if (matriz[this.x][this.y].includes("dead")) {
                return "wumpusMorto";
            } else {
                return "morto";
            }


        } else {
            if (this.x == 0 && this.y == 0 && ouroLocal.size == ouro) {
                return "ganhou";
            } else {
                if (matriz[this.x][this.y].includes("$")) {
                    this.ouroColetado += 1;
                    return "ouro";
                }
                if (matriz[this.x][this.y].includes("w#")) {
                    return ("fedor");
                }
                if (matriz[this.x][this.y].includes("p#")) {
                    return "brisa";
                }
            }
        }
        return "";
    }
}

function moveAgente() {
    agente1.andarAleatorio();

    console.log("moveu");
    console.log(agente1.x, agente1.y);

    let sensacao = agente1.verificaPerigo();
    console.log("sensacao: " + sensacao);

    if (sensacao.includes("morto") || sensacao.includes("ganhou")) {
        agente1.ouroColetado = 0;
        agente1.x = 0;
        agente1.y = 0;
        agente1.flecha = flecha;

        ouroLocal.forEach(valor => {
            let posicao = JSON.parse(valor);
            document.getElementById(posicao[0] + "," + posicao[1]).innerHTML +=
                "<img src=\"textures/azedinha.png\" id=\"" + posicao[0] + "," + posicao[1] + "_ouroItem\" alt=\"\">";

            matriz[posicao[0]][posicao[1]] = matriz[posicao[0]][posicao[1]] + "$";

        });
        ouroLocal.clear();

        document.querySelectorAll(".wumpus").forEach(elemento => {
            elemento.src = "textures/wumpus.png";
            let id = elemento.id;

            let coordenadas = id.split("_")[0];
            let [x, y] = coordenadas.split(",").map(Number);

            if (matriz[x][y].includes("dead")) {
                matriz[x][y] = matriz[x][y].replace("dead", "");

            }

        });

        if (sensacao.includes("ganhou")) {
            ganhou += 1;

        }

        if (sensacao.includes("morto")) {
            mortes += 1;

        }

        console.log("matriz restaurada");
        console.log(matriz);

    } else {
        if (sensacao.includes("ouro")) {

            ouroLocal.add(JSON.stringify([agente1.x, agente1.y]));

            matriz[agente1.x][agente1.y] = matriz[agente1.x][agente1.y].replace("$", "");
            console.log("remove ouro");
            document.getElementById(agente1.x + "," + agente1.y + "_ouroItem").remove();

            console.log("ouro coletado");
            console.log(matriz);

        }
        if (sensacao.includes("fedor")) {
            if (agente1.flecha > 0) {
                let resposta = agente1.dispararAleatorio();
                let disparo = resposta[0];
                console.log("disparo: " + disparo);

                let x = agente1.x;
                let y = agente1.y;

                if (disparo) {
                    switch (resposta[1]) {
                        case "n":
                            y -= 1;
                            break;
                        case "s":
                            y += 1;
                            break;
                        case "l":
                            x += 1;
                            break;
                        case "o":
                            x -= 1;
                            break;
                    }

                    matriz[x][y] = matriz[x][y].replace(":(", ":(dead");
                    console.log("remove wumpus");
                    document.getElementById(x + "," + y + "_wumpus").remove();

                    document.getElementById(x + "," + y).innerHTML += "<img src=\"textures/wumpus_dead.png\" id=\"" + x + "," + y + "_wumpusDead\" class = \"wumpus\" alt=\"\">";
                    console.log("matou");
                }
            }
        }
    }
    // agente1.verificaPerigo();
    console.log("remove agente");
    document.getElementById("agente").remove();

    document.getElementById(agente1.x + "," + agente1.y).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
    document.getElementById("mortes").innerHTML = "<p id=\"mortes\">" + mortes + "</p>";
    document.getElementById("ganhou").innerHTML = "<p id=\"mortes\">" + ganhou + "</p>";
    document.getElementById("flechas").innerHTML = "<p id=\"mortes\">" + agente1.flecha + "</p>";

}

let matriz = [];
let d = 4;
// define a quantidade de elementos, sempre com seus limites
let poco = Math.floor(Math.random() * (d - 1)) + 1;
let ouro = Math.floor(Math.random() * (d - poco - 1)) + 1;
// let wumpus = Math.floor(Math.random() * ouro) + 1;
let wumpus = ouro;
let flecha = wumpus;

let mortes = 0;
let ganhou = 0;
let ouroLocal = new Set();

mapaString(d);
console.log(matriz);

let agente1 = new Agente(flecha, 0, 0);
document.getElementById("0,0").innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";

document.getElementById("passoButton").addEventListener("click", moveAgente);

setInterval(moveAgente, 100);

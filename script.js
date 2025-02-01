function mapaString(d) {
    // define a quantidade de elementos, sempre com seus limites
    let poco = Math.floor(Math.random() * (d - 1)) + 1;
    let ouro = Math.floor(Math.random() * (d - poco - 1)) + 1;
    // let wumpus = Math.floor(Math.random() * ouro) + 1;
    let wumpus = ouro;
    let flecha = wumpus;

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
            if (matriz[nx][ny] == "X") {
                matriz[nx][ny] = perigotag;
            } else if (matriz[nx][ny] !== "O" && matriz[nx][ny] !== ":(") {
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
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/wumpus.png\" id=\"wumpus\" alt=\"\">";
                // document.getElementById(i + "," + j).innerHTML += "<h1>:(</h1>";
            }
            if (matriz[i][j].includes("$")) {
                // document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/gold_ingot.png\" id=\"ouroItem\" alt=\"\">";
            }
            if (matriz[i][j].includes("Ag")) {
                // document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
                document.getElementById(i + "," + j).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
            }
        }
    }

}

class Agente {
    constructor(flecha, x, y) {
        this.flecha = 1;
        this.x = 0;
        this.y = 0;
    }

    disparar(x, y) {
        this.flecha -= 1;
        if (matriz[x][y].includes(":(")) {
            return true;
        } else {
            return false;
        }
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

    verificaPerigo() {
        if (matriz[this.x][this.y].includes("O")) {
            console.log("morto")
        }
        if (matriz[this.x][this.y].includes(":(")) {
            console.log("morto")
        }
        if (matriz[this.x][this.y].includes("$")) {
            console.log("ouro")
        }
    }
}

function moveAgente() {
    // if (agente1.x > 0) {
    //     if (agente1.y > 0) {
    //         //move nas quatro direcoes
    //     }
    // } else {
    //     if (agente1.y > 0) {
    //         //move para a direita (leste), norte e sul
    //     } else {
    //         //move apenas para leste e sul
    //     }
    // }

    agente1.andarAleatorio();
    agente1.verificaPerigo();
    document.getElementById("agente").remove();
    document.getElementById(agente1.x + "," + agente1.y).innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";
    console.log(agente1.x, agente1.y);
}

let matriz = [];
let d = 4;
mapaString(d);
console.log(matriz);

let agente1 = new Agente(1, 0, 0);
document.getElementById("0,0").innerHTML += "<img src=\"textures/agente.png\" id=\"agente\" alt=\"\">";

document.getElementById("passoButton").addEventListener("click", moveAgente);


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
    let matriz = Array.from({ length: d }, () => Array(d).fill("X"));

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

    //essa matriz de posições é percorrida e os elementos sao inseridos baseado nela
    // let index = 0;
    // for (let { tag, quantidade } of elementos) {
    //     for (let k = 0; k < quantidade && index < posicoes.length; k++) {
    //         let [x, y] = posicoes[index++];

    //         if (tag == pocoTag) {
    //             if (matriz[x][y] === "X") {
    //                 matriz[x][y] = tag;
    //                 marcarPerigo(matriz, x, y, d, brisaTag)
    //             }
    //         } else {
    //             if (matriz[x][y] != pocoTag && matriz[x][y] != outoTag && matriz[x][y] !== wumpusTag) {
    //                 // matriz[x][y] = "";
    //                 if (matriz[x][y] === "X") {
    //                     matriz[x][y] = "";
    //                 }
    //                 matriz[x][y] += tag;
    //             } else if (matriz[x][y] === "X") {
    //                 matriz[x][y] = tag;
    //             }
    //         }
    //     }
    // }

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

    console.log(matriz);
    mapaStyle(d, matriz);

    // document.getElementById("saida").innerHTML = matriz.map(linha => linha.join(" | ")).join("<br>");
    // console.log(matriz)
    // document.getElementById("saidaDados").innerHTML = "<p> poço: " + poco + "</p>";
    // document.getElementById("saidaDados").innerHTML += "<p> ouro: " + ouro + "</p>";
    // document.getElementById("saidaDados").innerHTML += "<p> wumpus: " + wumpus + "</p>";
    // document.getElementById("saidaDados").innerHTML += "<p> flecha: " + flecha + "</p>";
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

    // for (let i = 0; i < d; i++) {
    //     for (let j = 0; j < d; j++) {
    //         if (matriz[i][j] === 'X') {
    //             document.getElementById("mapa").innerHTML += "<div id=\"sala\"></div>"
    //         }
    //         if (matriz[i][j] === 'O') {
    //             document.getElementById("mapa").innerHTML += "<div id=\"sala\"><div id=\"poco\"></div></div>"
    //         }
    //         if (matriz[i][j] === '$') {
    //             document.getElementById("mapa").innerHTML += "<div id=\"sala\"><h1>$</h1></div>"
    //         }
    //         if (matriz[i][j] === ':(') {
    //             document.getElementById("mapa").innerHTML += "<div id=\"sala\"><h1>:(</h1></div>"
    //         }
    //         if (matriz[i][j] === ':($' || matriz[i][j] === '$:(') {
    //             document.getElementById("mapa").innerHTML += "<div id=\"sala\"><h1>:( $</h1></div>"
    //         }
    //     }
    // }

    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            document.getElementById("mapa").innerHTML += "<div id=" + i + "," + j + " class = \"sala\"></div>"
        }
    }

    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            if (matriz[i][j].includes("O")) {
                document.getElementById(i + "," + j).innerHTML += "<h1>O</h1>";
            }
            if (matriz[i][j].includes(":(")) {
                document.getElementById(i + "," + j).innerHTML += "<h1>:(</h1>";
            }
            if (matriz[i][j].includes("$")) {
                document.getElementById(i + "," + j).innerHTML += "<h1>$</h1>";
            }
            if (matriz[i][j].includes("p#")) {
                document.getElementById(i + "," + j).innerHTML += "<p>brisa</p>";
            }
            if (matriz[i][j].includes("w#")) {
                document.getElementById(i + "," + j).innerHTML += "<p>fedor</p>";
            }
        }
    }

}

mapaString(4);
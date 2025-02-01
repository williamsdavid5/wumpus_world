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
    let wumpusTag = ":("

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

    posicoes.sort(() => Math.random() - 0.5);

    let index = 0;
    for (let { tag, quantidade } of elementos) {
        for (let k = 0; k < quantidade && index < posicoes.length; k++) {
            let [x, y] = posicoes[index++];

            if (tag == pocoTag) {
                if (matriz[x][y] === "X") {
                    matriz[x][y] = tag;
                }
            } else {
                if (matriz[x][y] != pocoTag && matriz[x][y] != outoTag && matriz[x][y] !== wumpusTag) {
                    // matriz[x][y] = "";
                    if (matriz[x][y] === "X") {
                        matriz[x][y] = "";
                    }
                    matriz[x][y] += tag;
                } else if (matriz[x][y] === "X") {
                    matriz[x][y] = tag;
                }
            }
        }
    }

    document.getElementById("saida").innerHTML = matriz.map(linha => linha.join(" | ")).join("<br>");
    console.log(matriz)
    document.getElementById("saidaDados").innerHTML = "<p> poço: " + poco + "</p>";
    document.getElementById("saidaDados").innerHTML += "<p> ouro: " + ouro + "</p>";
    document.getElementById("saidaDados").innerHTML += "<p> wumpus: " + wumpus + "</p>";
    document.getElementById("saidaDados").innerHTML += "<p> flecha: " + flecha + "</p>";
}


mapaString(4)
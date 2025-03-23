const tamanhoSala = document.getElementById("inputTamanhoSala");
const dimensaoMapa = document.getElementById("dimensaoMapa");
const agenteSelecionado = document.getElementById("opcoesDeAgente");
const salaImg = document.getElementById("backgroundSalaMenu");
const tamanhoString = document.getElementById('tamanhoSalaString');
const selecionarMundo = document.getElementById("selecionarMundo");

salaImg.style.width = tamanhoSala.value + 'px';
salaImg.style.height = 'auto';

tamanhoString.textContent = tamanhoSala.value + 'px';

tamanhoSala.addEventListener("input", function () {
    salaImg.style.width = tamanhoSala.value + 'px';
    tamanhoString.textContent = tamanhoSala.value + 'px';
});

document.getElementById("botaoIniciar").addEventListener("click", function () {
    localStorage.setItem("dimensaoSala", tamanhoSala.value);
    localStorage.setItem("dimensaoMapa", dimensaoMapa.value);
    localStorage.setItem("agente", agenteSelecionado.value);
    localStorage.setItem("mundoSelecionado", selecionarMundo.value);
    window.location.href = "game.html";
});

document.addEventListener("DOMContentLoaded", function () {
    selecionarMundo.selectedIndex = 0; // Seleciona a segunda opção // Define a opção ao carregar a página
});


selecionarMundo.addEventListener("change", function () {
    if (selecionarMundo.value === "aleatorio") {
        document.getElementById("dimensaoMapaString").style.display = "grid";
        document.getElementById("dimensaoMapa").style.display = "grid";
    } else {
        document.getElementById("dimensaoMapaString").style.display = "none";
        document.getElementById("dimensaoMapa").style.display = "none";
    }
});

let skins = [
    "textures/interface/linoRoboArmado.png",
    "textures/interface/linoAgenteArmadoMenu.png", // Corrigido caminho da imagem
    "textures/interface/linoNeandertalArmado.png"
];

agenteSelecionado.addEventListener("change", function () { // Corrigido nome do evento
    let agente = agenteSelecionado.value;
    let imagem = document.getElementById("skinLino");

    switch (agente) {
        case "agente1":
            imagem.src = skins[0];
            break;
        case "agente2":
            imagem.src = skins[1];
            break;
        case "agente3":
        case "agente3.1": // Agrupado para evitar repetição
            imagem.src = skins[2];
            break;
    }
});

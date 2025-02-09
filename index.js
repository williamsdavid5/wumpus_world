const tamanhoSala = document.getElementById("inputTamanhoSala");

const salaImg = document.getElementById("backgroundSalaMenu");
salaImg.style.width = tamanhoSala.value + 'px';
salaImg.style.height = 'auto';

const tamanhoString = document.getElementById('tamanhoSalaString');
tamanhoString.textContent = tamanhoSala.value + 'px';

tamanhoSala.addEventListener("input", function () {
    salaImg.style.width = tamanhoSala.value + 'px';
    tamanhoString.textContent = tamanhoSala.value + 'px';
});

const dimensaoMapa = document.getElementById("dimensaoMapa");
const mostrarSensacoes = document.getElementById("mostrarSensacoes");

document.getElementById("botaoIniciar").addEventListener("click", function () {
    localStorage.setItem("dimensaoSala", tamanhoSala.value);
    localStorage.setItem("dimensaoMapa", dimensaoMapa.value);
    localStorage.setItem("sensacoes", mostrarSensacoes.checked);

    window.location.href = "game.html";
});

console.log(mostrarSensacoes.value);
const agenteEscolhido = localStorage.getItem("agente");
const script = document.createElement("script");

switch (agenteEscolhido) {
    case "agente1":
        script.src = "js/agente1.js";
        document.body.appendChild(script);
        break;
    case "agente2":
        script.src = "js/agente2.js";
        document.body.appendChild(script);
        break;
    case "agenteManual":
        script.src = "js/agenteManual.js";
        document.body.appendChild(script);
        break;

}
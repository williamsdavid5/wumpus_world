# O Mundo de Wumpus
O Mundo de Wumpus é um ambiente clássico de teste para agentes inteligentes, utilizado amplamente na pesquisa de Inteligência Artificial (IA). Trata-se de um jogo baseado em lógica e tomada de decisão em um ambiente parcialmente observável e estocástico. O objetivo do agente é explorar um mundo quadrático (geralmente representado como uma grade 4x4) em busca de ouro, evitando buracos mortais e um monstro chamado Wumpus.

## Regras
1. O Agente: uma inteligência artificial controla um agente que pode se mover para frente, girar à esquerda ou à direita e disparar uma flecha.

2. Ouro: O objetivo principal é encontrar e coletar o ouro (ou ouros) no mapa.

3. Wumpus: O monstro Wumpus está escondido em uma célula e mata o agente caso ele entre nessa célula. No entanto, ele pode ser derrotado se o agente atirar uma flecha corretamente.

4. Buracos: Algumas células contêm buracos que levam à morte instantânea do agente.

## Percepções:

- Fedor: Indica que o Wumpus está em uma célula vizinha.

- Brisa: Indica que há um buraco em uma célula adjacente.

- Brilho: Indica a presença do ouro na célula atual.

- Grito: Se o agente ouvir um grito, significa que o Wumpus foi morto.

## Aplicação na Inteligência Artificial
O Mundo de Wumpus é utilizado para testar e desenvolver agentes inteligentes devido às seguintes características:

- Ambiente Parcialmente Observável: O agente só tem informações limitadas sobre o ambiente e precisa inferir os perigos com base em percepções.

- Raciocínio Lógico: A IA precisa utilizar inferências lógicas para determinar onde estão os perigos e planejar movimentos seguros.

- Tomada de Decisão Sob Incerteza: O agente pode precisar se arriscar, pois nem sempre há informações completas disponíveis.

- Planejamento e Busca: Algoritmos como Minimax, A* e lógica proposicional são frequentemente utilizados para guiar o agente no ambiente.

- Aprendizado: Algoritmos de aprendizado por reforço, como Q-Learning, podem ser aplicados para melhorar a navegação do agente ao longo do tempo.

# Sobre a Ferramenta

A ferramenta testa três versões do agente e uma versão modificada do Agente 1, cada uma com sua complexidade:

- **Agente 1**: Move-se aleatoriamente, não usa percepções de brisa, detecta percepções de fedor, mas atira em uma direção aleatória. Além disso, não se lembra das salas por onde já passou.

- **Agente 2**: Move-se aleatoriamente enquanto explora o mundo, lembra-se de onde já passou e usa percepções de brisa e fedor para julgar salas como suspeitas. Remove falsas suspeitas, confirma a presença do Wumpus por meio das percepções para melhorar a precisão dos disparos e utiliza um conjunto de regras para definir sua direção, minimizando o percurso.

- **Agente 3 (Agente 1 com AG)**: O Agente 1 agora não se move nem dispara aleatoriamente, mas usa um algoritmo genético para evoluir a cada execução. O agente evolui em tempo real.

- **Agente 3.1**: Um número definido de gerações joga no ambiente sem que o usuário veja. Dentre essas gerações, o agente com a melhor pontuação é escolhido e apresentado ao usuário.

# Interface de Usuário

Na tela inicial, o usuário pode escolher a versão do agente, o tamanho em pixels das salas para exibição e o mundo em que ele será inserido. Há cinco mundos predefinidos e uma opção **"Aleatório"**, onde o usuário pode definir um tamanho personalizado e alternar entre posições aleatórias das entidades.

Na tela do game, o usuário pode pausar a execução, alterar a velocidade dos passos (**clique no relógio!**) e atualizar o mundo.  
- **Se um mundo predefinido for selecionado**, ele será restaurado e a execução reiniciará.  
- **Se um mundo aleatório for selecionado**, um novo mundo aleatório será gerado.  

O usuário também pode:  
- Redimensionar a exibição usando o controle **"Tamanho das salas"**.  
- Mostrar ou ocultar as sensações durante a execução.  
- **Salvar os dados**, que serão compactados em um arquivo `.json` e baixados pelo navegador.

Caso o usuário tenha escolhido um mundo aleatório, ele poderá salvar esse mundo como um arquivo para carregar futuramente.

const snake = document.getElementById("snake");
const food = document.getElementById("food");
// Array para armazenar os segmentos da cobra
const snakeSegments = [];
//seta a  posicao da cabeca da cobra no array
let snakeX = 180
let snakeY = 180

//criando a comida
let foodX = 0
let foodY = 0
//chamando a posicao aleatoria 
updateFoodPosition()

//corrigindo bug de duas teclas
let keyProcessing = false;

// Direção inicial da cobra
let direction = "stopped";

// Tamanho do grid
const gridSize = 20;

// Defina a variável de pontuação
let score = 0;

// Defina a velocidade do jogo (em milissegundos)
let gameSpeed = 100; // Aumente esse valor para diminuir a velocidade

// Atualiza a posição da comida
function updateFoodPosition() {
	// Gera números aleatórios entre 0 e 19 (1-20) e multiplica por 20
    // para obter posições que estejam alinhadas com as células da grade
    let newFoodX, newFoodY;

    // Gere novas coordenadas de comida até que não coincidam com a posição da cobra
    do {
        newFoodX = Math.floor(Math.random() * 20) * 20;
        newFoodY = Math.floor(Math.random() * 20) * 20;
    } while (snakeSegments.some(segment => segment.x === newFoodX && segment.y === newFoodY));

    foodX = newFoodX;
    foodY = newFoodY;

    // Atualiza a posição visual da comida no elemento HTML usando estilos CSS
    food.style.left = foodX + "px"; // Define a posição horizontal
    food.style.top = foodY + "px"; // Define a posição vertical
}

let firstSegmentCreated = false;


// Função para atualizar a posição da cabeca da cobra
function updateSnakePosition(){
	
	// Determine a nova posição da cabeça da cobra com base na direção
    if (direction === "right") {
        snakeX += 20;
    } else if (direction === "left") {
        snakeX -= 20;
    } else if (direction === "down") {
        snakeY += 20;
    } else if (direction === "up") {
        snakeY -= 20;
    }

    // Cria um novo objeto representando a nova posição da cabeça da cobra
    const newHead = { x: snakeX, y: snakeY };

    // Verifica se a nova posição da cabeça coincide com a posição da comida
    if (snakeX === foodX && snakeY === foodY) {
        // Se ainda não houver segmentos, adicione o novo segmento
        if (snakeSegments.length === 0) {
            snakeSegments.push(newHead);
        } else {
            // Adicione a nova posição da cabeça no início do array
            snakeSegments.unshift(newHead);
        }
        // Atualize a posição da comida
        updateFoodPosition();
        // Aumenta a pontuação
        score += 10; // Ajuste conforme necessário
        gameSpeed -= 0.8
    	updateScoreDisplay();
    } else {
        // Se já houver segmentos, remova o último para manter o tamanho da cobra
        if (snakeSegments.length > 0) {
            snakeSegments.pop();
        }
        // Adicione a nova posição da cabeça no início do array
        snakeSegments.unshift(newHead);
    }

    // Verifica se o número de segmentos na cobra é maior que o número de elementos de segmentos
    // e cria elementos de segmentos adicionais conforme necessário
    while (snakeSegments.length > document.getElementsByClassName("segment").length) {
        const segmentElement = document.createElement("div");
        segmentElement.className = "segment";
        segmentElement.id = `segment-${snakeSegments.length - 1}`;
        document.getElementById("snakeSegments").appendChild(segmentElement);
    }
}

//verificando colisoes
function checkCollisions(){
	// Verifique se a cabeça da cobra colidiu com a comida
	if(snakeSegments[0] === foodX && snakeSegments[0] === foodY){
		// Mantém a cauda e adiciona a nova posição ao final dos segmentos
		snakeSegments.push({x: snakeX, y: snakeY})
		updateFoodPosition()
	} 

	 // Verifica se a cabeça da cobra colidiu com as bordas do campo
	if (
        snakeX < 0 ||
        snakeX >= gridSize * 20 ||
        snakeY < 0 ||
        snakeY >= gridSize * 20
    ) {
        gameOver();
    }

	// Verifica se a cabeça da cobra colidiu com o próprio corpo
	for (let i = 1; i < snakeSegments.length; i++){
		if (snakeX === snakeSegments[i].x && snakeY === snakeSegments[i].y) {
			gameOver()
		}
	}

}

// Variável para controlar o estado do jogo
let gameRunning = true

function gameOver(){
	if (gameRunning) {
		alert('fim de jogo')
		gameRunning = true;
		gameSpeed = 100
		snakeX = 180 
		snakeY = 180 
		snakeSegments.length = 1
		direction = 'sttoped'
		updateFoodPosition()

		// Remova todos os segmentos da cobra do documento
        const segmentContainer = document.getElementById('snakeSegments');
        while (segmentContainer.firstChild) {
            segmentContainer.removeChild(segmentContainer.firstChild);
        }

         // Recrie o segmento inicial da cobra
        const initialSegment = document.createElement('div');
        initialSegment.className = 'segment';
        initialSegment.id = 'segment-0';
        segmentContainer.appendChild(initialSegment);


        score = 0;
        updateScoreDisplay()
    }

}

// Função para atualizar a exibição da pontuação
function updateScoreDisplay() {
    let scoreElement = document.getElementById("score");
    scoreElement.textContent = `Pontos: ${score}`;
}

// Chame updateScoreDisplay() após defini-la
updateScoreDisplay();

// Função para capturar eventos de teclas pressionadas
document.addEventListener("keydown", (event) => {
	if (keyProcessing) {
        return; // Ignorar a entrada de teclado se uma tecla já estiver sendo processada
    }

    keyProcessing = true;

	if (direction === 'stopped') {
		if (event.key === "ArrowUp" && direction !== "down") {
	        direction = "up";
	    } else if (event.key === "ArrowDown" && direction !== "up") {
	        direction = "down";
	    } else if (event.key === "ArrowLeft" && direction !== "right") {
	        direction = "left";
	    } else if (event.key === "ArrowRight" && direction !== "left") {
	        direction = "right";
	    }
    } else {
    	if (event.key === "ArrowUp" && direction !== "down") {
	        direction = "up";
	    } else if (event.key === "ArrowDown" && direction !== "up") {
	        direction = "down";
	    } else if (event.key === "ArrowLeft" && direction !== "right") {
	        direction = "left";
	    } else if (event.key === "ArrowRight" && direction !== "left") {
	        direction = "right";
	    }}

	// Defina a variável de processamento de tecla como falsa após um curto atraso
    setTimeout(() => {
        keyProcessing = false;
    }, 10); // Ajuste o tempo conforme necessário
});

//mobile movement
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

upButton.addEventListener('click', () => changeDirection('up'));
downButton.addEventListener('click', () => changeDirection('down'));
leftButton.addEventListener('click', () => changeDirection('left'));
rightButton.addEventListener('click', () => changeDirection('right'));

function changeDirection(newDirection) {
    if (newDirection === "up" && direction !== "down") {
        direction = "up";
    } else if (newDirection === "down" && direction !== "up") {
        direction = "down";
    } else if (newDirection === "left" && direction !== "right") {
        direction = "left";
    } else if (newDirection === "right" && direction !== "left") {
        direction = "right";
    }
}

// Função principal de atualização do jogo
function updateGame(){
	if (gameRunning) {
		updateSnakePosition()
		checkCollisions()

		// Atualiza a posição visual da cobra
	    snake.style.left = snakeX + "px";
	    snake.style.top = snakeY + "px";

        // Atualiza a posição dos segmentos da cobra
        for (let i = 0; i < snakeSegments.length; i++) {
            const segment = snakeSegments[i];
            const segmentElement = document.getElementById(`segment-${i}`);
            segmentElement.style.left = segment.x + "px";
            segmentElement.style.top = segment.y + "px";
        }

		// Chame esta função novamente para atualizar o jogo após um atraso
	    setTimeout(updateGame, gameSpeed,);

	}
};
updateGame()
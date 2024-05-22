const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight; // Ahora ocupamos toda la pantalla
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#8B0000"; // Fondo rojo sangre

// Imagen de la burbuja
const bubbleImage = new Image();
bubbleImage.src = 'burbuja.png';

// Clase Circle para representar las burbujas
class Circle {
    constructor(x, y, radius, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.speed = speed;
        this.isDestroyed = false; // Indica si el círculo ha sido destruido
    }

    draw(context) {
        if (!this.isDestroyed) {
            context.drawImage(bubbleImage, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
        }
    }

    update(context) {
        if (!this.isDestroyed) {
            this.draw(context);
            // Actualizar posición y controlar la velocidad constante
            this.posY -= this.speed;
        }
    }
}

// Campo de texto para mostrar el score
const scoreText = document.createElement('div');
scoreText.style.position = 'absolute';
scoreText.style.top = '10px';
scoreText.style.left = '10px';
scoreText.style.fontFamily = 'Comic Sans MS';
scoreText.style.fontSize = '20px';
document.body.appendChild(scoreText);

let score = 0;
let highScore = 0;
scoreText.innerText = `Score: ${score}  High Score: ${highScore}`;

// Posición de la línea roja (un poco más abajo del marcador de puntuación)
const redLineY = 50;

// Mensaje de inicio
const startMessage = document.createElement('div');
startMessage.textContent = "Revienta todas las burbujas";
startMessage.style.position = 'absolute';
startMessage.style.top = '50%';
startMessage.style.left = '50%';
startMessage.style.transform = 'translate(-50%, -50%)';
startMessage.style.fontSize = '30px';
startMessage.style.color = 'green';
startMessage.style.fontFamily = 'Comic Sans MS';
document.body.appendChild(startMessage);
setTimeout(() => {
    // Eliminar el mensaje de inicio después de 2 segundos
    startMessage.remove();
}, 2000);

let level = 1; // Nivel inicial
let numCircles = 2; // Cantidad inicial de círculos
let circles = [];
let gameOverFlag = false; // Bandera para indicar si el juego terminó

createCircles();

// Función para crear las burbujas
function createCircles() {
    circles = []; // Limpiar el arreglo de círculos antes de crear nuevos
    for (let i = 0; i < numCircles; i++) {
        let randomX = Math.random() * window_width; // Coordenada X aleatoria dentro del ancho de la pantalla
        let randomY = window_height + Math.random() * 200; // Coordenada Y aleatoria para iniciar desde abajo
        let randomRadius = 40; // Tamaño del círculo
        let speed = 1 + level * 0.1; // La velocidad aumenta muy gradualmente con el nivel
        circles.push(new Circle(randomX, randomY, randomRadius, speed));
    }
}

// Función para aumentar el nivel del juego
function increaseLevel() {
    level++;
    numCircles += 2; // Aumentar en 2 la cantidad de círculos
}

// Función para manejar el final del juego
function gameOver() {
    gameOverFlag = true; // Establecer la bandera de fin de juego
    ctx.clearRect(0, 0, window_width, window_height);
    if (score > highScore) {
        highScore = score;
    }
    const loseMessage = document.createElement('div');
    loseMessage.textContent = `PERDISTE. Tu puntuación es de ${score}`;
    loseMessage.style.position = 'absolute';
    loseMessage.style.top = '50%';
    loseMessage.style.left = '50%';
    loseMessage.style.transform = 'translate(-50%, -50%)';
    loseMessage.style.fontSize = '30px';
    loseMessage.style.color = 'red';
    loseMessage.style.fontFamily = 'Comic Sans MS';
    document.body.appendChild(loseMessage);

    // Botón para volver a intentar
    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Volver a intentar';
    tryAgainButton.style.position = 'absolute';
    tryAgainButton.style.top = '60%';
    tryAgainButton.style.left = '50%';
    tryAgainButton.style.transform = 'translate(-50%, -50%)';
    tryAgainButton.style.padding = '10px 20px';
    tryAgainButton.style.fontSize = '18px';
    tryAgainButton.style.cursor = 'pointer';
    tryAgainButton.style.backgroundColor = '#4CAF50';
    tryAgainButton.style.color = 'white';
    tryAgainButton.style.border = 'none';
    tryAgainButton.style.borderRadius = '5px';
    tryAgainButton.style.transition = 'background-color 0.3s';
    tryAgainButton.addEventListener('click', function() {
        tryAgainButton.remove(); // Elimina el botón "Volver a intentar"
        loseMessage.remove(); // Elimina el mensaje de pérdida
        resetGame(); // Reinicia el juego
    });
    document.body.appendChild(tryAgainButton);
}

// Función para reiniciar el juego
function resetGame() {
    gameOverFlag = false; // Restablecer la bandera de fin de juego
    level = 1;
    numCircles = 2;
    score = 0;
    scoreText.innerText = `Score: ${score}  High Score: ${highScore}`;
    createCircles();
    updateCircles(); // Iniciar el juego nuevamente
}

// Función para detectar clics en el canvas
canvas.onclick = function (event) {
    if (gameOverFlag) return; // Evitar clics si el juego ha terminado

    const clickPos = {
        x: event.clientX,
        y: event.clientY
    };

    // Verificar si se hizo clic dentro de algún círculo
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(clickPos.x - circle.posX, 2) + Math.pow(clickPos.y - circle.posY, 2));
        if (distance <= circle.radius) {
            // Eliminar el círculo de la matriz y marcarlo como destruido
            circles.splice(i, 1);
            circle.isDestroyed = true;
            // Incrementar el score
            score += 120;
            scoreText.innerText = `Score: ${score}  High Score: ${highScore}`;
            break; // Terminar el bucle una vez que se haya eliminado el círculo
        }
    }
};

// Función para actualizar el juego en cada fotograma
let updateCircles = function () {
    if (!gameOverFlag) {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, window_width, window_height);

        // Dibujar la línea morada fuerte
        ctx.strokeStyle = '#800080'; // Morado fuerte
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, redLineY);
        ctx.lineTo(window_width, redLineY);
        ctx.stroke();

        for (let circle of circles) {
            circle.update(ctx);
            // Verificar si algún círculo ha pasado completamente la línea roja
            if (circle.posY - circle.radius < redLineY) {
                gameOver();
                return; // Salir de la función de actualización si se ha perdido el juego
            }
        }

        // Verificar si se ha superado el nivel
        if (circles.length === 0) {
            increaseLevel();
            createCircles();
        }
    }
};

bubbleImage.onload = function() {
    updateCircles(); // Comienza el juego cuando la imagen de la burbuja se carga completamente
};


bubbleImage.onload = function() {
    updateCircles(); // Comienza el juego cuando la imagen de la burbuja se carga completamente
};


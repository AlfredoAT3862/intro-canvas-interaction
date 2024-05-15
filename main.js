const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight * 0.7; // Reduciendo el tamaño de la pantalla hacia abajo
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.maxSpeed = 0; // Velocidad constante
        this.isDestroyed = false; // Indica si el círculo ha sido destruido
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 6; // Grosor del borde del círculo
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        if (!this.isDestroyed) {
            this.draw(context);
            // Actualizar posición y controlar la velocidad constante
            this.posY -= this.speed;
        }
    }
}

// Campo de texto para mostrar las coordenadas del mouse
const mouseCoordinatesText = document.createElement('div');
mouseCoordinatesText.style.position = 'absolute';
mouseCoordinatesText.style.top = '10px';
mouseCoordinatesText.style.left = '10px';
document.body.appendChild(mouseCoordinatesText);

// Campo de texto para mostrar las coordenadas del clic en la pantalla
const clickCoordinatesText = document.createElement('div');
clickCoordinatesText.style.position = 'absolute';
clickCoordinatesText.style.top = '30px';
clickCoordinatesText.style.left = '10px';
document.body.appendChild(clickCoordinatesText);

const startMessage = document.createElement('div');
startMessage.textContent = "Revienta todas las burbujas";
startMessage.style.position = 'absolute';
startMessage.style.top = '50%';
startMessage.style.left = '50%';
startMessage.style.transform = 'translate(-50%, -50%)';
startMessage.style.fontSize = '30px';
startMessage.style.color = 'green';
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

function createCircles() {
    circles = []; // Limpiar el arreglo de círculos antes de crear nuevos
    for (let i = 0; i < numCircles; i++) {
        let randomX = Math.random() * window_width; // Coordenada X aleatoria dentro del ancho de la pantalla
        let randomY = window_height + Math.random() * 200; // Coordenada Y aleatoria para iniciar desde abajo
        let randomRadius = 40; // Tamaño aleatorio del círculo
        circles.push(new Circle(randomX, randomY, randomRadius, "#18A80F", (i + 1).toString(), 1));
    }
}

function increaseLevel() {
    level++;
    numCircles += 2; // Aumentar en 2 la cantidad de círculos
}

function gameOver() {
    gameOverFlag = true; // Establecer la bandera de fin de juego
    ctx.clearRect(0, 0, window_width, window_height);
    const loseMessage = document.createElement('div');
    loseMessage.textContent = "PERDISTE";
    loseMessage.style.position = 'absolute';
    loseMessage.style.top = '50%';
    loseMessage.style.left = '50%';
    loseMessage.style.transform = 'translate(-50%, -50%)';
    loseMessage.style.fontSize = '30px';
    loseMessage.style.color = 'red';
    document.body.appendChild(loseMessage);
    setTimeout(() => {
        // Reiniciar el juego después de 2 segundos
        loseMessage.remove();
        resetGame();
    }, 2000);
}

function resetGame() {
    gameOverFlag = false; // Restablecer la bandera de fin de juego
    level = 1;
    numCircles = 2;
    createCircles();
}

// Agregar evento para actualizar las coordenadas del mouse
canvas.onmousemove = function (event) {
    const mousePos = {
        x: event.clientX,
        y: event.clientY
    };

    mouseCoordinatesText.innerText = `X: ${mousePos.x}, Y: ${mousePos.y}`;
};

// Agregar evento para registrar clics en cualquier parte del canvas
canvas.onclick = function (event) {
    if (gameOverFlag) return; // Evitar clics si el juego ha terminado

    const clickPos = {
        x: event.clientX,
        y: event.clientY
    };

    clickCoordinatesText.innerText = `Click en X: ${clickPos.x}, Y: ${clickPos.y}`;

    // Verificar si se hizo clic dentro de algún círculo
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(clickPos.x - circle.posX, 2) + Math.pow(clickPos.y - circle.posY, 2));
        if (distance <= circle.radius) {
            // Eliminar el círculo de la matriz y marcarlo como destruido
            circles.splice(i, 1);
            circle.isDestroyed = true;
            break; // Terminar el bucle una vez que se haya eliminado el círculo
        }
    }
};

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    for (let circle of circles) {
        circle.update(ctx);
        // Verificar si algún círculo ha alcanzado la parte superior de la pantalla
        if (circle.posY < 0) {
            gameOver();
            return; // Salir de la función de actualización si se ha perdido el juego
        }
    }

    // Verificar si se ha superado el nivel
    if (circles.length === 0) {
        increaseLevel();
        createCircles();
    }
};

updateCircles();

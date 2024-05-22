document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.createElement('button');
    startButton.textContent = 'Comenzar';
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '18px';
    startButton.style.cursor = 'pointer';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.transition = 'background-color 0.3s';
    startButton.addEventListener('click', function() {
        startButton.remove(); // Elimina el botón al hacer clic en él
        title.remove(); // Elimina el título también
        const script = document.createElement('script');
        script.src = 'main.js';
        document.body.appendChild(script);
    });
    document.body.appendChild(startButton);

    const title = document.createElement('h1');
    title.textContent = 'Juego de Burbujas';
    title.style.position = 'absolute';
    title.style.top = '40%';
    title.style.left = '50%';
    title.style.transform = 'translate(-50%, -50%)';
    title.style.textAlign = 'center';
    title.style.fontSize = '32px';
    title.style.color = '#333';
    title.style.fontFamily = 'Arial';
    document.body.appendChild(title);
});

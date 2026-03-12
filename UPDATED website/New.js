let output = document.getElementById("output")
window.addEventListener("mousemove", (e) => {
  let xPos = e.clientX;
  let yPos = e.clientY;
});

const container = document.getElementById('grid-container');
const cellSize = 50; 

function createGrid() {
    container.innerHTML = '';
    const columns = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);
    
    for (let i = 0; i < columns * rows; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        container.appendChild(cell);
    }
}

window.addEventListener("mousemove", (e) => {
    const boxes = document.querySelectorAll('.grid-item');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Your refined "hole" size
    const maxDist = 175; 

    boxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const boxX = rect.left + rect.width / 2;
        const boxY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(mouseX - boxX, 2) + Math.pow(mouseY - boxY, 2)
        );

        if (distance < maxDist) {
            // Power of 2 creates the smooth "funnel" look
            let scale = Math.pow(distance / maxDist, 2);
            
            // Keeps them from vanishing entirely
            if (scale < 0.05) scale = 0.05; 

            box.style.transform = `scale(${scale})`;
            box.style.opacity = scale; 
        } else {
            box.style.transform = `scale(1)`;
            box.style.opacity = 1;
        }
    });
});

// Build grid on load and rebuild on window resize
createGrid();
window.addEventListener('resize', createGrid);
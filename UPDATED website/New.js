let output = document.getElementById("output")
window.addEventListener("mousemove", (e) => {
  let xPos = e.clientX;
  let yPos = e.clientY;
});

const container = document.getElementById('grid-container');
const cellSize = 50;
let boxes = []; // We'll store the box elements here for faster access

function createGrid() {
    container.innerHTML = '';
    const columns = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    for (let i = 0; i < columns * rows; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        container.appendChild(cell);
    }
    
    // Cache the boxes after they are created
    boxes = document.querySelectorAll('.grid-item');
}

window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const maxDist = 200;

    boxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        // Calculate the center point of the box
        const boxX = rect.left + rect.width / 2;
        const boxY = rect.top + rect.height / 2;

        // Corrected Pythagorean theorem: distance = sqrt(dx^2 + dy^2)
        const distance = Math.sqrt(
            Math.pow(mouseX - boxX, 2) + Math.pow(mouseY - boxY, 2)
        );

        if (distance < maxDist) {
            // Creates the "pinch" or "hole" effect
            let scale = Math.pow(distance / maxDist, 2);
            
            // Floor the scale so boxes don't disappear completely
            if (scale < 0.1) scale = 0.1;

            box.style.transform = `scale(${scale})`;
            box.style.opacity = scale;
        } else {
            // Reset to normal state when mouse is far away
            box.style.transform = `scale(1)`;
            box.style.opacity = 1;
        }
    });
});

// Initialize and handle window resizing
createGrid();
window.addEventListener('resize', createGrid);
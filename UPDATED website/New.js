const container = document.getElementById('grid-container');
const cellSize = 50;
let boxes = []; 

function createGrid() {
    container.innerHTML = '';
    const columns = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    for (let i = 0; i < columns * rows; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');
        container.appendChild(cell);
    }
    boxes = document.querySelectorAll('.grid-item');
}

window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    boxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const boxX = rect.left + rect.width / 2;
        const boxY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(mouseX - boxX, 2) + Math.pow(mouseY - boxY, 2));

        if (distance < 200) {
            let scale = Math.max(0.1, Math.pow(distance / 200, 2));
            box.style.transform = `scale(${scale})`;
            box.style.opacity = scale;
        } else {
            box.style.transform = `scale(1)`;
            box.style.opacity = 1;
        }
    });
});

createGrid();
window.addEventListener('resize', createGrid);

// --- MENU LOGIC ---
const navBtn = document.getElementById('nav-btn');
const navMenu = document.getElementById('nav-menu');
const closeBtn = document.getElementById('close-menu');

if (navBtn && navMenu) {
    navBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('hidden');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            navMenu.classList.add('hidden');
        });
    }

    window.addEventListener('click', () => {
        navMenu.classList.add('hidden');
    });

    navMenu.addEventListener('click', (e) => e.stopPropagation());
}
const YELLOW_POOL = [
    { label: "🏹 4", type: 'Attack', val: 4, color: '#ff4d4d' },
    { label: "🛡️ 3", type: 'Defense', val: 3, color: '#ffd700' },
    { label: "🛡️ 2", type: 'Defense', val: 2, color: '#ffd700' },
    { label: "✨ 2", type: 'Healing', val: 2, color: '#2ecc71' },
    { label: "✨ 3", type: 'Healing', val: 3, color: '#2ecc71' },
    { label: "🏹 3", type: 'Attack', val: 3, color: '#ff4d4d' }
];

const GREEN_POOL = [
    { label: "⚔️ 5", type: 'Attack', val: 5, color: '#ff4d4d' },
    { label: "⚔️ 4", type: 'Attack', val: 4, color: '#ff4d4d' },
    { label: "⚔️ 3", type: 'Attack', val: 3, color: '#ff4d4d' },
    { label: "🛡️ 4", type: 'Defense', val: 4, color: '#ffd700' },
    { label: "🛡️ 3", type: 'Defense', val: 3, color: '#ffd700' },
    { label: "✨ 1", type: 'Healing', val: 1, color: '#2ecc71' }
];

let state = {
    heroes: [{ hp: 20, maxHp: 20, armor: 0 }, { hp: 20, maxHp: 20, armor: 0 }],
    enemyHP: 20, maxEnemyHP: 20, enemyAtk: 4, enemyTargetIdx: 0,
    rolls: 3, turnDone: false,
    dice: [
        { side: null, locked: false, owner: 0, target: null },
        { side: null, locked: false, owner: 0, target: null },
        { side: null, locked: false, owner: 1, target: null },
        { side: null, locked: false, owner: 1, target: null }
    ],
    selectedIdx: null
};

function toggleHowTo(show) {
    document.getElementById('how-to-modal').style.display = show ? 'flex' : 'none';
}

function startGame() {
    const menu = document.getElementById('main-menu');
    menu.style.opacity = '0';
    setTimeout(() => menu.style.display = 'none', 400);
    resetGame();
}

function exitToMenu() {
    const menu = document.getElementById('main-menu');
    menu.style.display = 'flex';
    setTimeout(() => menu.style.opacity = '1', 10);
}

function resetGame() {
    state.heroes = [{ hp: 20, maxHp: 20, armor: 0 }, { hp: 20, maxHp: 20, armor: 0 }];
    state.enemyHP = 20;
    state.rolls = 3;
    state.turnDone = false;
    state.selectedIdx = null;
    state.dice.forEach(d => { d.side = null; d.locked = false; d.target = null; });
    setEnemyIntent();
    updateUI();
}

function setEnemyIntent() {
    state.enemyTargetIdx = Math.floor(Math.random() * 2);
    state.enemyAtk = Math.floor(Math.random() * 3) + 3;
}

function handleRoll() {
    if (state.rolls <= 0 || state.turnDone) return;
    state.dice.forEach(d => {
        if (!d.locked) { 
            const pool = (d.owner === 0) ? YELLOW_POOL : GREEN_POOL;
            d.side = pool[Math.floor(Math.random() * pool.length)]; 
            d.target = null; 
        }
    });
    state.rolls--;
    checkAllLocked();
    updateUI();
}

function handleDieClick(i) {
    if (state.turnDone) return;
    if (state.rolls > 0 && state.dice[i].side) {
        state.dice[i].locked = !state.dice[i].locked;
        checkAllLocked();
    } 
    else if ((state.rolls === 0 || state.dice.every(d => d.locked)) && state.dice[i].side) {
        state.selectedIdx = (state.selectedIdx === i) ? null : i;
    }
    updateUI();
}

function checkAllLocked() {
    const rolledDice = state.dice.filter(d => d.side !== null);
    if (rolledDice.length === 4 && rolledDice.every(d => d.locked)) {
        state.rolls = 0; 
    }
}

function assignToTarget(targetId) {
    if (state.selectedIdx === null) return;
    const die = state.dice[state.selectedIdx];
    if (die.side.type === 'Attack' && targetId !== 'enemy') return;
    if (die.side.type !== 'Attack' && targetId === 'enemy') return;
    die.target = targetId;
    state.selectedIdx = null;
    updateUI();
}

// --- NEW ANIMATED FINALIZE ---
async function finalizeActions() {
    state.turnDone = true;
    updateUI();

    for (let i = 0; i < state.dice.length; i++) {
        const d = state.dice[i];
        if (!d.side || !d.target) continue;

        // Visual Slide
        const heroEl = document.getElementById(`hero${d.owner}-unit`);
        heroEl.classList.add('hero-action-slide');

        if (d.target === 'enemy') {
            state.enemyHP -= d.side.val;
            spawnFloatingText(`-${d.side.val}`, '#ff4d4d', 'enemy-unit');
        } else {
            let idx = parseInt(d.target.replace('hero', ''));
            if (d.side.type === 'Defense') {
                state.heroes[idx].armor += d.side.val;
                spawnFloatingText(`+${d.side.val} 🛡️`, '#ffd700', `hero${idx}-unit`);
            }
            if (d.side.type === 'Healing') {
                state.heroes[idx].hp = Math.min(state.heroes[idx].maxHp, state.heroes[idx].hp + d.side.val);
                spawnFloatingText(`+${d.side.val} ✨`, '#2ecc71', `hero${idx}-unit`);
            }
        }

        updateUI();
        await new Promise(r => setTimeout(r, 400)); // Pause to see action
        heroEl.classList.remove('hero-action-slide');
        await new Promise(r => setTimeout(r, 100)); // Reset gap
    }

    if (state.enemyHP <= 0) { 
        alert("Enemy Slain!"); 
        exitToMenu(); 
    } else {
        document.getElementById('end-turn-btn').disabled = false;
    }
}

function enemyTurn() {
    const target = state.enemyTargetIdx;
    const dmg = Math.max(0, state.enemyAtk - state.heroes[target].armor);
    state.heroes[target].hp -= dmg;
    state.heroes.forEach(h => h.armor = 0);
    state.rolls = 3; state.turnDone = false;
    state.dice.forEach(d => { d.locked = false; d.side = null; d.target = null; });
    setEnemyIntent();
    updateUI();
    if (state.heroes[0].hp <= 0 && state.heroes[1].hp <= 0) { alert("Defeat!"); exitToMenu(); }
}

function updateUI() {
    const selDie = state.selectedIdx !== null ? state.dice[state.selectedIdx] : null;
    state.heroes.forEach((h, i) => {
        document.getElementById(`hero${i}-hp`).innerText = Math.max(0, h.hp);
        document.getElementById(`hero${i}-hp-bar`).style.width = (h.hp / h.maxHp * 100) + '%';
        
        // Shield Indicator Logic
        const armorDisp = document.getElementById(`hero${i}-armor-display`);
        if (h.armor > 0) {
            armorDisp.innerHTML = `<span style="background:#70a1ff; padding:2px 8px; border-radius:4px; border:1px solid white;">🛡️ ${h.armor}</span>`;
        } else {
            armorDisp.innerHTML = "";
        }

        let canTarget = selDie && selDie.side.type !== 'Attack';
        document.getElementById(`hero${i}-unit`).className = `unit hero ${i===0?'hero-top':'hero-bottom'} ${canTarget?'can-target':''} ${state.enemyTargetIdx===i?'targeted-by-enemy':''}`;
        document.getElementById(`hero${i}-marker`).innerHTML = state.enemyTargetIdx === i ? '<div class="target-marker">🎯</div>' : '';
    });

    document.getElementById('enemy-hp').innerText = Math.max(0, state.enemyHP);
    document.getElementById('enemy-hp-bar').style.width = (state.enemyHP / state.maxEnemyHP * 100) + '%';
    document.getElementById('enemy-intent').innerText = `⚔️ ${state.enemyAtk}`;
    document.getElementById('enemy-unit').className = `unit enemy ${selDie && selDie.side.type === 'Attack' ? 'can-target' : ''}`;

    const tray = document.getElementById('tray'); tray.innerHTML = '';
    state.dice.forEach((d, i) => {
        const el = document.createElement('div');
        el.className = `die hero${d.owner}-die ${d.locked?'locked':''} ${i===state.selectedIdx?'selected':''} ${d.target?'assigned':''}`;
        el.innerHTML = d.side ? d.side.label : '?';
        el.onclick = () => handleDieClick(i);
        tray.appendChild(el);
    });

    let ready = state.dice.every(d => !d.side || d.target !== null);
    document.getElementById('exec-btn').style.display = (state.rolls === 0 && ready && !state.turnDone) ? 'block' : 'none';
    document.getElementById('roll-btn').innerText = `Roll (${state.rolls})`;
    document.getElementById('roll-btn').style.visibility = (state.rolls > 0 && !state.turnDone) ? 'visible' : 'hidden';
    document.getElementById('end-turn-btn').disabled = !state.turnDone;
}

function spawnFloatingText(v, c, id) {
    const el = document.getElementById(id);
    const t = document.createElement('div');
    t.className = 'floating-text'; t.innerText = v; t.style.color = c;
    el.appendChild(t); setTimeout(() => t.remove(), 1000);
}

updateUI();
async function spawnNextWave() {
    const enemyEl = document.getElementById('enemy-unit');
    
    // 1. Enemy dies
    enemyEl.style.opacity = "0";
    enemyEl.style.transform = "scale(0.5)";
    await new Promise(r => setTimeout(r, 600));

    // --- START STRENGTHENING LOGIC ---
    state.wave++; 
    
    // Increases HP by 10 and adds a 20% bonus based on the wave number
    state.maxEnemyHP = 20 + (state.wave * 10) + Math.floor(state.wave * 1.2);
    state.enemyHP = state.maxEnemyHP;
    
    // This updates the attack power to increase every wave
    setEnemyIntent(); 
    // --- END STRENGTHENING LOGIC ---

    // 2. Move off-screen right
    enemyEl.style.transition = "none";
    enemyEl.style.transform = "translateX(500px) scale(1.4)";
    updateUI();

    // 3. Slide In
    setTimeout(() => {
        enemyEl.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s";
        enemyEl.style.opacity = "1";
        enemyEl.style.transform = "translateX(0px) scale(1.4)";
        spawnFloatingText(`WAVE ${state.wave} - STONGER!`, '#ff4d4d', 'enemy-unit');
    }, 50);

    await new Promise(r => setTimeout(r, 800));
    document.getElementById('end-turn-btn').disabled = false;
}
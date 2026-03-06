// Gerenciador de Chefes - Nexus Prism
// Fornece: initBossManager, shouldSpawnForSector, startBossForSector, endBoss, isBossActive

import { playSound } from './audio.js';

let _gameArea = null;
let _onBossEnd = null;
let _bossState = {
    active: false,
    id: null,
    hp: 0,
    maxHp: 0,
    timers: []
};

/**
 * Configurações dos chefes (inicial: Arconte Vox)
 */
const BOSSES = {
    arconte_vox: {
        id: 'arconte_vox',
        name: 'Arconte Vox',
        description: 'Padrões temporais e ondas de fendas imprevisíveis',
        spawnSector: 3,
        // Valores ajustados para balanceamento: HP maior, mais ondas, intervalos menores
        hp: 45,
        waveInterval: 1400, // ms
        waveCount: 8
    },
    soberano_umbra: { id: 'soberano_umbra', spawnSector: 4, hp: 40 },
    tita_kronis: { id: 'tita_kronis', spawnSector: 5, hp: 60 },
    omega_prism: { id: 'omega_prism', spawnSector: 6, hp: 120 }
};

export function initBossManager(gameArea, options = {}) {
    _gameArea = gameArea || document.getElementById('game-area') || document.body;
    if (options.onBossEnd) _onBossEnd = options.onBossEnd;
}

export function shouldSpawnForSector(sectorNumber) {
    return Object.values(BOSSES).some(b => b.spawnSector === sectorNumber);
}

export function isBossActive() {
    return _bossState.active;
}

export function startBossForSector(sectorNumber, onComplete, options = {}) {
    if (!shouldSpawnForSector(sectorNumber) || _bossState.active) {
        if (onComplete) onComplete(false);
        return false;
    }

    const boss = Object.values(BOSSES).find(b => b.spawnSector === sectorNumber);
    if (!boss) {
        if (onComplete) onComplete(false);
        return false;
    }

    // Apply optional scaling (difficulty multiplier)
    const scale = options.scale && options.scale > 0 ? options.scale : 1;
    boss.scaleFactor = scale;

    _bossState.active = true;
    _bossState.id = boss.id;
    _bossState.maxHp = boss.hp || 30;
    _bossState.hp = _bossState.maxHp;
    _bossState.timers = [];

    // Visual overlay removed (user requested only visual removal).
    // Orbs will still spawn in the `gameArea` and boss logic remains active.
    // We keep a conceptual boss area (center of game area) for spawn calculations.
    _bossState.overlay = null;
    // efeito sonoro de aparição do chefe (sintético se não houver mp3)
    try { playSound('boss-appear'); } catch(e){ /* ignore */ }

    // No overlay animations since visuals are disabled by request

    function spawnBossTarget() {
        const t = document.createElement('div');
        t.className = 'boss-target target';
        t.innerHTML = '<div class="core"></div>';
        t.style.cssText = `position:absolute;display:flex;align-items:center;justify-content:center;font-size:1.6rem;z-index:350;cursor:pointer;`;
        const rect = _gameArea.getBoundingClientRect();
        // random position keeping inside and avoiding boss card area
        const padding = 90;
        // consider bossFigure (if present) and card box area as forbidden spawn region
        // Use conceptual boss center at middle of game area (no overlay/card present)
        const gameRect = _gameArea.getBoundingClientRect();
        const bossGlobal = {
            left: gameRect.width/2 - 140,
            right: gameRect.width/2 + 140,
            top: gameRect.height/2 - 80,
            bottom: gameRect.height/2 + 80,
            width: 280,
            height: 160
        };
        const bossCenterX = (bossGlobal.left + bossGlobal.right) / 2;
        const bossCenterY = (bossGlobal.top + bossGlobal.bottom) / 2;

        // alternate sides so orbs appear left/right like the reference
        if (!_bossState.nextOrbSide) _bossState.nextOrbSide = 'left';
        const side = _bossState.nextOrbSide === 'left' ? 'left' : 'right';
        _bossState.nextOrbSide = side === 'left' ? 'right' : 'left';

        const orbSize = 72;
        const horizontalOffset = Math.max(120, Math.floor(bossGlobal.width / 2) + 40);
        let px = side === 'left' ? bossCenterX - horizontalOffset - orbSize / 2 : bossCenterX + horizontalOffset - orbSize / 2;
        // vertical jitter so orbs are not exactly level
        let py = bossCenterY + (Math.random() * 80 - 40);

        // clamp to game area
        px = Math.max(8, Math.min(px, rect.width - orbSize - 8));
        py = Math.max(8, Math.min(py, rect.height - orbSize - 8));

        t.style.left = `${px}px`;
        t.style.top = `${py}px`;

        // lifetime adjustable via options (ms); default 3.5-4s
        let baseLifetime = options.targetLifetime || 4000;
        const lifetime = Math.max(800, Math.floor(baseLifetime / (appliedScale || 1)));

        let endingTimer = null;
        let removeTimer = null;

        function createParticlesAt(cx, cy) {
            const pCount = 6 + Math.floor(Math.random() * 4);
            for (let i=0;i<pCount;i++) {
                const part = document.createElement('div');
                part.className = 'orb-particle';
                const dx = (Math.random()*2-1) * (30 + Math.random()*40);
                const dy = (Math.random()*-1) * (20 + Math.random()*40);
                part.style.left = cx + 'px';
                part.style.top = cy + 'px';
                part.style.setProperty('--dx', dx + 'px');
                part.style.setProperty('--dy', dy + 'px');
                _gameArea.appendChild(part);
                const pRem = setTimeout(()=>{ if (part.parentNode) part.remove(); }, 600);
                _bossState.timers.push(pRem);
            }
        }

        t.addEventListener('click', (e) => {
            e.stopPropagation();
            const damage = 1;
            _bossState.hp = Math.max(0, _bossState.hp - damage);
            updateHpBar();
            try { playSound('boss-hit'); } catch(e){}
            // hit animation
            t.classList.add('orb-hit');
            // spawn particles at center
            const tRect = t.getBoundingClientRect();
            const cx = tRect.left + tRect.width/2 - _gameArea.getBoundingClientRect().left;
            const cy = tRect.top + tRect.height/2 - _gameArea.getBoundingClientRect().top;
            createParticlesAt(cx, cy);
            // clear scheduled removal and remove now with fade
            if (endingTimer) clearTimeout(endingTimer);
            if (removeTimer) clearTimeout(removeTimer);
            t.classList.add('orb-fade');
            const rem = setTimeout(()=>{ if (t.parentNode) t.remove(); }, 450);
            _bossState.timers.push(rem);
            if (_bossState.hp <= 0) {
                endBoss(true);
            }
        });

        _gameArea.appendChild(t);

        // schedule blinking before expiration
        endingTimer = setTimeout(()=>{
            if (t.parentNode) t.classList.add('orb-ending');
        }, Math.max(200, lifetime - 800));
        _bossState.timers.push(endingTimer);

        // schedule removal with smooth fade/shrink
        removeTimer = setTimeout(()=>{
            if (t.parentNode) {
                t.classList.remove('orb-ending');
                t.classList.add('orb-fade');
                const finalRem = setTimeout(()=>{ if (t.parentNode) t.remove(); }, 420);
                _bossState.timers.push(finalRem);
            }
        }, lifetime);
        _bossState.timers.push(removeTimer);
    }

    function updateHpBar() {
        const bar = document.getElementById('boss-hp-bar');
        if (bar) {
            const pct = Math.max(0, (_bossState.hp / _bossState.maxHp) * 100);
            bar.style.width = pct + '%';
        }
    }

    let spawned = 0;
    // permite escala de dificuldade via options.scale (passado em startBossForSector)
    const appliedScale = boss.scaleFactor || 1;
    const effectiveWaveInterval = Math.max(600, Math.floor((boss.waveInterval || 1800) / appliedScale));
    const effectiveWaveCount = Math.max(1, Math.round((boss.waveCount || 6) * appliedScale));

    const waveTimer = setInterval(() => {
        if (!_bossState.active) { clearInterval(waveTimer); return; }
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i=0;i<count;i++) spawnBossTarget();
        spawned++;
        // Se alcançamos a contagem de waves planejada, e o chefe ainda estiver vivo, continue spawns until hp 0
        if (spawned >= effectiveWaveCount) {
            // continue spawning but could reduce frequency; here we clear interval to avoid infinite growth
            clearInterval(waveTimer);
        }
    }, effectiveWaveInterval);
    _bossState.timers.push(waveTimer);

    _bossState.updateHpBar = updateHpBar;

    if (onComplete) {
        _bossState.onComplete = onComplete;
    } else {
        _bossState.onComplete = _onBossEnd || function(){};
    }

    return true;
}

export function endBoss(success = true) {
    if (!_bossState.active) return;
    _bossState.active = false;
    _bossState.timers.forEach(t => clearTimeout(t));
    _bossState.timers = [];
    document.querySelectorAll('.boss-target').forEach(el => el.remove());
    if (_bossState.overlay) {
        // remove active class to stop pulsing
        _bossState.overlay.classList.remove('boss-active');
        if (_bossState.overlay.parentNode) _bossState.overlay.remove();
    }
    const cb = _bossState.onComplete;
    const id = _bossState.id;
    const hpLeft = _bossState.hp;
    _bossState = { active: false, id: null, hp: 0, maxHp: 0, timers: [] };
    if (cb) cb({ success, bossId: id, hpLeft });
}

export default {
    initBossManager,
    shouldSpawnForSector,
    startBossForSector,
    endBoss,
    isBossActive
};

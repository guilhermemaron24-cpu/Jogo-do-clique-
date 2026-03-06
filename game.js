import { playSound, setVolume } from './utils/audio.js';
import { randomPosition, clamp, formatTime } from './utils/helpers.js';
import { getDifficultyProfile } from './utils/difficulty.js';
import { 
    getSectorConfig, 
    getOrionMessage, 
    applySectorVisuals, 
    getSectorDifficulty,
    getSectorMechanics 
} from './utils/phaseManager.js';
import {
    initComboSystem,
    registerHit,
    registerMiss,
    resetCombo,
    getComboState,
    getCurrentMultiplier,
    setCallbacks
} from './utils/comboSystem.js';
import {
    initPowerUpSystem,
    startPowerUpSpawning,
    stopPowerUpSpawning,
    spawnRandomPowerUp,
    activatePowerUp,
    updateActivePowerUps,
    getActivePowerUps,
    getPowerUpConfig,
    markPowerUpCollected,
    resetPowerUpSystem,
    POWER_UP_TYPES
} from './utils/powerUpSystem.js';
import {
    applyTargetMovement,
    clearTargetMovement
} from './utils/targetMovement.js';
import {
    initUpgradeSystem,
    addEnergy,
    removeEnergy,
    calculateEnergyFromGame,
    getTotalEnergy,
    hasUpgrade,
    purchaseUpgrade,
    getUpgradeConfig,
    getAllUpgrades,
    applyUpgradeEffects,
    UPGRADE_TYPES
} from './utils/upgradeSystem.js';
import {
    initSkinSystem,
    purchaseSkin,
    hasSkin,
    selectSkin,
    getSelectedSkin,
    getSkinConfig,
    getAllSkins,
    getSkinsByCategory,
    applySkinToTarget,
    SKIN_TYPES
} from './utils/skinSystem.js';
import {
    initAchievementSystem,
    registerHit as registerAchievementHit,
    registerMiss as registerAchievementMiss,
    registerScore,
    registerCombo,
    registerSector,
    registerPowerUpUsed,
    registerSkinPurchased,
    startNewGame as startAchievementGame,
    endGame as endAchievementGame,
    isAchievementUnlocked,
    getAchievementConfig,
    getAllAchievements,
    getAchievementsByCategory,
    getAchievementProgress,
    getAchievementStats,
    ACHIEVEMENT_TYPES
} from './utils/achievementSystem.js';
import {
    showFloatingPoints,
    createParticles,
    createSectorProgressBar,
    updateSectorProgressBar,
    showLevelUpAnimation,
    showPowerUpScreenEffect,
    showComboEffect,
    createRippleEffect
} from './utils/feedbackSystem.js';
import bossManager from './utils/bossManager.js';
// import { submitScore, getTopScores } from './supabase/leaderboard.js';

/**
 * Estado global do jogo
 */
let gameState = {
    isPlaying: false,
    score: 0,
    timeLeft: 0,
    sector: 1,
    difficulty: 'normal',
    targetSize: 80,
    respawnDelay: 1500,
    gameTimer: null,
    targetTimer: null,
    activeTargets: [], // Para múltiplas fendas simultâneas
    targetCounter: 0, // Contador para IDs únicos de alvos
    powerUpEffects: { // Efeitos ativos de power-ups
        respawnDelayMultiplier: 1.0,
        scoreMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
        visibilityBoost: 0,
        ignoreNextMiss: false
    }
};

/**
 * Elementos DOM
 */
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    leaderboardScreen: document.getElementById('leaderboard-screen'),
    gameArea: document.getElementById('game-area'),
    target: document.getElementById('target'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    sector: document.getElementById('sector'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    leaderboardBtn: document.getElementById('leaderboard-btn'),
    closeLeaderboardBtn: document.getElementById('close-leaderboard-btn'),
    achievementsBtn: document.getElementById('achievements-btn'),
    achievementsScreen: document.getElementById('achievements-screen'),
    closeAchievementsBtn: document.getElementById('close-achievements-btn'),
    achievementsList: document.getElementById('achievements-list'),
    achievementsStats: document.getElementById('achievements-stats'),
    menuBtn: document.getElementById('menu-btn'),
    gameMenu: document.getElementById('game-menu'),
    menuHomeBtn: document.getElementById('menu-home-btn'),
    menuCancelBtn: document.getElementById('menu-cancel-btn'),
    finalScore: document.getElementById('final-score'),
    gameOverTitle: document.getElementById('game-over-title'),
    leaderboardList: document.getElementById('leaderboard-list'),
    comboDisplay: null, // Será criado dinamicamente
    multiplierDisplay: null, // Será criado dinamicamente
    powerUpContainer: null, // Container de power-ups ativos
    powerUpSpawnElement: null, // Elemento visual do power-up spawnado
    energyDisplay: null, // Display de energia
    upgradeShop: null // Loja de upgrades
};

/**
 * Tenta resolver elementos DOM que podem ter sido lidos antes do DOM estar pronto.
 * Converte `camelCase` para `kebab-case` e procura elementos por id.
 */
function resolveMissingElements() {
    Object.keys(elements).forEach(key => {
        if (!elements[key]) {
            // tenta converter camelCase para kebab-case (ex: startScreen -> start-screen)
            const id = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const el = document.getElementById(id);
            if (el) elements[key] = el;
        }
    });
}

/**
 * Garante que o container de power-ups exista o mais cedo possível.
 * Se o DOM ainda não estiver pronto, agenda para `DOMContentLoaded`.
 */
function ensurePowerUpContainer() {
    function createIfMissing() {
        if (document.getElementById('powerup-container')) return;
        const gameArea = document.getElementById('game-area') || document.body;
        if (!gameArea) return;
        const powerUpContainer = document.createElement('div');
        powerUpContainer.id = 'powerup-container';
        powerUpContainer.style.cssText = `position:absolute;bottom:1rem;left:1rem;z-index:50;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;`;
        gameArea.appendChild(powerUpContainer);
        elements.powerUpContainer = powerUpContainer;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createIfMissing);
    } else {
        createIfMissing();
    }
}

// Tenta garantir o container imediatamente
ensurePowerUpContainer();

/**
 * Inicializa o jogo e conecta eventos
 */
function init() {
    console.log('Configurando eventos...');
    
    // Inicializa sistema de combos
    initComboSystem({
        comboDecayTime: 5000, // 5 segundos para perder combo
        onComboUpdate: updateComboUI,
        onComboMilestone: handleComboMilestone,
        onComboLost: handleComboLost,
        onMultiplierChange: handleMultiplierChange
    });
    
    // Cria UI de combo
    createComboUI();
    
    // Cria UI de power-ups (cria container antes do sistema iniciar)
    createPowerUpUI();

    // Inicializa sistema de power-ups
    initPowerUpSystem({
        spawnInterval: 30000, // 30 segundos base
        minSpawnInterval: 20000, // Mínimo 20 segundos
        maxSpawnInterval: 60000, // Máximo 60 segundos
        onPowerUpSpawn: handlePowerUpSpawn,
        onPowerUpActivate: handlePowerUpActivate,
        onPowerUpExpire: handlePowerUpExpire,
        onPowerUpCollect: handlePowerUpCollect
    });
    
    // Inicializa sistema de upgrades
    initUpgradeSystem({
        onUpgradePurchased: handleUpgradePurchased,
        onEnergyEarned: handleEnergyEarned
    });
    
    // Inicializa sistema de skins
    initSkinSystem({
        onSkinPurchased: handleSkinPurchased,
        onSkinSelected: handleSkinSelected
    });

    // Inicializa sistema de chefes (esqueleto)
    try {
        bossManager.initBossManager(elements.gameArea, {
            onBossEnd: ({ success, bossId }) => {
                console.log('Boss ended:', bossId, 'success:', success);
                // re-aplica visuais do setor e retoma spawn
                applySectorVisuals(elements.gameArea, gameState.sector);
                setTimeout(() => {
                    if (gameState.isPlaying) spawnTarget();
                }, 300);
            }
        });
    } catch (e) {
        console.warn('Não foi possível inicializar bossManager:', e);
    }
    
    // Cria UI de energia e loja
    createUpgradeUI();
    
    if (!elements.startBtn) {
        console.error('Botão start-btn não encontrado!');
        return;
    }
    
    elements.startBtn.addEventListener('click', (e) => {
        console.log('Botão clicado!');
        e.preventDefault();
        startGame();
    });
    
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', startGame);
    }
    
    if (elements.leaderboardBtn) {
        elements.leaderboardBtn.addEventListener('click', showLeaderboard);
    }
    
    if (elements.closeLeaderboardBtn) {
        elements.closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
    }
    
    if (elements.achievementsBtn) {
        elements.achievementsBtn.addEventListener('click', showAchievements);
    }
    
    if (elements.closeAchievementsBtn) {
        elements.closeAchievementsBtn.addEventListener('click', hideAchievements);
    }
    
    // Menu de jogo
    if (elements.menuBtn) {
        elements.menuBtn.addEventListener('click', showGameMenu);
    }
    
    if (elements.menuHomeBtn) {
        elements.menuHomeBtn.addEventListener('click', returnToHomeScreen);
    }
    
    if (elements.menuCancelBtn) {
        elements.menuCancelBtn.addEventListener('click', hideGameMenu);
    }
    
    // Fecha menu ao clicar no overlay
    if (elements.gameMenu) {
        const overlay = elements.gameMenu.querySelector('.menu-overlay');
        if (overlay) {
            overlay.addEventListener('click', hideGameMenu);
        }
    }
    
    if (elements.target) {
        // Suporta tanto clique quanto toque
    elements.target.addEventListener('click', handleTargetClick);
    elements.target.addEventListener('touchend', (e) => {
        e.preventDefault(); // Previne double-tap zoom
        handleTargetClick(e);
    });
    }
    
    // Filtros do leaderboard
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const mode = e.target.dataset.mode;
            loadLeaderboard(mode);
        });
    });

    // Inicializar volume
    try {
        setVolume(0.7);
    } catch (e) {
        console.warn('Erro ao configurar volume:', e);
    }
    
    console.log('Nexus Prism inicializado com sucesso!');
    console.log('Elementos encontrados:', Object.keys(elements).filter(key => elements[key] !== null));
}

/**
 * Inicia uma nova partida
 */
function startGame() {
    console.log('Iniciando jogo...');
    
    try {
        // Limpa alvos anteriores
        resetTargets();
        
        // Reseta sistema de combos
        resetCombo();
        updateComboUI({ combo: 0, multiplier: 1.0, streak: 0 });
        
        // Reseta sistema de power-ups
        resetPowerUpSystem();
        gameState.powerUpEffects = {
            respawnDelayMultiplier: 1.0,
            scoreMultiplier: 1.0,
            targetSizeMultiplier: 1.0,
            visibilityBoost: 0,
            ignoreNextMiss: false
        };
        updatePowerUpUI();
        
        // Inicia tracking de conquistas para nova partida
        startAchievementGame();
        
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.sector = 1;
        gameState.difficulty = 'normal';
        
        // Cria barra de progresso para próximo setor
        createSectorProgressBar(elements.gameArea, 0, 1);
        
        // Define valores iniciais baseados no perfil
        const profile = getDifficultyProfile(gameState.difficulty);
        gameState.timeLeft = profile.totalTime;
        
        // Aplica efeitos de upgrades
        const upgradeEffects = applyUpgradeEffects(gameState);
        if (upgradeEffects.timeBonus) {
            gameState.timeLeft += upgradeEffects.timeBonus;
        }
        
        // Aplica configurações do Setor 1 usando phaseManager
        updateDifficulty();
        applySectorVisuals(elements.gameArea, 1);
        
        // Ajusta para mobile (aumenta tamanho mínimo)
        const isMobileDevice = isMobile();
        if (isMobileDevice && gameState.targetSize < 60) {
            gameState.targetSize = 60;
            console.log('Ajustado para mobile: tamanho mínimo 60px');
        }

        updateUI();
        hideAllScreens();
        
        // Mostra botão de menu durante o jogo
        if (elements.menuBtn) {
            elements.menuBtn.style.display = 'block';
        }
        
        // Define que o jogo está "preparado" para começar (mas ainda não rodando)
        // O jogo só começa de verdade após a contagem regressiva
        gameState.isPlaying = true; // Marca como "preparado"
        
        // Tenta tocar som (pode falhar se arquivo não existir)
        try {
            playSound('start');
        } catch (e) {
            console.warn('Erro ao tocar som:', e);
        }
        
        // NÃO inicia o timer aqui - será iniciado após a contagem regressiva
        // startTimer(); // REMOVIDO - timer só inicia após contagem
        
        // Mostra mensagem inicial de ORION
        // O timer será iniciado APENAS após a contagem regressiva terminar (dentro de showCountdown)
        // Passa wasPlaying=true e o tempo inicial para garantir que o timer seja iniciado corretamente
        showOrionMessage(1, true, gameState.timeLeft, () => {
            // Timer já foi iniciado pela contagem regressiva, apenas spawna alvo
            console.log('Callback após contagem: spawnando alvo');
            spawnTarget();
        });
        
        console.log('Jogo iniciado! Tamanho do alvo:', gameState.targetSize, 'px');
    } catch (error) {
        console.error('Erro ao iniciar jogo:', error);
        alert('Erro ao iniciar o jogo. Verifique o console.');
    }
}

/**
 * Inicia o timer regressivo
 */
function startTimer() {
    // Limpa timer anterior se existir
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    gameState.gameTimer = setInterval(() => {
        gameState.timeLeft--;
        
        // Atualiza power-ups ativos e aplica efeitos
        const powerUpEffects = updateActivePowerUps();
        applyPowerUpEffects(powerUpEffects);
        
        updateUI();
        updatePowerUpUI();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Inicia spawn de power-ups
    startPowerUpSpawning();
}

/**
 * Cria um novo elemento de alvo
 * @returns {HTMLElement} Elemento de alvo
 */
function createTargetElement() {
    const target = document.createElement('div');
    target.className = 'target';
    target.setAttribute('role', 'button');
    target.setAttribute('aria-label', 'Fenda de energia');
    target.setAttribute('tabindex', '0');
    target.style.display = 'none';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'target-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    
    const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerRing.setAttribute('class', 'outer-ring');
    outerRing.setAttribute('cx', '50');
    outerRing.setAttribute('cy', '50');
    outerRing.setAttribute('r', '45');
    outerRing.setAttribute('fill', 'none');
    outerRing.setAttribute('stroke', 'currentColor');
    outerRing.setAttribute('stroke-width', '2');
    
    const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    core.setAttribute('class', 'core');
    core.setAttribute('cx', '50');
    core.setAttribute('cy', '50');
    core.setAttribute('r', '15');
    core.setAttribute('fill', 'currentColor');
    
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('class', 'particle');
    particle.setAttribute('cx', '50');
    particle.setAttribute('cy', '50');
    particle.setAttribute('r', '3');
    particle.setAttribute('fill', 'currentColor');
    
    svg.appendChild(outerRing);
    svg.appendChild(core);
    svg.appendChild(particle);
    target.appendChild(svg);
    
    // Event listeners
    target.addEventListener('click', handleTargetClick);
    target.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleTargetClick(e);
    });
    
    // Aplica skin selecionada após o SVG ser criado
    // Usa requestAnimationFrame para garantir que o SVG está renderizado
    requestAnimationFrame(() => {
        const selectedSkin = getSelectedSkin();
        applySkinToTarget(target, selectedSkin);
    });
    
    return target;
}

/**
 * Gera um novo alvo na área de jogo
 */
function spawnTarget() {
    if (!gameState.isPlaying) {
        console.log('Spawn bloqueado: jogo não está em execução');
        return;
    }

    const container = elements.gameArea;
    if (!container) {
        console.warn('Container não encontrado');
        return;
    }
    
    const mechanics = getSectorMechanics(gameState.sector);
    
    // Limpa alvos órfãos (sem parentNode)
    cleanupOldTargets();
    
    // Conta quantos alvos estão atualmente visíveis
    const activeVisibleTargets = gameState.activeTargets.filter(t => 
        t.parentNode && t.style.display !== 'none'
    ).length;
    
    // Determina quantos alvos devem estar visíveis simultaneamente
    const targetsToSpawn = mechanics.simultaneousTargets || 1;
    
    // Calcula quantos alvos precisam ser spawnados
    const targetsNeeded = Math.max(0, targetsToSpawn - activeVisibleTargets);
    
    // Spawna apenas os alvos necessários
    for (let i = 0; i < targetsNeeded; i++) {
        spawnSingleTarget(container, mechanics);
    }
    
    // NÃO agenda próximo spawn aqui - cada alvo gerencia seu próprio timeout
    // Isso evita conflitos quando múltiplos alvos estão ativos
}

/**
 * Spawna um único alvo
 * @param {HTMLElement} container - Container do jogo
 * @param {Object} mechanics - Mecânicas do setor
 */
function spawnSingleTarget(container, mechanics) {
    // Garante que o container tem dimensões válidas
    if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.warn('Container sem dimensões válidas, tentando novamente...');
        setTimeout(() => spawnSingleTarget(container, mechanics), 100);
        return;
    }
    
    // Cria ou reutiliza alvo
    let target;
    
    // Tenta encontrar um alvo inativo (display === 'none') para reutilizar
    const inactiveTarget = gameState.activeTargets.find(t => 
        t.parentNode && t.style.display === 'none'
    );
    
    if (inactiveTarget) {
        // Reutiliza alvo inativo
        target = inactiveTarget;
        // Limpa timeout anterior se existir
        if (target.dataset.timeoutId) {
            clearTimeout(parseInt(target.dataset.timeoutId));
            target.dataset.timeoutId = null;
        }
    } else {
        // Cria novo alvo se não houver inativo
        target = createTargetElement();
        target.dataset.targetId = gameState.targetCounter++;
        container.appendChild(target);
        gameState.activeTargets.push(target);
    }
    
    // Define tamanho do alvo ANTES de qualquer cálculo (aplica multiplicador de power-up)
    const effectiveSize = gameState.targetSize * gameState.powerUpEffects.targetSizeMultiplier;
    target.style.width = `${effectiveSize}px`;
    target.style.height = `${effectiveSize}px`;
    target.style.position = 'absolute';
    target.style.margin = '0';
    target.style.padding = '0';
    target.style.left = '0';
    target.style.top = '0';
    
    // Aplica opacidade se fendas camufladas (com boost de visão prismática)
    if (mechanics.camouflagedTargets) {
        const baseOpacity = mechanics.targetOpacity || 0.6;
        const variation = mechanics.opacityVariation || 0.4;
        let opacity = baseOpacity + (Math.random() * variation);
        // Aplica boost de visão prismática
        opacity = Math.min(1.0, opacity + gameState.powerUpEffects.visibilityBoost);
        target.style.opacity = opacity;
        target.style.transition = 'opacity 0.3s ease';
    } else {
        target.style.opacity = '1';
    }
    
    // Mostra o alvo temporariamente para calcular dimensões
    target.style.display = 'block';
    target.style.visibility = 'hidden'; // Escondido mas ocupando espaço
    
    // Força reflow para garantir que dimensões foram aplicadas
    void target.offsetWidth;
    void target.offsetHeight;
    
    // Aguarda próximo frame para garantir renderização completa
    requestAnimationFrame(() => {
        // Agora posiciona com dimensões corretas
        randomPosition(container, target);
        
        // Validação extra após posicionar
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        // Se ainda estiver fora, força reposicionamento
        if (targetRect.right > containerRect.right || 
            targetRect.bottom > containerRect.bottom ||
            targetRect.left < containerRect.left ||
            targetRect.top < containerRect.top) {
            
            console.warn('Alvo fora dos limites após posicionamento, corrigindo...');
            
            // Calcula posição segura manualmente
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const targetWidth = target.offsetWidth;
            const targetHeight = target.offsetHeight;
            
            const maxX = Math.max(0, containerWidth - targetWidth);
            const maxY = Math.max(0, containerHeight - targetHeight);
            
            const safeX = Math.random() * maxX;
            const safeY = Math.random() * maxY;
            
            target.style.left = `${safeX}px`;
            target.style.top = `${safeY}px`;
        }
        
        // Agora mostra o alvo
        target.style.visibility = 'visible';
        
        // Aplica movimento dinâmico baseado nas mecânicas do setor
        applyTargetMovement(target, mechanics, container);
        
        // Marca se é alvo falso (Setor 4+)
        if (mechanics.fakeTargets && Math.random() < (mechanics.fakeTargetChance || 0.2)) {
            target.dataset.isFake = 'true';
            target.style.filter = 'hue-rotate(180deg) saturate(1.5)'; // Visual diferente para alvos falsos
        } else {
            target.dataset.isFake = 'false';
            target.style.filter = ''; // Remove filtro se não for falso
        }
        
        // Salva opacidade original para efeitos de piscar
        target.dataset.originalOpacity = target.style.opacity || '1';
    });
    
    // Remove após delay se não clicado e spawna novo alvo
    const timeoutId = setTimeout(() => {
        // Verifica se o alvo ainda existe e está visível
        if (!target || !target.parentNode) {
            return; // Alvo já foi removido
        }
        
        // Verifica se o alvo ainda está visível (não foi clicado)
        if (target.style.display === 'none') {
            return; // Alvo já foi escondido (provavelmente clicado)
        }
        
        // Limpa movimento antes de esconder
        clearTargetMovement(target);
        
        // Esconde o alvo
        target.style.display = 'none';
        target.style.opacity = '1'; // Reset opacity
        target.style.transform = ''; // Reset transform
        target.style.filter = ''; // Reset filter
        target.dataset.isFake = 'false'; // Reset flag
        
        // Limpa o timeout ID
        target.dataset.timeoutId = null;
        
        // Sempre spawna novo alvo quando um desaparece (se o jogo estiver rodando)
        if (gameState.isPlaying && gameState.timeLeft > 0) {
            // Pequeno delay para garantir que o alvo foi removido
            setTimeout(() => {
                if (gameState.isPlaying && gameState.timeLeft > 0) {
                    spawnTarget(); // Spawna apenas os alvos necessários
                }
            }, 50);
        }
    }, gameState.respawnDelay * gameState.powerUpEffects.respawnDelayMultiplier);
    
    // Armazena timeout ID no target para possível cancelamento
    target.dataset.timeoutId = timeoutId;
}

/**
 * Limpa alvos órfãos (sem parentNode) da lista de alvos ativos
 * NÃO remove alvos que estão apenas escondidos (display: none), pois podem ser reutilizados
 */
function cleanupOldTargets() {
    gameState.activeTargets = gameState.activeTargets.filter(target => {
        // Remove apenas alvos que não têm parentNode (foram removidos do DOM)
        if (!target.parentNode) {
            // Limpa timeout se existir
            if (target.dataset.timeoutId) {
                clearTimeout(parseInt(target.dataset.timeoutId));
                target.dataset.timeoutId = null;
            }
            return false; // Remove da lista
        }
        return true; // Mantém na lista (mesmo se display: none, pode ser reutilizado)
    });
}

/**
 * Manipula clique no alvo
 */
function handleTargetClick(event) {
    if (!gameState.isPlaying) return;
    
    event.stopPropagation();
    const target = event.currentTarget || event.target.closest('.target');
    
    if (!target) return;
    
    // Verifica se é power-up
    if (target.classList.contains('power-up')) {
        const powerUpType = target.dataset.powerUpType;
        if (powerUpType) {
            collectPowerUp(powerUpType, target);
            return; // Não processa como alvo normal
        }
    }
    
    // BUG FIX: Verifica se é alvo falso ANTES de calcular pontos
    if (target.dataset.isFake === 'true') {
        // Alvo falso: perde combo e não ganha pontos
        registerMiss();
        registerAchievementMiss(); // Tracking de conquistas
        playSound('miss');
        
        // Efeito visual de erro
        target.style.animation = 'targetError 0.5s ease-out forwards';
        setTimeout(() => {
            target.style.display = 'none';
            clearTargetMovement(target);
        }, 500);
        
        // Spawna novo alvo para substituir
        setTimeout(() => {
            if (gameState.isPlaying && gameState.timeLeft > 0) {
                spawnTarget();
            }
        }, 100);
        
        return; // Não processa como alvo válido
    }
    
    // Registra hit no sistema de combos e obtém multiplicador
    const comboMultiplier = registerHit();
    registerAchievementHit(); // Tracking de conquistas
    
    // Aplica multiplicador de power-up se houver
    const totalMultiplier = comboMultiplier * gameState.powerUpEffects.scoreMultiplier;
    
    // Aplica multiplicador permanente de upgrades
    const upgradeEffects = applyUpgradeEffects(gameState);
    const finalMultiplier = totalMultiplier + upgradeEffects.scoreMultiplier;
    
    // Calcula pontos com multiplicador total
    const pointsEarned = Math.floor(1 * finalMultiplier);
    gameState.score += pointsEarned;
    
    // Tracking de conquistas: score e combo
    registerScore(gameState.score);
    const comboState = getComboState();
    registerCombo(comboState.currentCombo);
    
    updateUI();
    playSound('hit');
    
    // Verifica efeito de explosão prismática
    if (gameState.powerUpEffects.destroyAllTargets) {
        destroyAllTargets();
        gameState.powerUpEffects.destroyAllTargets = false;
    }
    
    // Limpa movimento do alvo clicado
    clearTargetMovement(target);
    
    // Mostra feedback visual avançado de pontos ganhos
    showFloatingPoints(elements.gameArea, target, pointsEarned, totalMultiplier);
    
    // Cria partículas
    let particleColor = '#00f0ff';
    if (totalMultiplier >= 5.0) particleColor = '#ffd700';
    else if (totalMultiplier >= 3.0) particleColor = '#ff00f0';
    else if (totalMultiplier >= 2.0) particleColor = '#b347ff';
    createParticles(elements.gameArea, target, particleColor, 8);
    
    // Cria efeito ripple
    createRippleEffect(elements.gameArea, target, particleColor);
    
    // Efeito visual
    target.style.display = 'none';
    target.style.opacity = '1'; // Reset opacity
    target.style.transform = ''; // Reset transform
    target.style.filter = ''; // Reset filter
    target.dataset.isFake = 'false'; // Reset flag
    
    // Cancela timeout do alvo clicado
    if (target.dataset.timeoutId) {
        clearTimeout(parseInt(target.dataset.timeoutId));
        target.dataset.timeoutId = null;
    }
    
    // Spawna novo alvo para substituir o clicado (após pequeno delay)
    // spawnTarget() já verifica quantos alvos estão visíveis e spawna apenas os necessários
    setTimeout(() => {
        if (gameState.isPlaying && gameState.timeLeft > 0) {
            spawnTarget(); // Spawna apenas os alvos necessários para manter o número correto
        }
    }, 100);
    
    // Verifica progressão de setor
    checkSectorProgression();
}

/**
 * Verifica se deve avançar de setor
 */
function checkSectorProgression() {
    // Progressão exponencial: 0, 15, 40, 100, 250, 600
    const sectorThresholds = [0, 15, 40, 100, 250, 600];
    let newSector = 1;
    
    for (let i = sectorThresholds.length - 1; i >= 0; i--) {
        if (gameState.score >= sectorThresholds[i]) {
            newSector = i + 1;
            break;
        }
    }
    
    if (newSector !== gameState.sector && newSector <= 6) {
        transitionToSector(newSector);
    }
    
    // Tracking de conquistas: setor atual
    registerSector(gameState.sector);
}

/**
 * Transiciona para um novo setor com efeitos visuais e mensagem
 * @param {number} newSector - Número do novo setor
 */
function transitionToSector(newSector) {
    const oldSector = gameState.sector;
    
    // Atualiza setor no gameState
    gameState.sector = newSector;
    
    // Tracking de conquistas: novo setor alcançado
    registerSector(newSector);
    
    // Cancela qualquer spawn pendente
    if (gameState.targetTimer) {
        clearTimeout(gameState.targetTimer);
        gameState.targetTimer = null;
    }
    
    // IMPORTANTE: Pausa o timer ANTES de qualquer coisa
    // Salva o estado atual do jogo
    const wasPlaying = gameState.isPlaying;
    const savedTimeLeft = gameState.timeLeft;
    
    // Pausa o jogo e o timer
    gameState.isPlaying = false;
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    // RESET: Define o tempo para o novo setor (120 segundos)
    gameState.timeLeft = 120;
    
    // Aplica configurações do novo setor
    updateDifficulty();
    applySectorVisuals(elements.gameArea, newSector);
    
    // Mostra animação de Level Up
    showLevelUpAnimation(elements.gameArea, newSector, () => {
        // Após animação de level up, mostra transição de setor
        showSectorTransition(newSector, () => {
            updateUI();
            playSound('start'); // Som de transição
            
            // Limpa alvos ativos
            cleanupOldTargets();
            
            // Após transição, mostra mensagem de ORION
            // O timer será reiniciado APENAS após a contagem regressiva terminar
            // Passes true and new timeLeft for proper countdown
            showOrionMessage(newSector, true, gameState.timeLeft, () => {
                // Callback após contagem: timer já foi iniciado por showCountdown
                // Apenas spawna alvo se necessário
                if (gameState.isPlaying && gameState.timeLeft > 0) {
                    try {
                        if (bossManager.shouldSpawnForSector(newSector) && !bossManager.isBossActive()) {
                            // pausa e inicia fluxo de chefe; bossManager chamará callback on completion
                            const wasPlaying = gameState.isPlaying;
                            gameState.isPlaying = false;
                            if (gameState.gameTimer) { clearInterval(gameState.gameTimer); gameState.gameTimer = null; }

                            bossManager.startBossForSector(newSector, ({ success, bossId }) => {
                                console.log('Boss flow finished:', bossId, success);
                                gameState.isPlaying = wasPlaying;
                                if (gameState.isPlaying && gameState.timeLeft > 0) startTimer();
                                // spawn normal após boss
                                setTimeout(() => { if (gameState.isPlaying) spawnTarget(); }, 300);
                            });
                        } else {
                            spawnTarget();
                        }
                    } catch (e) {
                        console.error('Erro ao tentar spawnar chefe:', e);
                        spawnTarget();
                    }
                }
            });
        });
    });
}

/**
 * Mostra efeito visual de transição entre setores
 * @param {number} sectorNumber - Número do setor
 * @param {Function} callback - Callback após transição
 */
function showSectorTransition(sectorNumber, callback) {
    const gameArea = elements.gameArea;
    
    // Adiciona classe de transição
    gameArea.classList.add('sector-transition');
    
    // Flash de luz
    const flash = document.createElement('div');
    flash.className = 'sector-flash';
    flash.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.5) 0%, transparent 70%);
        pointer-events: none;
        z-index: 100;
        animation: flashTransition 0.5s ease-out;
    `;
    gameArea.appendChild(flash);
    
    // Remove flash após animação
    setTimeout(() => {
        flash.remove();
        gameArea.classList.remove('sector-transition');
        if (callback) callback();
    }, 500);
}

/**
 * Mostra contagem regressiva de 3 segundos
 * @param {HTMLElement} overlay - Overlay da mensagem
 * @param {HTMLElement} messageBox - Caixa de mensagem
 * @param {boolean} wasPlaying - Estado do jogo antes da contagem
 * @param {number} savedTimeLeft - Tempo restante salvo
 * @param {Function} onContinue - Callback após contagem
 */
function showCountdown(overlay, messageBox, wasPlaying, savedTimeLeft, onContinue) {
    // Se savedTimeLeft não foi fornecido, pode ser que onContinue esteja na posição errada
    if (typeof savedTimeLeft === 'function') {
        onContinue = savedTimeLeft;
        savedTimeLeft = gameState.timeLeft; // Usa tempo atual
    }
    
    let countdown = 3;
    
    console.log('Contagem iniciada. wasPlaying:', wasPlaying, 'savedTimeLeft:', savedTimeLeft, 'isPlaying:', gameState.isPlaying);
    
    // Garante que o jogo está pausado durante a contagem
    gameState.isPlaying = false;
    
    // Garante que o timer está parado
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-display';
    countdownElement.style.cssText = `
        font-size: 4rem;
        font-weight: 900;
        background: linear-gradient(135deg, #00f0ff, #ff00f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
        margin: 1rem 0;
        animation: pulseCountdown 0.5s ease-out;
    `;
    countdownElement.textContent = countdown;
    messageBox.appendChild(countdownElement);
    
    // Atualiza contagem a cada segundo
    const countdownInterval = setInterval(() => {
        countdown--;
        
        if (countdown > 0) {
            countdownElement.textContent = countdown;
            countdownElement.style.animation = 'none';
            // Força reflow para reiniciar animação
            void countdownElement.offsetWidth;
            countdownElement.style.animation = 'pulseCountdown 0.5s ease-out';
            playSound('hit'); // Som a cada número
        } else {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'INICIANDO!';
            countdownElement.style.fontSize = '2rem';
            playSound('start'); // Som final
            
            // Remove overlay após animação
            setTimeout(() => {
                overlay.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    overlay.remove();
                    
                    // APÓS contagem terminar completamente, retoma jogo e inicia timer
                    gameState.isPlaying = wasPlaying;
                    gameState.timeLeft = savedTimeLeft; // Restaura tempo (caso tenha sido alterado)
                    
                    console.log('Contagem terminou. Estado:', {
                        isPlaying: gameState.isPlaying,
                        timeLeft: gameState.timeLeft,
                        wasPlaying: wasPlaying
                    });
                    
                    // Inicia timer APENAS após contagem terminar completamente
                    if (gameState.isPlaying && gameState.timeLeft > 0) {
                        console.log('Iniciando timer após contagem regressiva:', gameState.timeLeft, 'segundos');
                        startTimer();
                    } else {
                        console.warn('Timer não iniciado:', {
                            isPlaying: gameState.isPlaying,
                            timeLeft: gameState.timeLeft
                        });
                    }
                    
                    // Chama callback original (que spawna os alvos)
                    if (onContinue) {
                        console.log('Chamando callback onContinue para spawnar alvos');
                        onContinue();
                    } else {
                        console.warn('Callback onContinue não fornecido!');
                    }
                }, 300);
            }, 500);
        }
    }, 1000);
}

/**
 * Mostra mensagem narrativa de ORION
 * @param {number} sectorNumber - Número do setor
 * @param {boolean} [wasPlaying] - Estado do jogo antes da mensagem (opcional)
 * @param {number} [savedTimeLeft] - Tempo restante salvo (opcional)
 * @param {Function} [onContinue] - Callback quando o jogador continuar
 */
function showOrionMessage(sectorNumber, wasPlaying, savedTimeLeft, onContinue) {
    // Se onContinue não foi fornecido, os parâmetros podem estar em ordem diferente
    // Verifica se o segundo parâmetro é uma função (callback antigo)
    if (typeof wasPlaying === 'function') {
        onContinue = wasPlaying;
        wasPlaying = gameState.isPlaying; // Usa estado atual
        savedTimeLeft = gameState.timeLeft; // Usa tempo atual
    } else if (typeof savedTimeLeft === 'function') {
        onContinue = savedTimeLeft;
        savedTimeLeft = gameState.timeLeft; // Usa tempo atual
    }
    
    // Se wasPlaying não foi fornecido, usa o estado atual
    if (wasPlaying === undefined) {
        wasPlaying = gameState.isPlaying;
    }
    
    // Se savedTimeLeft não foi fornecido, usa o tempo atual
    if (savedTimeLeft === undefined) {
        savedTimeLeft = gameState.timeLeft;
    }
    
    const message = getOrionMessage(sectorNumber);
    if (!message) {
        if (onContinue) onContinue();
        return;
    }
    
    // Cria overlay de mensagem
    const overlay = document.createElement('div');
    overlay.className = 'orion-message-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 14, 26, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        animation: fadeIn 0.3s ease-in;
    `;
    
    const messageBox = document.createElement('div');
    messageBox.className = 'orion-message-box';
    messageBox.style.cssText = `
        background: rgba(26, 31, 46, 0.9);
        border: 2px solid rgba(0, 240, 255, 0.5);
        border-radius: 12px;
        padding: 2rem;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
        animation: slideUp 0.4s ease-out;
    `;
    
    const title = document.createElement('h3');
    title.textContent = message.title;
    title.style.cssText = `
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #00f0ff, #ff00f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
    `;
    
    const text = document.createElement('p');
    text.textContent = message.text;
    text.style.cssText = `
        font-size: 1rem;
        color: #a0a0a0;
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
    `;
    
    // Botão de continuar
    const continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continuar';
    continueBtn.className = 'btn-primary orion-continue-btn';
    continueBtn.style.cssText = `
        padding: 0.75rem 2rem;
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: linear-gradient(135deg, #00f0ff, #ff00f0);
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
        transition: all 0.3s ease;
        min-height: 44px;
        touch-action: manipulation;
        width: auto;
        min-width: 200px;
        max-width: 300px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem auto 0 auto;
    `;
    
    // Efeito hover
    continueBtn.addEventListener('mouseenter', () => {
        continueBtn.style.transform = 'scale(1.05)';
        continueBtn.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.8)';
    });
    
    continueBtn.addEventListener('mouseleave', () => {
        continueBtn.style.transform = 'scale(1)';
        continueBtn.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.5)';
    });
    
    // Ação ao clicar
    continueBtn.addEventListener('click', () => {
        playSound('hit');
        // Remove o botão e mostra contagem regressiva
        continueBtn.remove();
        text.style.marginBottom = '0.5rem';
        
        // Usa wasPlaying e savedTimeLeft passados como parâmetros, ou usa o estado atual
        const currentWasPlaying = wasPlaying !== undefined ? wasPlaying : gameState.isPlaying;
        const currentSavedTimeLeft = savedTimeLeft !== undefined ? savedTimeLeft : gameState.timeLeft;
        
        // Pausa o jogo durante a contagem (garante que timer não conte)
        gameState.isPlaying = false;
        
        // Pausa o timer se estiver rodando
        if (gameState.gameTimer) {
            clearInterval(gameState.gameTimer);
            gameState.gameTimer = null;
        }
        
        // Mostra contagem regressiva
        // Passa wasPlaying e savedTimeLeft para que showCountdown possa restaurar corretamente
        showCountdown(overlay, messageBox, currentWasPlaying, currentSavedTimeLeft, () => {
            // Após contagem, callback original é chamado (jogo já foi retomado e timer iniciado)
            console.log('Callback após contagem sendo executado');
            if (onContinue) {
                onContinue();
            } else {
                console.warn('onContinue não fornecido no callback!');
            }
        });
    });
    
    // Suporte a toque
    continueBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        continueBtn.click();
    });
    
    messageBox.appendChild(title);
    messageBox.appendChild(text);
    messageBox.appendChild(continueBtn);
    overlay.appendChild(messageBox);
    elements.gameArea.appendChild(overlay);
}

/**
 * Detecta se está em dispositivo móvel
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768 && 'ontouchstart' in window);
}

/**
 * Atualiza dificuldade baseada no setor usando phaseManager
 */
function updateDifficulty() {
    const sectorDifficulty = getSectorDifficulty(gameState.sector);
    const isMobileDevice = isMobile();
    
    // Aplica configurações do setor
    gameState.targetSize = sectorDifficulty.targetSize;
    gameState.respawnDelay = sectorDifficulty.respawnDelay;
    
    // Aplica efeitos de upgrades
    const upgradeEffects = applyUpgradeEffects(gameState);
    if (upgradeEffects.targetSizeMultiplier) {
        gameState.targetSize *= upgradeEffects.targetSizeMultiplier;
    }
    
    // Em mobile, aumenta tamanho mínimo para facilitar toque
    if (isMobileDevice) {
        const minSize = 60;
        if (gameState.targetSize < minSize) {
            gameState.targetSize = minSize;
        }
    }
    
    // Aplica variação de delay se disponível
    if (sectorDifficulty.minRespawnDelay && sectorDifficulty.maxRespawnDelay) {
        const variation = sectorDifficulty.maxRespawnDelay - sectorDifficulty.minRespawnDelay;
        gameState.respawnDelay = sectorDifficulty.minRespawnDelay + Math.random() * variation;
    }
}

/**
 * Finaliza o jogo
 */
function endGame() {
    gameState.isPlaying = false;
    
    // Remove barra de progresso
    const progressBar = document.querySelector('.sector-progress-bar');
    if (progressBar) {
        progressBar.remove();
    }
    
    // Para spawn de power-ups
    stopPowerUpSpawning();
    // Remove qualquer overlay pendente
    const orionOverlays = document.querySelectorAll('.orion-message-overlay');
    orionOverlays.forEach(overlay => overlay.remove());
    
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    if (gameState.targetTimer) {
        clearTimeout(gameState.targetTimer);
        gameState.targetTimer = null;
    }
    
    // Esconde todos os alvos ativos
    gameState.activeTargets.forEach(target => {
        target.style.display = 'none';
    });
    
    // Esconde alvo principal também
    if (elements.target) {
        elements.target.style.display = 'none';
    }
    
    // Limpa alvos
    cleanupOldTargets();
    
    elements.finalScore.textContent = gameState.score;
    const sectorConfig = getSectorConfig(gameState.sector);
    elements.gameOverTitle.textContent = `Setor ${gameState.sector} - ${sectorConfig.name} Desestabilizado`;
    
    // Finaliza tracking de conquistas
    endAchievementGame();
    
    // Calcula e adiciona energia ganha
    const comboState = getComboState();
    const energyEarned = calculateEnergyFromGame(
        gameState.score,
        gameState.sector,
        comboState.maxCombo
    );
    addEnergy(energyEarned);
    
    playSound('gameover');
    showGameOverScreen();
    
    // Atualiza display de energia
    updateEnergyDisplay();
    
    // TODO: Submeter score para Supabase
    // submitScore({ username: 'Player', score: gameState.score, mode: 'total' });
}

/**
 * Atualiza elementos da UI
 */
function updateUI() {
    elements.score.textContent = gameState.score;
    elements.timer.textContent = formatTime(gameState.timeLeft);
    elements.sector.textContent = gameState.sector;
    
    // Atualiza barra de progresso para próximo setor
    if (gameState.isPlaying) {
        updateSectorProgressBar(elements.gameArea, gameState.score, gameState.sector);
    } else {
        // Remove barra quando não está jogando
        const existing = document.querySelector('.sector-progress-bar');
        if (existing) {
            existing.remove();
        }
    }
}

/**
 * Mostra/esconde telas
 */
function hideAllScreens() {
    elements.startScreen.style.display = 'none';
    elements.gameOverScreen.style.display = 'none';
    elements.leaderboardScreen.style.display = 'none';
    elements.achievementsScreen.style.display = 'none';
}

function showGameOverScreen() {
    elements.gameOverScreen.style.display = 'flex';
    
    // Mostra botão de menu na tela de game over
    if (elements.menuBtn) {
        elements.menuBtn.style.display = 'block';
    }
}

function showLeaderboard() {
    elements.leaderboardScreen.style.display = 'flex';
    loadLeaderboard('total');
    
    // Mostra botão de menu na tela de leaderboard
    if (elements.menuBtn) {
        elements.menuBtn.style.display = 'block';
    }
}

function hideLeaderboard() {
    elements.leaderboardScreen.style.display = 'none';
}

/**
 * Mostra tela de conquistas
 */
function showAchievements() {
    elements.achievementsScreen.style.display = 'flex';
    
    // Esconde display de energia flutuante quando tela de conquistas está aberta
    if (elements.energyDisplay && elements.energyDisplay.parentElement) {
        elements.energyDisplay.parentElement.style.display = 'none';
    }
    
    // Mostra botão de menu na tela de conquistas
    if (elements.menuBtn) {
        elements.menuBtn.style.display = 'block';
    }
    
    loadAchievements();
}

/**
 * Esconde tela de conquistas
 */
function hideAchievements() {
    elements.achievementsScreen.style.display = 'none';
    
    // Mostra display de energia flutuante novamente quando tela de conquistas fecha
    if (elements.energyDisplay && elements.energyDisplay.parentElement) {
        elements.energyDisplay.parentElement.style.display = 'flex';
    }
}

/**
 * Carrega e exibe conquistas
 */
function loadAchievements() {
    const stats = getAchievementStats();
    const allAchievements = getAllAchievements();
    
    // Atualiza estatísticas
    if (elements.achievementsStats) {
        const totalEnergy = getTotalEnergy();
        elements.achievementsStats.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem; background: rgba(255, 215, 0, 0.1); border-radius: 12px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 1.5rem;">
                    <span style="font-size: 1.5rem;">⚡</span>
                    <span style="font-size: 1.5rem; font-weight: 900; color: #ffd700;">${totalEnergy}</span>
                    <span style="font-size: 0.9rem; color: #a0a0a0;">Moedas</span>
                </div>
                <div style="display: flex; justify-content: space-around; padding: 1.5rem; background: rgba(0, 240, 255, 0.1); border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.3);">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 900; color: #00f0ff;">${stats.unlockedCount}</div>
                        <div style="font-size: 0.9rem; color: #a0a0a0; margin-top: 0.5rem;">Desbloqueadas</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 900; color: #00f0ff;">${stats.totalAchievements}</div>
                        <div style="font-size: 0.9rem; color: #a0a0a0; margin-top: 0.5rem;">Total</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 900; color: #00f0ff;">${stats.unlockedPercentage}%</div>
                        <div style="font-size: 0.9rem; color: #a0a0a0; margin-top: 0.5rem;">Progresso</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Agrupa conquistas por categoria
    const categories = ['Progresso', 'Combos', 'Precisão', 'Progressão', 'Power-Ups', 'Customização', 'Estatísticas'];
    let html = '';
    
    categories.forEach(category => {
        const categoryAchievements = getAchievementsByCategory(category);
        if (categoryAchievements.length === 0) return;
        
        html += `<div class="achievement-category" style="margin-bottom: 2rem;">`;
        html += `<h3 style="font-size: 1.2rem; font-weight: 700; color: #00f0ff; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">${category}</h3>`;
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">`;
        
        categoryAchievements.forEach(achievementId => {
            const config = getAchievementConfig(achievementId);
            const progress = getAchievementProgress(achievementId);
            const unlocked = isAchievementUnlocked(achievementId);
            
            const rarityColor = getRarityColor(config.rarity);
            const opacity = unlocked ? '1' : '0.5';
            const borderColor = unlocked ? rarityColor : '#404040';
            
            html += `
                <div class="achievement-item" style="
                    background: rgba(26, 31, 46, 0.8);
                    border: 2px solid ${borderColor};
                    border-radius: 12px;
                    padding: 1.5rem;
                    opacity: ${opacity};
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    ${unlocked ? `
                        <div style="position: absolute; top: 0; right: 0; width: 0; height: 0; border-left: 30px solid transparent; border-top: 30px solid ${rarityColor};"></div>
                        <div style="position: absolute; top: 5px; right: 5px; font-size: 1rem;">✓</div>
                    ` : ''}
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; filter: ${unlocked ? 'none' : 'grayscale(100%)'};">
                            ${config.icon}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="font-size: 1.1rem; font-weight: 700; color: ${unlocked ? rarityColor : '#a0a0a0'}; margin-bottom: 0.25rem;">
                                ${config.name}
                            </h4>
                            <div style="font-size: 0.75rem; color: ${rarityColor}; text-transform: uppercase; letter-spacing: 0.1em;">
                                ${config.rarity}
                            </div>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: #a0a0a0; margin-bottom: 1rem; line-height: 1.5;">
                        ${config.description}
                    </p>
                    ${!unlocked && progress ? `
                        <div style="margin-top: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #a0a0a0; margin-bottom: 0.5rem;">
                                <span>Progresso</span>
                                <span>${progress.current} / ${progress.target}</span>
                            </div>
                            <div style="background: rgba(0, 0, 0, 0.3); border-radius: 8px; height: 8px; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, ${rarityColor}, ${rarityColor}80); height: 100%; width: ${progress.percentage}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div></div>`;
    });
    
    if (elements.achievementsList) {
        elements.achievementsList.innerHTML = html || '<p style="text-align: center; color: var(--text-secondary);">Nenhuma conquista encontrada.</p>';
    }
}

/**
 * Mostra menu de jogo
 */
function showGameMenu() {
    // Pausa o jogo antes de mostrar o menu
    const wasPlaying = gameState.isPlaying;
    gameState.isPlaying = false;
    
    // Para o timer se estiver rodando
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    // Remove qualquer overlay de mensagem aberta (como ORION message)
    const orionOverlays = document.querySelectorAll('.orion-message-overlay');
    orionOverlays.forEach(overlay => overlay.remove());
    
    if (elements.gameMenu) {
        elements.gameMenu.style.display = 'flex';
        
        // Garante que o overlay está visível e cobre tudo
        const menuOverlay = elements.gameMenu.querySelector('.menu-overlay');
        if (menuOverlay) {
            menuOverlay.style.display = 'block';
            menuOverlay.style.opacity = '1';
        }
        
        // Garante que o conteúdo do menu esteja visível
        const menuContent = elements.gameMenu.querySelector('.menu-content');
        if (menuContent) {
            menuContent.style.display = 'block';
            menuContent.style.visibility = 'visible';
            menuContent.style.opacity = '1';
        }
        // Esconde o botão do menu quando o menu está aberto
        if (elements.menuBtn) {
            elements.menuBtn.style.display = 'none';
        }
        playSound('hit');
        
        // Armazena o estado anterior para recuperar depois
        gameState._menuWasPlaying = wasPlaying;
    }
}

/**
 * Esconde menu de jogo
 */
function hideGameMenu() {
    if (elements.gameMenu) {
        elements.gameMenu.style.display = 'none';
        
        // Restaura o estado anterior do jogo
        if (gameState._menuWasPlaying) {
            gameState.isPlaying = true;
            
            // Reinicia o timer se o jogo estava rodando
            if (gameState.timeLeft > 0) {
                startTimer();
            }
        }
        
        // Mostra o botão do menu novamente quando o menu é fechado
        if (elements.menuBtn && gameState.isPlaying) {
            elements.menuBtn.style.display = 'block';
        }
        playSound('hit');
    }
}

/**
 * Volta para tela inicial
 */
function returnToHomeScreen() {
    console.log('Voltando para tela inicial...');
    
    // Para o jogo se estiver rodando
    if (gameState.isPlaying) {
        gameState.isPlaying = false;
        
        // Para todos os timers
        if (gameState.gameTimer) {
            clearInterval(gameState.gameTimer);
            gameState.gameTimer = null;
        }
        if (gameState.targetTimer) {
            clearTimeout(gameState.targetTimer);
            gameState.targetTimer = null;
        }
        
        // Para spawn de power-ups
        stopPowerUpSpawning();
        
        // Remove barra de progresso
        const progressBar = document.querySelector('.sector-progress-bar');
        if (progressBar) {
            progressBar.remove();
        }
        
        // Esconde todos os alvos
        gameState.activeTargets.forEach(target => {
            if (target && target.parentNode) {
                target.style.display = 'none';
            }
        });
        
        // Esconde alvo principal
        if (elements.target) {
            elements.target.style.display = 'none';
        }
        
        // Limpa alvos
        cleanupOldTargets();
    }
    
    // Esconde todas as telas
    hideAllScreens();
    
    // Esconde menu
    hideGameMenu();
    
    // Mostra tela inicial
    if (elements.startScreen) {
        elements.startScreen.style.display = 'flex';
    }
    
    // Esconde botão de menu (só aparece durante o jogo)
    if (elements.menuBtn) {
        elements.menuBtn.style.display = 'none';
    }
    
    // Atualiza display de energia
    updateEnergyDisplay();
    
    // Reseta estado do jogo (mas mantém moedas, skins, conquistas no localStorage)
    gameState.score = 0;
    gameState.sector = 1;
    gameState.timeLeft = 0;
    gameState.difficulty = 'normal';
    
    // Reseta combos
    resetCombo();
    updateComboUI({ combo: 0, multiplier: 1.0, streak: 0 });
    
    // Reseta power-ups
    resetPowerUpSystem();
    gameState.powerUpEffects = {
        respawnDelayMultiplier: 1.0,
        scoreMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
        visibilityBoost: 0,
        ignoreNextMiss: false
    };
    updatePowerUpUI();
    
    // Atualiza UI
    updateUI();
    
    playSound('hit');
    console.log('Retornado para tela inicial. Estado preservado (moedas, skins, conquistas).');
}

/**
 * Carrega leaderboard (placeholder)
 */
async function loadLeaderboard(mode) {
    elements.leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Carregando ranking...</p>';
    
    // TODO: Implementar com Supabase
    // const scores = await getTopScores({ mode, limit: 100 });
    
    // Placeholder
    setTimeout(() => {
        elements.leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Ranking em desenvolvimento<br><small>Será implementado com Supabase</small></p>';
    }, 500);
}

// Previne cliques/toques na área de jogo (fora do alvo)
elements.gameArea.addEventListener('click', (e) => {
    if (gameState.isPlaying && e.target === elements.gameArea) {
        // Opcional: penalidade por clicar fora
        // playSound('miss');
    }
});

elements.gameArea.addEventListener('touchend', (e) => {
    if (gameState.isPlaying && e.target === elements.gameArea) {
        e.preventDefault();
    }
});

// Limpa alvos ao reiniciar
function resetTargets() {
    gameState.activeTargets.forEach(target => {
        // Limpa movimentos antes de remover
        clearTargetMovement(target);
        if (target.parentNode) {
            target.remove();
        }
    });
    gameState.activeTargets = [];
    gameState.targetCounter = 0;
}

/**
 * ============================================
 * SISTEMA DE COMBOS - UI E CALLBACKS
 * ============================================
 */

/**
 * Cria a UI visual do sistema de combos
 */
function createComboUI() {
    const gameArea = elements.gameArea;
    if (!gameArea) return;
    
    // Container de combo
    const comboContainer = document.createElement('div');
    comboContainer.id = 'combo-container';
    comboContainer.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 50;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        pointer-events: none;
    `;
    
    // Display de combo
    const comboDisplay = document.createElement('div');
    comboDisplay.id = 'combo-display';
    comboDisplay.style.cssText = `
        font-size: clamp(1.2rem, 4vw, 2rem);
        font-weight: 900;
        color: var(--accent-cyan, #00f0ff);
        text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease;
    `;
    comboDisplay.textContent = 'COMBO: 0';
    
    // Display de multiplicador
    const multiplierDisplay = document.createElement('div');
    multiplierDisplay.id = 'multiplier-display';
    multiplierDisplay.style.cssText = `
        font-size: clamp(1rem, 3vw, 1.5rem);
        font-weight: 700;
        color: var(--accent-purple, #ff00f0);
        text-shadow: 0 0 15px rgba(255, 0, 240, 0.6);
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease;
    `;
    multiplierDisplay.textContent = 'x1.0';
    
    comboContainer.appendChild(comboDisplay);
    comboContainer.appendChild(multiplierDisplay);
    gameArea.appendChild(comboContainer);
    
    elements.comboDisplay = comboDisplay;
    elements.multiplierDisplay = multiplierDisplay;
}

/**
 * Atualiza a UI do combo
 * @param {Object} state - Estado do combo {combo, multiplier, streak}
 */
function updateComboUI(state) {
    if (!elements.comboDisplay || !elements.multiplierDisplay) return;
    
    const { combo, multiplier, streak } = state;
    
    // Atualiza display de combo
    if (combo > 0) {
        elements.comboDisplay.textContent = `COMBO: ${combo}`;
        elements.comboDisplay.style.opacity = '1';
        elements.comboDisplay.style.transform = 'scale(1)';
        
        // Animação de pulso para combos altos
        if (combo >= 20) {
            elements.comboDisplay.style.animation = 'comboPulse 0.5s ease-out';
        } else {
            elements.comboDisplay.style.animation = 'none';
        }
    } else {
        elements.comboDisplay.style.opacity = '0';
        elements.comboDisplay.style.transform = 'scale(0.8)';
    }
    
    // Atualiza display de multiplicador
    if (multiplier > 1.0) {
        elements.multiplierDisplay.textContent = `x${multiplier.toFixed(1)}`;
        elements.multiplierDisplay.style.opacity = '1';
        elements.multiplierDisplay.style.transform = 'scale(1)';
        
        // Cor diferente para multiplicadores altos
        if (multiplier >= 5.0) {
            elements.multiplierDisplay.style.color = '#ffd700';
            elements.multiplierDisplay.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        } else if (multiplier >= 3.0) {
            elements.multiplierDisplay.style.color = '#ff00f0';
            elements.multiplierDisplay.style.textShadow = '0 0 15px rgba(255, 0, 240, 0.6)';
        } else {
            elements.multiplierDisplay.style.color = '#00f0ff';
            elements.multiplierDisplay.style.textShadow = '0 0 15px rgba(0, 240, 255, 0.6)';
        }
    } else {
        elements.multiplierDisplay.style.opacity = '0';
        elements.multiplierDisplay.style.transform = 'scale(0.8)';
    }
}

/**
 * Callback quando atinge milestone de combo
 * @param {number} combo - Número do combo
 * @param {number} multiplier - Multiplicador atual
 */
function handleComboMilestone(combo, multiplier) {
    console.log(`🎉 Milestone de combo atingido: ${combo}! Multiplicador: ${multiplier}x`);
    
    // Toca som especial
    playSound('hit');
    
    // Mostra efeito visual avançado de combo
    showComboEffect(elements.gameArea, combo);
}

/**
 * Callback quando perde combo
 * @param {number} lostCombo - Combo que foi perdido
 */
function handleComboLost(lostCombo) {
    if (lostCombo >= 10) {
        console.log(`💔 Combo perdido: ${lostCombo}`);
        // Feedback visual sutil
        if (elements.comboDisplay) {
            elements.comboDisplay.style.animation = 'comboLost 0.5s ease-out';
        }
    }
}

/**
 * Callback quando multiplicador muda
 * @param {number} newMultiplier - Novo multiplicador
 * @param {number} oldMultiplier - Multiplicador anterior
 */
function handleMultiplierChange(newMultiplier, oldMultiplier) {
    console.log(`⚡ Multiplicador mudou: ${oldMultiplier}x → ${newMultiplier}x`);
    
    // Animação especial quando multiplicador aumenta significativamente
    if (newMultiplier > oldMultiplier && newMultiplier >= 2.0) {
        if (elements.multiplierDisplay) {
            elements.multiplierDisplay.style.animation = 'multiplierBoost 0.6s ease-out';
        }
    }
}


/**
 * ============================================
 * SISTEMA DE POWER-UPS - UI E CALLBACKS
 * ============================================
 */

/**
 * Cria a UI visual do sistema de power-ups
 */
function createPowerUpUI() {
    const gameArea = elements.gameArea;
    if (!gameArea) return;
    
    // Container de power-ups ativos (canto inferior esquerdo)
    const powerUpContainer = document.createElement('div');
    powerUpContainer.id = 'powerup-container';
    powerUpContainer.style.cssText = `
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
    `;
    
    gameArea.appendChild(powerUpContainer);
    elements.powerUpContainer = powerUpContainer;
}

/**
 * Atualiza a UI de power-ups ativos
 */
function updatePowerUpUI() {
    if (!elements.powerUpContainer) return;
    
    const activePowerUps = getActivePowerUps();
    
    // Limpa container
    elements.powerUpContainer.innerHTML = '';
    
    // Adiciona cada power-up ativo
    activePowerUps.forEach(powerUp => {
        const timeRemaining = Math.ceil(powerUp.timeRemaining / 1000);
        const progress = (powerUp.timeRemaining / powerUp.config.duration) * 100;
        
        const powerUpElement = document.createElement('div');
        powerUpElement.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: rgba(26, 31, 46, 0.8);
            border: 2px solid ${powerUp.config.color};
            border-radius: 8px;
            font-size: 0.875rem;
            color: ${powerUp.config.color};
            box-shadow: 0 0 15px ${powerUp.config.color}40;
        `;
        
        powerUpElement.innerHTML = `
            <span style="font-size: 1.2rem;">${powerUp.config.icon}</span>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; margin-bottom: 0.25rem;">${powerUp.config.name}</div>
                <div style="font-size: 0.75rem; opacity: 0.8;">${timeRemaining}s</div>
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; margin-top: 0.25rem; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: ${powerUp.config.color}; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
        
        elements.powerUpContainer.appendChild(powerUpElement);
    });
}

/**
 * Callback quando power-up spawna
 */
function handlePowerUpSpawn(type, config) {
    console.log(`Power-up spawnado: ${config.name}`);
    
    // Cria elemento visual do power-up na área de jogo
    const gameArea = elements.gameArea;
    if (!gameArea || !gameState.isPlaying) return;
    
    const powerUpElement = document.createElement('div');
    powerUpElement.className = 'power-up target';
    powerUpElement.dataset.powerUpType = type;
    powerUpElement.style.cssText = `
        position: absolute;
        width: 80px;
        height: 80px;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        background: radial-gradient(circle, ${config.color}40, transparent);
        border: 3px solid ${config.color};
        border-radius: 50%;
        box-shadow: 0 0 30px ${config.color}, inset 0 0 20px ${config.color}40;
        animation: powerUpPulse 1.5s ease-in-out infinite;
    `;
    powerUpElement.textContent = config.icon;
    powerUpElement.title = config.name + ': ' + config.description;
    
    // Posiciona aleatoriamente
    randomPosition(gameArea, powerUpElement);
    
    // Adiciona evento de clique
    powerUpElement.addEventListener('click', (e) => {
        e.stopPropagation();
        collectPowerUp(type, powerUpElement);
    });
    
    powerUpElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        collectPowerUp(type, powerUpElement);
    });
    
    gameArea.appendChild(powerUpElement);
    elements.powerUpSpawnElement = powerUpElement;
    
    // Remove após 10 segundos se não coletado
    setTimeout(() => {
        if (powerUpElement.parentNode) {
            powerUpElement.remove();
            markPowerUpCollected();
        }
    }, 10000);
}

/**
 * Coleta um power-up
 */
function collectPowerUp(type, element) {
    if (!gameState.isPlaying) return;
    
    playSound('hit');
    
    // Ativa o power-up
    const effects = activatePowerUp(type, gameState);
    
    // Aplica efeitos instantâneos
    if (effects) {
        applyPowerUpEffects(effects);
    }
    
    // Remove elemento visual
    if (element && element.parentNode) {
        element.style.animation = 'powerUpCollect 0.5s ease-out forwards';
        setTimeout(() => {
            element.remove();
            markPowerUpCollected();
        }, 500);
    }
}

/**
 * Aplica efeitos de power-ups ao estado do jogo
 */
function applyPowerUpEffects(effects) {
    if (!effects) return;
    
    // Atualiza estado de efeitos
    gameState.powerUpEffects = {
        respawnDelayMultiplier: effects.respawnDelayMultiplier || 1.0,
        scoreMultiplier: effects.scoreMultiplier || 1.0,
        targetSizeMultiplier: effects.targetSizeMultiplier || 1.0,
        visibilityBoost: effects.visibilityBoost || 0,
        ignoreNextMiss: effects.ignoreNextMiss || false
    };
    
    // Aplica tempo extra
    if (effects.addTime) {
        gameState.timeLeft += effects.addTime;
        updateUI();
    }
}

/**
 * Callback quando power-up é ativado
 */
function handlePowerUpActivate(type, config, effects) {
    console.log(`Power-up ativado: ${config.name}`, effects);
    playSound('hit');
    
    // Tracking de conquistas: uso de power-up
    registerPowerUpUsed();
}

/**
 * Callback quando power-up expira
 */
function handlePowerUpExpire(type, config) {
    console.log(`Power-up expirado: ${config.name}`);
}

/**
 * Callback quando power-up é coletado
 */
function handlePowerUpCollect(type, config) {
    console.log(`Power-up coletado: ${config.name}`);
}

/**
 * Destrói todos os alvos visíveis (efeito de Explosão Prismática)
 */
function destroyAllTargets() {
    const visibleTargets = gameState.activeTargets.filter(t => 
        t.parentNode && t.style.display !== 'none' && !t.classList.contains('power-up')
    );
    
    visibleTargets.forEach(target => {
        // BUG FIX: Verifica se é alvo falso antes de dar pontos
        if (target.dataset.isFake === 'true') {
            // Alvo falso não dá pontos, apenas remove
            clearTargetMovement(target);
            if (target.dataset.timeoutId) {
                clearTimeout(parseInt(target.dataset.timeoutId));
            }
            target.style.animation = 'targetDestroy 0.3s ease-out forwards';
            setTimeout(() => {
                target.style.display = 'none';
            }, 300);
            return; // Não processa alvo falso
        }
        
        // Limpa movimento
        clearTargetMovement(target);
        
        // Cancela timeout
        if (target.dataset.timeoutId) {
            clearTimeout(parseInt(target.dataset.timeoutId));
        }
        
        // Efeito visual
        target.style.animation = 'targetDestroy 0.3s ease-out forwards';
        setTimeout(() => {
            target.style.display = 'none';
        }, 300);
        
        // BUG FIX: Registra hit no combo para cada alvo destruído
        const comboMultiplier = registerHit();
        const totalMultiplier = comboMultiplier * gameState.powerUpEffects.scoreMultiplier;
        
        // Adiciona pontos
        const points = Math.floor(1 * totalMultiplier);
        gameState.score += points;
        // Usa sistema de feedback visual avançado
        showFloatingPoints(elements.gameArea, target, points, totalMultiplier);
        createParticles(elements.gameArea, target, '#00f0ff', 6);
        createRippleEffect(elements.gameArea, target, '#00f0ff');
    });
    
    updateUI();
    playSound('hit');
}

/**
 * ============================================
 * SISTEMA DE UPGRADES - UI E CALLBACKS
 * ============================================
 */

/**
 * Cria a UI visual do sistema de upgrades
 */
function createUpgradeUI() {
    const gameArea = elements.gameArea;
    if (!gameArea) return;
    
    // Display de energia (canto superior esquerdo)
    const energyContainer = document.createElement('div');
    energyContainer.id = 'energy-container';
    energyContainer.style.cssText = `
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 50;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        pointer-events: none;
    `;
    
    const energyDisplay = document.createElement('div');
    energyDisplay.id = 'energy-display';
    energyDisplay.style.cssText = `
        font-size: clamp(1rem, 3vw, 1.5rem);
        font-weight: 700;
        color: var(--accent-cyan, #00f0ff);
        text-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
    `;
    energyDisplay.textContent = `⚡ ${getTotalEnergy()}`;
    
    energyContainer.appendChild(energyDisplay);
    gameArea.appendChild(energyContainer);
    
    elements.energyDisplay = energyDisplay;
    
    // Botão para abrir loja (na tela de início)
    const shopBtn = document.createElement('button');
    shopBtn.id = 'shop-btn';
    shopBtn.className = 'btn-secondary';
    shopBtn.innerHTML = '<span class="btn-text">⚡ Loja de Upgrades</span>';
    shopBtn.style.cssText = `
        margin-top: 1rem;
        min-height: 44px;
        touch-action: manipulation;
    `;
    shopBtn.addEventListener('click', showUpgradeShop);
    
    // Adiciona botão na tela de início
    if (elements.startScreen) {
        const screenContent = elements.startScreen.querySelector('.screen-content');
        if (screenContent) {
            screenContent.appendChild(shopBtn);
        }
    }
    
    elements.upgradeShop = null; // Será criado dinamicamente
}

/**
 * Atualiza o display de energia
 */
function updateEnergyDisplay() {
    if (elements.energyDisplay) {
        elements.energyDisplay.textContent = `⚡ ${getTotalEnergy()}`;
    }
}

/**
 * Callback quando upgrade é comprado
 */
function handleUpgradePurchased(upgradeType, config) {
    console.log(`Upgrade comprado: ${config.name}`);
    playSound('hit');
    updateEnergyDisplay();
    
    // Mostra notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 31, 46, 0.95);
        border: 2px solid ${config.color || '#00f0ff'};
        border-radius: 12px;
        padding: 2rem;
        z-index: 300;
        text-align: center;
        box-shadow: 0 0 30px ${config.color || '#00f0ff'}80;
        animation: slideUp 0.4s ease-out;
    `;
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">${config.icon}</div>
        <h3 style="font-size: 1.5rem; font-weight: 700; color: ${config.color || '#00f0ff'}; margin-bottom: 0.5rem;">
            ${config.name} Comprado!
        </h3>
        <p style="color: #a0a0a0;">${config.description}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * Callback quando energia é ganha
 */
function handleEnergyEarned(totalEnergy, amount) {
    console.log(`Energia ganha: +${amount} (Total: ${totalEnergy})`);
    updateEnergyDisplay();
}

/**
 * Callback quando skin é comprada
 */
function handleSkinPurchased(skinType, config) {
    console.log(`Skin comprada: ${config.name}`);
    playSound('hit');
    updateEnergyDisplay();
    
    // Tracking de conquistas: compra de skin
    registerSkinPurchased();
    
    // Mostra notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 31, 46, 0.95);
        border: 2px solid ${config.visual.outerColor || '#00f0ff'};
        border-radius: 12px;
        padding: 2rem;
        z-index: 300;
        text-align: center;
        box-shadow: 0 0 30px ${config.visual.outerColor || '#00f0ff'}80;
        animation: slideUp 0.4s ease-out;
    `;
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">${config.icon}</div>
        <h3 style="font-size: 1.5rem; font-weight: 700; color: ${config.visual.outerColor || '#00f0ff'}; margin-bottom: 0.5rem;">
            ${config.name} Comprada!
        </h3>
        <p style="color: #a0a0a0;">${config.description}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/**
 * Callback quando conquista é desbloqueada
 */
function handleAchievementUnlocked(achievementId, config) {
    console.log(`🏆 Conquista desbloqueada: ${config.name}`);
    playSound('hit');
    
    // Adiciona recompensa de 5 moedas por conquista desbloqueada
    addEnergy(5);
    updateEnergyDisplay();
    
    // Mostra notificação de conquista
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 31, 46, 0.95);
        border: 3px solid ${getRarityColor(config.rarity)};
        border-radius: 16px;
        padding: 2.5rem;
        z-index: 400;
        text-align: center;
        box-shadow: 0 0 40px ${getRarityColor(config.rarity)}80, inset 0 0 20px ${getRarityColor(config.rarity)}20;
        animation: achievementUnlock 0.6s ease-out;
        min-width: 300px;
        max-width: 90%;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem; animation: achievementIcon 0.8s ease-out;">${config.icon}</div>
        <div style="font-size: 0.9rem; color: ${getRarityColor(config.rarity)}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem;">
            CONQUISTA DESBLOQUEADA
        </div>
        <h3 style="font-size: 1.8rem; font-weight: 900; color: ${getRarityColor(config.rarity)}; margin-bottom: 0.5rem; text-shadow: 0 0 20px ${getRarityColor(config.rarity)};">
            ${config.name}
        </h3>
        <p style="color: #a0a0a0; font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">
            ${config.description}
        </p>
        <div style="font-size: 1.2rem; font-weight: 700; color: #ffd700; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 215, 0, 0.3);">
            +5 ⚡ Moedas
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove após animação
    setTimeout(() => {
        notification.style.animation = 'achievementFadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/**
 * Retorna cor baseada na raridade
 */
function getRarityColor(rarity) {
    const colors = {
        'comum': '#a0a0a0',
        'rara': '#00f0ff',
        'epica': '#b347ff',
        'lendaria': '#ffd700'
    };
    return colors[rarity] || colors.comum;
}

/**
 * Callback quando progresso de conquista é atualizado
 */
function handleAchievementProgress(achievementId, progress) {
    // Pode ser usado para atualizar UI de progresso em tempo real
    // Por enquanto, apenas log
    if (progress.percentage > 50 && progress.percentage < 100) {
        console.log(`Conquista ${achievementId}: ${progress.percentage}%`);
    }
}

/**
 * Callback quando skin é selecionada
 */
function handleSkinSelected(skinType, config) {
    console.log(`Skin selecionada: ${skinType ? config.name : 'Padrão'}`);
    playSound('hit');
    
    // Aplica a skin a todos os alvos ativos
    if (gameState.activeTargets && gameState.activeTargets.length > 0) {
        gameState.activeTargets.forEach(target => {
            if (target && target.parentNode) {
                // Usa requestAnimationFrame para garantir que o SVG está renderizado
                requestAnimationFrame(() => {
                    applySkinToTarget(target, skinType);
                });
            }
        });
    }
    
    // Também aplica ao alvo principal se existir
    if (elements.target && elements.target.parentNode) {
        requestAnimationFrame(() => {
            applySkinToTarget(elements.target, skinType);
        });
    }
}

/**
 * Mostra a loja de upgrades
 */
function showUpgradeShop() {
    // Cria overlay da loja
    const overlay = document.createElement('div');
    overlay.id = 'upgrade-shop-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 14, 26, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        animation: fadeIn 0.3s ease-in;
        overflow-y: auto;
        padding: 2rem;
    `;
    
    const shopContainer = document.createElement('div');
    shopContainer.style.cssText = `
        background: rgba(26, 31, 46, 0.9);
        border: 2px solid rgba(0, 240, 255, 0.5);
        border-radius: 12px;
        padding: 2rem;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
        animation: slideUp 0.4s ease-out;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '⚡ Loja';
    title.style.cssText = `
        font-size: 2rem;
        font-weight: 900;
        background: linear-gradient(135deg, #00f0ff, #ff00f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
        text-align: center;
    `;
    
    const energyInfo = document.createElement('div');
    energyInfo.style.cssText = `
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: #00f0ff;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(0, 240, 255, 0.1);
        border-radius: 8px;
    `;
    // Função para atualizar info de energia
    function updateEnergyInfo() {
        energyInfo.textContent = `Energia Disponível: ⚡ ${getTotalEnergy()}`;
    }
    updateEnergyInfo();
    
    // Tabs para Upgrades e Skins
    const tabsContainer = document.createElement('div');
    tabsContainer.style.cssText = `
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid rgba(0, 240, 255, 0.3);
    `;
    
    const upgradesTab = document.createElement('button');
    upgradesTab.textContent = 'Upgrades';
    upgradesTab.className = 'shop-tab active';
    upgradesTab.style.cssText = `
        flex: 1;
        padding: 0.75rem;
        background: rgba(0, 240, 255, 0.2);
        border: none;
        border-bottom: 3px solid #00f0ff;
        color: #00f0ff;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const skinsTab = document.createElement('button');
    skinsTab.textContent = 'Skins';
    skinsTab.className = 'shop-tab';
    skinsTab.style.cssText = `
        flex: 1;
        padding: 0.75rem;
        background: transparent;
        border: none;
        border-bottom: 3px solid transparent;
        color: #a0a0a0;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const contentContainer = document.createElement('div');
    contentContainer.id = 'shop-content';
    
    const upgradesList = document.createElement('div');
    upgradesList.id = 'upgrades-list';
    upgradesList.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    `;
    
    // Adiciona cada upgrade
    const allUpgrades = getAllUpgrades();
    Object.keys(allUpgrades).forEach(upgradeType => {
        const config = allUpgrades[upgradeType];
        const isPurchased = hasUpgrade(upgradeType);
        const canAfford = getTotalEnergy() >= config.cost;
        
        const upgradeCard = document.createElement('div');
        upgradeCard.style.cssText = `
            background: ${isPurchased ? 'rgba(0, 255, 0, 0.1)' : 'rgba(26, 31, 46, 0.8)'};
            border: 2px solid ${isPurchased ? '#00ff00' : canAfford ? '#00f0ff' : '#666'};
            border-radius: 8px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            opacity: ${isPurchased ? 0.7 : 1};
        `;
        
        upgradeCard.innerHTML = `
            <div style="font-size: 3rem; text-align: center;">${config.icon}</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: ${config.color || '#00f0ff'}; text-align: center;">
                ${config.name}
            </h3>
            <p style="color: #a0a0a0; text-align: center; font-size: 0.9rem;">
                ${config.description}
            </p>
            <div style="text-align: center; font-size: 1.1rem; font-weight: 700; color: #ffd700;">
                Custo: ⚡ ${config.cost}
            </div>
        `;
        
        if (!isPurchased) {
            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn-primary';
            buyBtn.textContent = canAfford ? 'Comprar' : 'Energia Insuficiente';
            buyBtn.disabled = !canAfford;
            buyBtn.style.cssText = `
                padding: 0.75rem;
                font-family: 'Montserrat', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                border: none;
                border-radius: 8px;
                cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                background: ${canAfford ? 'linear-gradient(135deg, #00f0ff, #ff00f0)' : '#666'};
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                transition: all 0.3s ease;
                min-height: 44px;
                touch-action: manipulation;
            `;
            
            buyBtn.addEventListener('click', () => {
                if (purchaseUpgrade(upgradeType)) {
                    // Atualiza a loja
                    overlay.remove();
                    showUpgradeShop();
                }
            });
            
            upgradeCard.appendChild(buyBtn);
        } else {
            const ownedBadge = document.createElement('div');
            ownedBadge.style.cssText = `
                text-align: center;
                padding: 0.5rem;
                background: rgba(0, 255, 0, 0.2);
                border-radius: 8px;
                color: #00ff00;
                font-weight: 700;
            `;
            ownedBadge.textContent = '✓ Comprado';
            upgradeCard.appendChild(ownedBadge);
        }
        
        upgradesList.appendChild(upgradeCard);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-secondary';
    closeBtn.textContent = 'Fechar';
    closeBtn.style.cssText = `
        width: 100%;
        padding: 0.75rem;
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.3s ease;
        min-height: 44px;
        touch-action: manipulation;
    `;
    closeBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Função para criar lista de skins
    function createSkinsList() {
        const skinsList = document.createElement('div');
        skinsList.id = 'skins-list';
        skinsList.style.cssText = `
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        `;
        
        const allSkins = getAllSkins();
        const selectedSkin = getSelectedSkin();
        
        // Organiza por categoria
        const categories = ['Simples', 'Intermediária', 'Rara', 'Lendária'];
        const categoryColors = {
            'Simples': '#a0a0a0',
            'Intermediária': '#00f0ff',
            'Rara': '#b347ff',
            'Lendária': '#ffd700'
        };
        
        categories.forEach(category => {
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = category;
            categoryHeader.style.cssText = `
                grid-column: 1 / -1;
                font-size: 1.3rem;
                font-weight: 700;
                color: ${categoryColors[category]};
                margin: 1rem 0 0.5rem 0;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            `;
            skinsList.appendChild(categoryHeader);
            
            Object.keys(allSkins).forEach(skinType => {
                const config = allSkins[skinType];
                if (config.category !== category) return;
                
                const isPurchased = hasSkin(skinType);
                const isSelected = selectedSkin === skinType;
                const canAfford = getTotalEnergy() >= config.price;
                
                const skinCard = document.createElement('div');
                skinCard.style.cssText = `
                    background: ${isSelected ? 'rgba(0, 240, 255, 0.2)' : isPurchased ? 'rgba(0, 255, 0, 0.1)' : 'rgba(26, 31, 46, 0.8)'};
                    border: 2px solid ${isSelected ? '#00f0ff' : isPurchased ? '#00ff00' : canAfford ? categoryColors[category] : '#666'};
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    opacity: ${isPurchased || isSelected ? 1 : 0.8};
                    position: relative;
                `;
                
                // Pré-visualização da skin
                const preview = document.createElement('div');
                preview.style.cssText = `
                    width: 100%;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(10, 14, 26, 0.5);
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                `;
                
                const previewSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                previewSvg.setAttribute('viewBox', '0 0 100 100');
                previewSvg.setAttribute('width', '80');
                previewSvg.setAttribute('height', '80');
                previewSvg.style.cssText = 'pointer-events: none;';
                
                const previewOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                previewOuter.setAttribute('cx', '50');
                previewOuter.setAttribute('cy', '50');
                previewOuter.setAttribute('r', '45');
                previewOuter.setAttribute('fill', 'none');
                previewOuter.setAttribute('stroke', config.visual.outerColor || '#00f0ff');
                previewOuter.setAttribute('stroke-width', '2');
                
                const previewCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                previewCore.setAttribute('cx', '50');
                previewCore.setAttribute('cy', '50');
                previewCore.setAttribute('r', '15');
                previewCore.setAttribute('fill', config.visual.coreColor || '#00f0ff');
                
                if (config.visual.coreShape === 'emoji' && config.visual.emoji) {
                    previewCore.style.display = 'none';
                    const previewEmoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    previewEmoji.setAttribute('x', '50');
                    previewEmoji.setAttribute('y', '50');
                    previewEmoji.setAttribute('text-anchor', 'middle');
                    previewEmoji.setAttribute('dominant-baseline', 'middle');
                    previewEmoji.setAttribute('font-size', '30');
                    previewEmoji.textContent = config.visual.emoji;
                    previewSvg.appendChild(previewEmoji);
                }
                
                previewSvg.appendChild(previewOuter);
                previewSvg.appendChild(previewCore);
                preview.appendChild(previewSvg);
                
                skinCard.innerHTML = `
                    ${preview.outerHTML}
                    <h4 style="font-size: 1rem; font-weight: 700; color: ${categoryColors[category]}; text-align: center; margin: 0;">
                        ${config.name}
                    </h4>
                    <p style="color: #a0a0a0; text-align: center; font-size: 0.8rem; margin: 0;">
                        ${config.description}
                    </p>
                    <div style="text-align: center; font-size: 0.9rem; font-weight: 700; color: #ffd700;">
                        ⚡ ${config.price}
                    </div>
                `;
                
                // Botões de ação
                const actionsContainer = document.createElement('div');
                actionsContainer.style.cssText = 'display: flex; gap: 0.5rem; flex-direction: column;';
                
                if (!isPurchased) {
                    const buyBtn = document.createElement('button');
                    buyBtn.className = 'btn-primary';
                    buyBtn.textContent = canAfford ? 'Comprar' : 'Energia Insuficiente';
                    buyBtn.disabled = !canAfford;
                    buyBtn.style.cssText = `
                        padding: 0.5rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                        border: none;
                        border-radius: 6px;
                        cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                        background: ${canAfford ? categoryColors[category] : '#666'};
                        color: #ffffff;
                        transition: all 0.3s ease;
                        min-height: 36px;
                    `;
                    
                    buyBtn.addEventListener('click', () => {
                        if (purchaseSkin(skinType, (price) => {
                            // Desconta moedas usando removeEnergy
                            return removeEnergy(price);
                        })) {
                            // Atualiza energia display
                            updateEnergyDisplay();
                            // Atualiza a loja
                            overlay.remove();
                            showUpgradeShop();
                        }
                    });
                    
                    actionsContainer.appendChild(buyBtn);
                } else {
                    if (isSelected) {
                        const selectedBadge = document.createElement('div');
                        selectedBadge.style.cssText = `
                            padding: 0.5rem;
                            background: rgba(0, 240, 255, 0.2);
                            border-radius: 6px;
                            color: #00f0ff;
                            font-weight: 700;
                            text-align: center;
                            font-size: 0.9rem;
                        `;
                        selectedBadge.textContent = '✓ Selecionada';
                        actionsContainer.appendChild(selectedBadge);
                    } else {
                        const selectBtn = document.createElement('button');
                        selectBtn.className = 'btn-secondary';
                        selectBtn.textContent = 'Selecionar';
                        selectBtn.style.cssText = `
                            padding: 0.5rem;
                            font-size: 0.9rem;
                            font-weight: 600;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            background: rgba(0, 240, 255, 0.2);
                            color: #00f0ff;
                            transition: all 0.3s ease;
                            min-height: 36px;
                        `;
                        
                        selectBtn.addEventListener('click', () => {
                            selectSkin(skinType);
                            // Atualiza energia display caso tenha mudado
                            updateEnergyDisplay();
                            overlay.remove();
                            showUpgradeShop();
                        });
                        
                        actionsContainer.appendChild(selectBtn);
                    }
                }
                
                skinCard.appendChild(actionsContainer);
                skinsList.appendChild(skinCard);
            });
        });
        
        return skinsList;
    }
    
    // Cria lista de skins
    const skinsList = createSkinsList();
    
    // Adiciona eventos de tabs
    upgradesTab.addEventListener('click', () => {
        upgradesTab.classList.add('active');
        upgradesTab.style.background = 'rgba(0, 240, 255, 0.2)';
        upgradesTab.style.borderBottomColor = '#00f0ff';
        upgradesTab.style.color = '#00f0ff';
        
        skinsTab.classList.remove('active');
        skinsTab.style.background = 'transparent';
        skinsTab.style.borderBottomColor = 'transparent';
        skinsTab.style.color = '#a0a0a0';
        
        upgradesList.style.display = 'grid';
        skinsList.style.display = 'none';
    });
    
    skinsTab.addEventListener('click', () => {
        skinsTab.classList.add('active');
        skinsTab.style.background = 'rgba(0, 240, 255, 0.2)';
        skinsTab.style.borderBottomColor = '#00f0ff';
        skinsTab.style.color = '#00f0ff';
        
        upgradesTab.classList.remove('active');
        upgradesTab.style.background = 'transparent';
        upgradesTab.style.borderBottomColor = 'transparent';
        upgradesTab.style.color = '#a0a0a0';
        
        upgradesList.style.display = 'none';
        skinsList.style.display = 'grid';
    });
    
    contentContainer.appendChild(upgradesList);
    contentContainer.appendChild(skinsList);
    
    shopContainer.appendChild(title);
    shopContainer.appendChild(energyInfo);
    shopContainer.appendChild(tabsContainer);
    tabsContainer.appendChild(upgradesTab);
    tabsContainer.appendChild(skinsTab);
    shopContainer.appendChild(contentContainer);
    shopContainer.appendChild(closeBtn);
    overlay.appendChild(shopContainer);
    
    document.body.appendChild(overlay);
    elements.upgradeShop = overlay;
}

// Inicializa quando DOM estiver pronto
function initializeGame() {
    try {
        // Resolve elementos pendentes que podem ter sido buscados antes do DOM estar pronto
        resolveMissingElements();
        // Elementos que são criados dinamicamente (não precisam existir no HTML)
        const dynamicElements = ['comboDisplay', 'multiplierDisplay', 'powerUpContainer', 'powerUpSpawnElement', 'energyDisplay', 'upgradeShop'];
        
        // Verifica se todos os elementos foram encontrados (exceto os dinâmicos)
        const missingElements = Object.entries(elements)
            .filter(([key, value]) => !value && !dynamicElements.includes(key))
            .map(([key]) => key);
        
        if (missingElements.length > 0) {
            console.error('Elementos DOM não encontrados:', missingElements);
            alert('Erro: Alguns elementos não foram encontrados. Verifique o console.');
            return;
        }
        
        init();
        console.log('Jogo inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar jogo:', error);
        alert('Erro ao inicializar o jogo. Verifique o console para mais detalhes.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}


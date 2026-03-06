/**
 * Sistema de Power-Ups Temporários - Nexus Prism
 * Gerencia power-ups que aparecem aleatoriamente durante o jogo
 */

/**
 * Tipos de power-ups disponíveis
 */
export const POWER_UP_TYPES = {
    FRENESI_TEMPORAL: 'frenesi_temporal',
    MULTIPLICADOR_DOURADO: 'multiplicador_dourado',
    CONGELAMENTO: 'congelamento',
    EXPLOSAO_PRISMATICA: 'explosao_prismatica',
    ESCUDO_ENERGIA: 'escudo_energia',
    TEMPO_EXTRA: 'tempo_extra',
    VISAO_PRISMATICA: 'visao_prismatica'
};

/**
 * Configurações de cada power-up
 */
const POWER_UP_CONFIGS = {
    [POWER_UP_TYPES.FRENESI_TEMPORAL]: {
        name: 'Frenesi Temporal',
        icon: '⚡',
        color: '#ffd700',
        duration: 10000, // 10 segundos
        description: 'Alvos aparecem 2x mais rápido',
        effect: (gameState) => {
            // Reduz delay de respawn pela metade
            return {
                respawnDelayMultiplier: 0.5
            };
        }
    },
    [POWER_UP_TYPES.MULTIPLICADOR_DOURADO]: {
        name: 'Multiplicador Dourado',
        icon: '✨',
        color: '#ffd700',
        duration: 15000, // 15 segundos
        description: '3x pontos por 15s',
        effect: (gameState) => {
            return {
                scoreMultiplier: 3.0
            };
        }
    },
    [POWER_UP_TYPES.CONGELAMENTO]: {
        name: 'Congelamento',
        icon: '❄️',
        color: '#00f0ff',
        duration: 8000, // 8 segundos
        description: 'Alvos ficam 2x maiores',
        effect: (gameState) => {
            return {
                targetSizeMultiplier: 2.0
            };
        }
    },
    [POWER_UP_TYPES.EXPLOSAO_PRISMATICA]: {
        name: 'Explosão Prismática',
        icon: '💥',
        color: '#ff00f0',
        duration: 0, // Efeito instantâneo
        description: 'Clicar em 1 alvo destrói todos',
        effect: (gameState) => {
            return {
                destroyAllTargets: true
            };
        }
    },
    [POWER_UP_TYPES.ESCUDO_ENERGIA]: {
        name: 'Escudo de Energia',
        icon: '🛡️',
        color: '#00f0ff',
        duration: 0, // Efeito passivo (1 uso)
        description: 'Ignora 1 erro sem perder combo',
        effect: (gameState) => {
            return {
                ignoreNextMiss: true
            };
        }
    },
    [POWER_UP_TYPES.TEMPO_EXTRA]: {
        name: 'Tempo Extra',
        icon: '⏰',
        color: '#00ff00',
        duration: 0, // Efeito instantâneo
        description: '+10 segundos no timer',
        effect: (gameState) => {
            return {
                addTime: 10
            };
        }
    },
    [POWER_UP_TYPES.VISAO_PRISMATICA]: {
        name: 'Visão Prismática',
        icon: '👁️',
        color: '#ff00f0',
        duration: 12000, // 12 segundos
        description: 'Alvos camuflados ficam mais visíveis',
        effect: (gameState) => {
            return {
                visibilityBoost: 0.5 // Aumenta opacidade em 50%
            };
        }
    }
};

/**
 * Estado do sistema de power-ups
 */
let powerUpState = {
    activePowerUps: [], // Array de power-ups ativos {type, endTime, config}
    powerUpSpawnTimer: null,
    spawnInterval: 30000, // 30 segundos base
    minSpawnInterval: 20000, // Mínimo 20 segundos
    maxSpawnInterval: 60000, // Máximo 60 segundos
    powerUpElement: null, // Elemento visual do power-up na tela
    isSpawning: false
};

/**
 * Callbacks para eventos de power-up
 */
let callbacks = {
    onPowerUpSpawn: null,
    onPowerUpActivate: null,
    onPowerUpExpire: null,
    onPowerUpCollect: null
};

/**
 * Inicializa o sistema de power-ups
 */
export function initPowerUpSystem(config = {}) {
    resetPowerUpSystem();
    
    if (config.onPowerUpSpawn) callbacks.onPowerUpSpawn = config.onPowerUpSpawn;
    if (config.onPowerUpActivate) callbacks.onPowerUpActivate = config.onPowerUpActivate;
    if (config.onPowerUpExpire) callbacks.onPowerUpExpire = config.onPowerUpExpire;
    if (config.onPowerUpCollect) callbacks.onPowerUpCollect = config.onPowerUpCollect;
    
    if (config.spawnInterval) powerUpState.spawnInterval = config.spawnInterval;
    if (config.minSpawnInterval) powerUpState.minSpawnInterval = config.minSpawnInterval;
    if (config.maxSpawnInterval) powerUpState.maxSpawnInterval = config.maxSpawnInterval;
}

/**
 * Inicia o sistema de spawn de power-ups
 */
export function startPowerUpSpawning() {
    if (powerUpState.powerUpSpawnTimer) {
        clearTimeout(powerUpState.powerUpSpawnTimer);
    }
    
    // Spawna primeiro power-up após delay inicial
    const initialDelay = powerUpState.spawnInterval;
    powerUpState.powerUpSpawnTimer = setTimeout(() => {
        spawnRandomPowerUp();
        scheduleNextPowerUp();
    }, initialDelay);
}

/**
 * Para o sistema de spawn de power-ups
 */
export function stopPowerUpSpawning() {
    if (powerUpState.powerUpSpawnTimer) {
        clearTimeout(powerUpState.powerUpSpawnTimer);
        powerUpState.powerUpSpawnTimer = null;
    }
    
    // Remove power-up visual se existir
    if (powerUpState.powerUpElement && powerUpState.powerUpElement.parentNode) {
        powerUpState.powerUpElement.remove();
        powerUpState.powerUpElement = null;
    }
}

/**
 * Agenda próximo spawn de power-up
 */
function scheduleNextPowerUp() {
    if (powerUpState.powerUpSpawnTimer) {
        clearTimeout(powerUpState.powerUpSpawnTimer);
    }
    
    // Intervalo aleatório entre min e max
    const interval = powerUpState.minSpawnInterval + 
                     Math.random() * (powerUpState.maxSpawnInterval - powerUpState.minSpawnInterval);
    
    powerUpState.powerUpSpawnTimer = setTimeout(() => {
        if (!powerUpState.isSpawning) {
            spawnRandomPowerUp();
        }
        scheduleNextPowerUp();
    }, interval);
}

/**
 * Spawna um power-up aleatório na tela
 */
export function spawnRandomPowerUp() {
    if (powerUpState.isSpawning) return null; // Evita múltiplos spawns simultâneos
    
    // Escolhe tipo aleatório
    const types = Object.values(POWER_UP_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const config = POWER_UP_CONFIGS[randomType];
    if (!config) return null;
    
    powerUpState.isSpawning = true;
    
    // Chama callback para criar elemento visual
    if (callbacks.onPowerUpSpawn) {
        callbacks.onPowerUpSpawn(randomType, config);
    }
    
    // Retorna informações para criar elemento visual
    return {
        type: randomType,
        config: config
    };
}

/**
 * Ativa um power-up coletado
 * @param {string} type - Tipo do power-up
 * @param {Object} gameState - Estado atual do jogo
 * @returns {Object} Efeitos aplicados
 */
export function activatePowerUp(type, gameState) {
    const config = POWER_UP_CONFIGS[type];
    if (!config) return null;
    
    const now = Date.now();
    const effects = config.effect(gameState);
    
    // Power-ups instantâneos
    if (config.duration === 0) {
        if (callbacks.onPowerUpActivate) {
            callbacks.onPowerUpActivate(type, config, effects);
        }
        return effects;
    }
    
    // Power-ups com duração
    const powerUp = {
        type: type,
        config: config,
        startTime: now,
        endTime: now + config.duration,
        effects: effects
    };
    
    powerUpState.activePowerUps.push(powerUp);
    
    if (callbacks.onPowerUpActivate) {
        callbacks.onPowerUpActivate(type, config, effects);
    }
    
    return effects;
}

/**
 * Atualiza power-ups ativos (remove os expirados)
 * @returns {Object} Efeitos combinados de todos os power-ups ativos
 */
export function updateActivePowerUps() {
    const now = Date.now();
    const activeEffects = {
        respawnDelayMultiplier: 1.0,
        scoreMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
        visibilityBoost: 0,
        ignoreNextMiss: false,
        destroyAllTargets: false,
        addTime: 0
    };
    
    // Remove power-ups expirados
    powerUpState.activePowerUps = powerUpState.activePowerUps.filter(powerUp => {
        if (powerUp.endTime <= now) {
            // Power-up expirou
            if (callbacks.onPowerUpExpire) {
                callbacks.onPowerUpExpire(powerUp.type, powerUp.config);
            }
            return false;
        }
        
        // Combina efeitos
        if (powerUp.effects.respawnDelayMultiplier) {
            activeEffects.respawnDelayMultiplier *= powerUp.effects.respawnDelayMultiplier;
        }
        if (powerUp.effects.scoreMultiplier) {
            activeEffects.scoreMultiplier *= powerUp.effects.scoreMultiplier;
        }
        if (powerUp.effects.targetSizeMultiplier) {
            activeEffects.targetSizeMultiplier *= powerUp.effects.targetSizeMultiplier;
        }
        if (powerUp.effects.visibilityBoost) {
            activeEffects.visibilityBoost += powerUp.effects.visibilityBoost;
        }
        if (powerUp.effects.ignoreNextMiss) {
            activeEffects.ignoreNextMiss = true;
        }
        if (powerUp.effects.destroyAllTargets) {
            activeEffects.destroyAllTargets = true;
        }
        if (powerUp.effects.addTime) {
            activeEffects.addTime += powerUp.effects.addTime;
        }
        
        return true;
    });
    
    return activeEffects;
}

/**
 * Retorna lista de power-ups ativos
 * @returns {Array} Array de power-ups ativos
 */
export function getActivePowerUps() {
    return powerUpState.activePowerUps.map(pu => ({
        type: pu.type,
        config: pu.config,
        timeRemaining: Math.max(0, pu.endTime - Date.now())
    }));
}

/**
 * Retorna configuração de um power-up
 * @param {string} type - Tipo do power-up
 * @returns {Object} Configuração do power-up
 */
export function getPowerUpConfig(type) {
    return POWER_UP_CONFIGS[type] || null;
}

/**
 * Retorna todos os tipos de power-ups
 * @returns {Array} Array de tipos
 */
export function getAllPowerUpTypes() {
    return Object.values(POWER_UP_TYPES);
}

/**
 * Reseta o sistema de power-ups
 */
export function resetPowerUpSystem() {
    stopPowerUpSpawning();
    powerUpState.activePowerUps = [];
    powerUpState.isSpawning = false;
}

/**
 * Define callbacks do sistema
 * @param {Object} newCallbacks - Objeto com callbacks
 */
export function setCallbacks(newCallbacks) {
    callbacks = { ...callbacks, ...newCallbacks };
}

/**
 * Limpa todos os callbacks
 */
export function clearCallbacks() {
    callbacks = {
        onPowerUpSpawn: null,
        onPowerUpActivate: null,
        onPowerUpExpire: null,
        onPowerUpCollect: null
    };
}

/**
 * Marca que um power-up foi coletado (remove elemento visual)
 */
export function markPowerUpCollected() {
    powerUpState.isSpawning = false;
    if (powerUpState.powerUpElement && powerUpState.powerUpElement.parentNode) {
        powerUpState.powerUpElement.remove();
        powerUpState.powerUpElement = null;
    }
}


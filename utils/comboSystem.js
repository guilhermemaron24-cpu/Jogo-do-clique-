/**
 * Sistema de Combos e Multiplicadores - Nexus Prism
 * Gerencia combos, multiplicadores e streaks para engajamento viral
 */

/**
 * Configuração de multiplicadores por combo
 */
const COMBO_MULTIPLIERS = {
    0: 1.0,   // Sem combo
    5: 1.5,   // 5 cliques = 1.5x
    10: 2.0,  // 10 cliques = 2.0x
    15: 2.5,  // 15 cliques = 2.5x
    20: 3.0,  // 20 cliques = 3.0x
    30: 4.0,  // 30 cliques = 4.0x
    50: 5.0,  // 50 cliques = 5.0x
    75: 6.0,  // 75 cliques = 6.0x
    100: 7.5  // 100 cliques = 7.5x
};

/**
 * Milestones de combo que dão bônus especiais
 * Alinhado com os multiplicadores disponíveis
 */
const COMBO_MILESTONES = [5, 10, 15, 20, 30, 50, 75, 100];

/**
 * Estado do sistema de combos
 */
let comboState = {
    currentCombo: 0,
    maxCombo: 0,
    currentMultiplier: 1.0,
    streakCount: 0,
    lastHitTime: 0,
    comboTimeout: null,
    comboDecayTime: 5000 // 5 segundos para perder combo
};

/**
 * Callbacks para eventos de combo
 */
let callbacks = {
    onComboUpdate: null,
    onComboMilestone: null,
    onComboLost: null,
    onMultiplierChange: null
};

/**
 * Inicializa o sistema de combos
 */
export function initComboSystem(config = {}) {
    resetCombo();
    
    if (config.onComboUpdate) callbacks.onComboUpdate = config.onComboUpdate;
    if (config.onComboMilestone) callbacks.onComboMilestone = config.onComboMilestone;
    if (config.onComboLost) callbacks.onComboLost = config.onComboLost;
    if (config.onMultiplierChange) callbacks.onMultiplierChange = config.onMultiplierChange;
    
    if (config.comboDecayTime) comboState.comboDecayTime = config.comboDecayTime;
}

/**
 * Registra um hit (clique bem-sucedido)
 * @returns {number} Multiplicador atual
 */
export function registerHit() {
    const now = Date.now();
    
    // Se passou muito tempo desde o último hit, reseta o combo
    if (now - comboState.lastHitTime > comboState.comboDecayTime && comboState.currentCombo > 0) {
        loseCombo();
    }
    
    // Incrementa combo
    comboState.currentCombo++;
    comboState.streakCount++;
    comboState.lastHitTime = now;
    
    // Atualiza máximo combo
    if (comboState.currentCombo > comboState.maxCombo) {
        comboState.maxCombo = comboState.currentCombo;
    }
    
    // Calcula novo multiplicador
    const newMultiplier = calculateMultiplier(comboState.currentCombo);
    
    // Verifica se multiplicador mudou
    if (newMultiplier !== comboState.currentMultiplier) {
        const oldMultiplier = comboState.currentMultiplier;
        comboState.currentMultiplier = newMultiplier;
        
        if (callbacks.onMultiplierChange) {
            callbacks.onMultiplierChange(newMultiplier, oldMultiplier);
        }
    }
    
    // Verifica se atingiu milestone
    if (COMBO_MILESTONES.includes(comboState.currentCombo)) {
        if (callbacks.onComboMilestone) {
            callbacks.onComboMilestone(comboState.currentCombo, comboState.currentMultiplier);
        }
    }
    
    // Atualiza callback
    if (callbacks.onComboUpdate) {
        callbacks.onComboUpdate({
            combo: comboState.currentCombo,
            multiplier: comboState.currentMultiplier,
            streak: comboState.streakCount
        });
    }
    
    // Reseta timeout de decay
    resetComboTimeout();
    
    return comboState.currentMultiplier;
}

/**
 * Registra um miss (erro ou clique fora)
 */
export function registerMiss() {
    loseCombo();
}

/**
 * Perde o combo atual
 */
function loseCombo() {
    if (comboState.currentCombo === 0) return;
    
    const lostCombo = comboState.currentCombo;
    comboState.currentCombo = 0;
    comboState.streakCount = 0;
    comboState.currentMultiplier = 1.0;
    
    if (callbacks.onComboLost) {
        callbacks.onComboLost(lostCombo);
    }
    
    if (callbacks.onComboUpdate) {
        callbacks.onComboUpdate({
            combo: 0,
            multiplier: 1.0,
            streak: 0
        });
    }
    
    clearComboTimeout();
}

/**
 * Calcula multiplicador baseado no combo atual
 * @param {number} combo - Número de combos
 * @returns {number} Multiplicador
 */
function calculateMultiplier(combo) {
    // Encontra o maior threshold que o combo atingiu
    let multiplier = 1.0;
    
    for (const [threshold, mult] of Object.entries(COMBO_MULTIPLIERS)) {
        const thresholdNum = parseInt(threshold);
        if (combo >= thresholdNum && mult > multiplier) {
            multiplier = mult;
        }
    }
    
    return multiplier;
}

/**
 * Reseta o timeout de decay do combo
 */
function resetComboTimeout() {
    clearComboTimeout();
    
    comboState.comboTimeout = setTimeout(() => {
        loseCombo();
    }, comboState.comboDecayTime);
}

/**
 * Limpa o timeout de decay
 */
function clearComboTimeout() {
    if (comboState.comboTimeout) {
        clearTimeout(comboState.comboTimeout);
        comboState.comboTimeout = null;
    }
}

/**
 * Reseta o sistema de combos
 */
export function resetCombo() {
    clearComboTimeout();
    comboState.currentCombo = 0;
    comboState.streakCount = 0;
    comboState.currentMultiplier = 1.0;
    comboState.lastHitTime = 0;
}

/**
 * Retorna o estado atual do combo
 * @returns {Object} Estado do combo
 */
export function getComboState() {
    return {
        combo: comboState.currentCombo,
        maxCombo: comboState.maxCombo,
        multiplier: comboState.currentMultiplier,
        streak: comboState.streakCount
    };
}

/**
 * Retorna o multiplicador atual
 * @returns {number} Multiplicador
 */
export function getCurrentMultiplier() {
    return comboState.currentMultiplier;
}

/**
 * Retorna o combo atual
 * @returns {number} Combo atual
 */
export function getCurrentCombo() {
    return comboState.currentCombo;
}

/**
 * Retorna o máximo combo já atingido
 * @returns {number} Máximo combo
 */
export function getMaxCombo() {
    return comboState.maxCombo;
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
        onComboUpdate: null,
        onComboMilestone: null,
        onComboLost: null,
        onMultiplierChange: null
    };
}


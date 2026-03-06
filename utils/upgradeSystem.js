/**
 * Sistema de Energia e Upgrades - Nexus Prism
 * Gerencia energia acumulada e upgrades permanentes
 */

/**
 * Tipos de upgrades disponíveis
 */
export const UPGRADE_TYPES = {
    PRECISAO_APRIMORADA: 'precisao_aprimorada',
    REFLEXOS_ACELERADOS: 'reflexos_acelerados',
    VISAO_PRISMATICA: 'visao_prismatica',
    MULTIPLICADOR_PERMANENTE: 'multiplicador_permanente',
    POWER_UP_PLUS: 'power_up_plus'
};

/**
 * Configurações de cada upgrade
 */
const UPGRADE_CONFIGS = {
    [UPGRADE_TYPES.PRECISAO_APRIMORADA]: {
        name: 'Precisão Aprimorada',
        icon: '🎯',
        description: 'Alvos ficam 20% maiores',
        cost: 50,
        effect: {
            targetSizeMultiplier: 1.2
        }
    },
    [UPGRADE_TYPES.REFLEXOS_ACELERADOS]: {
        name: 'Reflexos Acelerados',
        icon: '⚡',
        description: '+0.5s no timer base',
        cost: 75,
        effect: {
            timeBonus: 0.5
        }
    },
    [UPGRADE_TYPES.VISAO_PRISMATICA]: {
        name: 'Visão Prismática',
        icon: '👁️',
        description: 'Alvos camuflados ficam mais visíveis',
        cost: 100,
        effect: {
            visibilityBoost: 0.3
        }
    },
    [UPGRADE_TYPES.MULTIPLICADOR_PERMANENTE]: {
        name: 'Multiplicador Permanente',
        icon: '✨',
        description: '+0.5x em todos os pontos',
        cost: 150,
        effect: {
            scoreMultiplier: 0.5
        }
    },
    [UPGRADE_TYPES.POWER_UP_PLUS]: {
        name: 'Power-Up Plus',
        icon: '💎',
        description: 'Power-ups duram 50% mais',
        cost: 200,
        effect: {
            powerUpDurationMultiplier: 1.5
        }
    }
};

/**
 * Chave para localStorage
 */
const STORAGE_KEY = 'nexus_prism_upgrades';
const ENERGY_KEY = 'nexus_prism_energy';

/**
 * Estado do sistema de upgrades
 */
let upgradeState = {
    purchasedUpgrades: new Set(),
    totalEnergy: 0,
    energyEarned: 0
};

/**
 * Callbacks para eventos
 */
let callbacks = {
    onUpgradePurchased: null,
    onEnergyEarned: null
};

/**
 * Inicializa o sistema de upgrades
 * @param {Object} options - Opções de inicialização
 */
export function initUpgradeSystem(options = {}) {
    if (options.onUpgradePurchased) {
        callbacks.onUpgradePurchased = options.onUpgradePurchased;
    }
    if (options.onEnergyEarned) {
        callbacks.onEnergyEarned = options.onEnergyEarned;
    }
    
    // Carrega estado salvo
    loadUpgradeState();
}

/**
 * Carrega estado de upgrades do localStorage
 */
function loadUpgradeState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            upgradeState.purchasedUpgrades = new Set(data.purchasedUpgrades || []);
        }
        
        const savedEnergy = localStorage.getItem(ENERGY_KEY);
        if (savedEnergy) {
            upgradeState.totalEnergy = parseInt(savedEnergy) || 0;
        }
    } catch (e) {
        console.warn('Erro ao carregar upgrades:', e);
    }
}

/**
 * Salva estado de upgrades no localStorage
 */
function saveUpgradeState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            purchasedUpgrades: Array.from(upgradeState.purchasedUpgrades)
        }));
        localStorage.setItem(ENERGY_KEY, upgradeState.totalEnergy.toString());
    } catch (e) {
        console.warn('Erro ao salvar upgrades:', e);
    }
}

/**
 * Adiciona energia ao jogador
 * @param {number} amount - Quantidade de energia
 */
export function addEnergy(amount) {
    upgradeState.totalEnergy += amount;
    upgradeState.energyEarned += amount;
    saveUpgradeState();
    
    if (callbacks.onEnergyEarned) {
        callbacks.onEnergyEarned(upgradeState.totalEnergy, amount);
    }
}

/**
 * Remove energia do jogador (para compras)
 * @param {number} amount - Quantidade de energia a remover
 * @returns {boolean} True se conseguiu remover (tinha energia suficiente)
 */
export function removeEnergy(amount) {
    if (upgradeState.totalEnergy < amount) {
        return false;
    }
    
    upgradeState.totalEnergy -= amount;
    saveUpgradeState();
    
    if (callbacks.onEnergyEarned) {
        callbacks.onEnergyEarned(upgradeState.totalEnergy, -amount);
    }
    
    return true;
}

/**
 * Calcula energia ganha ao completar um setor
 * Sistema rebalanceado: apenas recompensa ao finalizar partida completa
 * @param {number} sector - Número do setor
 * @param {number} score - Pontuação no setor
 * @returns {number} Energia ganha (0 - energia só é dada ao finalizar partida)
 */
export function calculateEnergyFromSector(sector, score) {
    // Energia não é mais dada por setor individual
    // Toda energia é calculada ao finalizar a partida completa
    // Isso torna o progresso mais equilibrado e recompensador
    return 0;
}

/**
 * Calcula energia ganha ao finalizar uma partida
 * Sistema com tabela fixa de recompensas por fase
 * Objetivo: jogador demora para comprar itens, mas ao chegar na fase 15 tem quase 200 moedas
 * @param {number} finalScore - Pontuação final (não usado - apenas para compatibilidade)
 * @param {number} maxSector - Setor/Fase máximo alcançado
 * @param {number} maxCombo - Combo máximo (não usado - apenas para compatibilidade)
 * @returns {number} Energia ganha (exatamente conforme tabela fixa)
 */
export function calculateEnergyFromGame(finalScore, maxSector, maxCombo) {
    // Tabela fixa de recompensas por fase
    // Progressão equilibrada: jogador demora para comprar itens
    // Ao chegar na fase 15, tem quase 200 moedas (valor do item mais caro)
    const phaseRewards = {
        1: 3,    // Fase 1 → 3 moedas
        2: 6,    // Fase 2 → 6 moedas
        3: 10,   // Fase 3 → 10 moedas
        4: 14,   // Fase 4 → 14 moedas
        5: 20,   // Fase 5 → 20 moedas
        6: 28,   // Fase 6 → 28 moedas
        7: 38,   // Fase 7 → 38 moedas
        8: 50,   // Fase 8 → 50 moedas
        9: 65,   // Fase 9 → 65 moedas
        10: 85,  // Fase 10 → 85 moedas
        11: 110, // Fase 11 → 110 moedas
        12: 135, // Fase 12 → 135 moedas
        13: 160, // Fase 13 → 160 moedas
        14: 180, // Fase 14 → 180 moedas
        15: 195  // Fase 15 → 195 moedas (quase 200, valor do item mais caro)
    };
    
    // Retorna exatamente o valor da tabela para o setor alcançado
    // Se o setor não existir na tabela, retorna 0 (ou o valor do último setor disponível)
    if (maxSector <= 0) {
        return 0;
    }
    
    // Se o setor for maior que 15, usa o valor da fase 15
    const phaseNumber = Math.min(maxSector, 15);
    
    // Retorna exatamente o valor da tabela, sem bônus extras
    // Isso garante progressão equilibrada e previsível
    return phaseRewards[phaseNumber] || 0;
}

/**
 * Retorna energia atual do jogador
 * @returns {number} Energia total
 */
export function getTotalEnergy() {
    return upgradeState.totalEnergy;
}

/**
 * Verifica se um upgrade foi comprado
 * @param {string} upgradeType - Tipo do upgrade
 * @returns {boolean} True se foi comprado
 */
export function hasUpgrade(upgradeType) {
    return upgradeState.purchasedUpgrades.has(upgradeType);
}

/**
 * Compra um upgrade
 * @param {string} upgradeType - Tipo do upgrade
 * @returns {boolean} True se compra foi bem-sucedida
 */
export function purchaseUpgrade(upgradeType) {
    const config = UPGRADE_CONFIGS[upgradeType];
    if (!config) {
        console.error('Upgrade não encontrado:', upgradeType);
        return false;
    }
    
    // Verifica se já foi comprado
    if (hasUpgrade(upgradeType)) {
        console.warn('Upgrade já foi comprado:', upgradeType);
        return false;
    }
    
    // Verifica se tem energia suficiente
    if (upgradeState.totalEnergy < config.cost) {
        console.warn('Energia insuficiente:', upgradeState.totalEnergy, '<', config.cost);
        return false;
    }
    
    // Compra o upgrade
    upgradeState.totalEnergy -= config.cost;
    upgradeState.purchasedUpgrades.add(upgradeType);
    saveUpgradeState();
    
    if (callbacks.onUpgradePurchased) {
        callbacks.onUpgradePurchased(upgradeType, config);
    }
    
    return true;
}

/**
 * Retorna configuração de um upgrade
 * @param {string} upgradeType - Tipo do upgrade
 * @returns {Object} Configuração do upgrade
 */
export function getUpgradeConfig(upgradeType) {
    return UPGRADE_CONFIGS[upgradeType];
}

/**
 * Retorna todos os upgrades disponíveis
 * @returns {Object} Todos os upgrades
 */
export function getAllUpgrades() {
    return UPGRADE_CONFIGS;
}

/**
 * Retorna todos os upgrades comprados
 * @returns {Array} Lista de tipos de upgrades comprados
 */
export function getPurchasedUpgrades() {
    return Array.from(upgradeState.purchasedUpgrades);
}

/**
 * Aplica efeitos de upgrades ao estado do jogo
 * @param {Object} gameState - Estado do jogo
 * @returns {Object} Efeitos aplicados
 */
export function applyUpgradeEffects(gameState) {
    const effects = {
        targetSizeMultiplier: 1.0,
        timeBonus: 0,
        visibilityBoost: 0,
        scoreMultiplier: 0,
        powerUpDurationMultiplier: 1.0
    };
    
    // Aplica cada upgrade comprado
    upgradeState.purchasedUpgrades.forEach(upgradeType => {
        const config = UPGRADE_CONFIGS[upgradeType];
        if (config && config.effect) {
            Object.keys(config.effect).forEach(key => {
                if (key === 'targetSizeMultiplier') {
                    effects.targetSizeMultiplier *= config.effect[key];
                } else if (key === 'timeBonus') {
                    effects.timeBonus += config.effect[key];
                } else if (key === 'visibilityBoost') {
                    effects.visibilityBoost += config.effect[key];
                } else if (key === 'scoreMultiplier') {
                    effects.scoreMultiplier += config.effect[key];
                } else if (key === 'powerUpDurationMultiplier') {
                    effects.powerUpDurationMultiplier *= config.effect[key];
                }
            });
        }
    });
    
    return effects;
}

/**
 * Reseta o sistema de upgrades (para testes)
 */
export function resetUpgradeSystem() {
    upgradeState.purchasedUpgrades.clear();
    upgradeState.totalEnergy = 0;
    upgradeState.energyEarned = 0;
    saveUpgradeState();
}

/**
 * Retorna estatísticas do sistema de upgrades
 * @returns {Object} Estatísticas
 */
export function getUpgradeStats() {
    return {
        totalEnergy: upgradeState.totalEnergy,
        energyEarned: upgradeState.energyEarned,
        upgradesPurchased: upgradeState.purchasedUpgrades.size,
        purchasedUpgrades: Array.from(upgradeState.purchasedUpgrades)
    };
}


/**
 * Sistema de Conquistas - Nexus Prism
 * Gerencia conquistas e objetivos de longo prazo
 */

/**
 * Tipos de conquistas disponíveis
 */
export const ACHIEVEMENT_TYPES = {
    // Progresso Básico
    PRIMEIROS_PASSOS: 'primeiros_passos',
    VELOCIDADE_SUPERSONICA: 'velocidade_supersonica',
    
    // Combos
    COMBO_MASTER: 'combo_master',
    COMBO_LEGENDARIO: 'combo_lendario',
    
    // Precisão
    PERFEICAO: 'perfeicao',
    SEM_ERROS: 'sem_erros',
    
    // Progressão
    EXPLORADOR: 'explorador',
    LENDA: 'lenda',
    
    // Power-Ups
    MESTRE_POWERUPS: 'mestre_powerups',
    
    // Customização
    COLECIONADOR: 'colecionador',
    
    // Estatísticas
    MARATONISTA: 'maratonista',
    CAÇADOR: 'cacador'
};

/**
 * Configurações de cada conquista
 */
const ACHIEVEMENT_CONFIGS = {
    [ACHIEVEMENT_TYPES.PRIMEIROS_PASSOS]: {
        id: ACHIEVEMENT_TYPES.PRIMEIROS_PASSOS,
        name: 'Primeiros Passos',
        description: 'Alcance 10 pontos em uma partida',
        icon: '👣',
        category: 'Progresso',
        rarity: 'comum',
        condition: {
            type: 'score',
            value: 10,
            inSingleGame: true
        }
    },
    [ACHIEVEMENT_TYPES.VELOCIDADE_SUPERSONICA]: {
        id: ACHIEVEMENT_TYPES.VELOCIDADE_SUPERSONICA,
        name: 'Velocidade Supersônica',
        description: 'Alcance 50 pontos em uma partida',
        icon: '⚡',
        category: 'Progresso',
        rarity: 'rara',
        condition: {
            type: 'score',
            value: 50,
            inSingleGame: true
        }
    },
    [ACHIEVEMENT_TYPES.COMBO_MASTER]: {
        id: ACHIEVEMENT_TYPES.COMBO_MASTER,
        name: 'Combo Master',
        description: 'Alcance um combo de 30',
        icon: '🔥',
        category: 'Combos',
        rarity: 'rara',
        condition: {
            type: 'combo',
            value: 30
        }
    },
    [ACHIEVEMENT_TYPES.COMBO_LEGENDARIO]: {
        id: ACHIEVEMENT_TYPES.COMBO_LEGENDARIO,
        name: 'Combo Lendário',
        description: 'Alcance um combo de 50',
        icon: '💎',
        category: 'Combos',
        rarity: 'lendaria',
        condition: {
            type: 'combo',
            value: 50
        }
    },
    [ACHIEVEMENT_TYPES.PERFEICAO]: {
        id: ACHIEVEMENT_TYPES.PERFEICAO,
        name: 'Perfeição',
        description: '100% de precisão em um setor',
        icon: '🎯',
        category: 'Precisão',
        rarity: 'rara',
        condition: {
            type: 'accuracy',
            value: 100,
            inSector: true
        }
    },
    [ACHIEVEMENT_TYPES.SEM_ERROS]: {
        id: ACHIEVEMENT_TYPES.SEM_ERROS,
        name: 'Sem Erros',
        description: 'Complete um setor sem perder combo',
        icon: '✨',
        category: 'Precisão',
        rarity: 'epica',
        condition: {
            type: 'no_miss_in_sector',
            value: 1
        }
    },
    [ACHIEVEMENT_TYPES.EXPLORADOR]: {
        id: ACHIEVEMENT_TYPES.EXPLORADOR,
        name: 'Explorador',
        description: 'Chegue ao Setor 4',
        icon: '🗺️',
        category: 'Progressão',
        rarity: 'comum',
        condition: {
            type: 'sector',
            value: 4
        }
    },
    [ACHIEVEMENT_TYPES.LENDA]: {
        id: ACHIEVEMENT_TYPES.LENDA,
        name: 'Lenda',
        description: 'Chegue ao Setor 6',
        icon: '👑',
        category: 'Progressão',
        rarity: 'lendaria',
        condition: {
            type: 'sector',
            value: 6
        }
    },
    [ACHIEVEMENT_TYPES.MESTRE_POWERUPS]: {
        id: ACHIEVEMENT_TYPES.MESTRE_POWERUPS,
        name: 'Mestre dos Power-Ups',
        description: 'Use 10 power-ups em uma partida',
        icon: '💫',
        category: 'Power-Ups',
        rarity: 'rara',
        condition: {
            type: 'powerups_used',
            value: 10,
            inSingleGame: true
        }
    },
    [ACHIEVEMENT_TYPES.COLECIONADOR]: {
        id: ACHIEVEMENT_TYPES.COLECIONADOR,
        name: 'Colecionador',
        description: 'Compre 5 skins',
        icon: '🎨',
        category: 'Customização',
        rarity: 'rara',
        condition: {
            type: 'skins_purchased',
            value: 5
        }
    },
    [ACHIEVEMENT_TYPES.MARATONISTA]: {
        id: ACHIEVEMENT_TYPES.MARATONISTA,
        name: 'Maratonista',
        description: 'Jogue 10 partidas',
        icon: '🏃',
        category: 'Estatísticas',
        rarity: 'comum',
        condition: {
            type: 'games_played',
            value: 10
        }
    },
    [ACHIEVEMENT_TYPES.CACADOR]: {
        id: ACHIEVEMENT_TYPES.CACADOR,
        name: 'Caçador',
        description: 'Clique em 100 alvos no total',
        icon: '🎯',
        category: 'Estatísticas',
        rarity: 'comum',
        condition: {
            type: 'total_hits',
            value: 100
        }
    }
};

/**
 * Chave para localStorage
 */
const STORAGE_KEY = 'nexus_prism_achievements';
const STATS_KEY = 'nexus_prism_stats';

/**
 * Estado do sistema de conquistas
 */
let achievementState = {
    unlockedAchievements: new Set(),
    stats: {
        gamesPlayed: 0,
        totalHits: 0,
        totalScore: 0,
        maxCombo: 0,
        maxScore: 0,
        maxSector: 0,
        powerUpsUsed: 0,
        skinsPurchased: 0,
        currentGameStats: {
            score: 0,
            combo: 0,
            sector: 1,
            hits: 0,
            misses: 0,
            powerUpsUsed: 0,
            sectorHits: {},
            sectorMisses: {}
        }
    }
};

/**
 * Callbacks para eventos
 */
let callbacks = {
    onAchievementUnlocked: null,
    onProgressUpdate: null
};

/**
 * Inicializa o sistema de conquistas
 * @param {Object} options - Opções de inicialização
 */
export function initAchievementSystem(options = {}) {
    if (options.onAchievementUnlocked) {
        callbacks.onAchievementUnlocked = options.onAchievementUnlocked;
    }
    if (options.onProgressUpdate) {
        callbacks.onProgressUpdate = options.onProgressUpdate;
    }
    
    // Carrega estado salvo
    loadAchievementState();
}

/**
 * Carrega estado de conquistas do localStorage
 */
function loadAchievementState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            achievementState.unlockedAchievements = new Set(data.unlockedAchievements || []);
        }
        
        const savedStats = localStorage.getItem(STATS_KEY);
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            achievementState.stats = {
                ...achievementState.stats,
                ...stats,
                currentGameStats: achievementState.stats.currentGameStats // Mantém stats do jogo atual
            };
        }
    } catch (e) {
        console.warn('Erro ao carregar conquistas:', e);
    }
}

/**
 * Salva estado de conquistas no localStorage
 */
function saveAchievementState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            unlockedAchievements: Array.from(achievementState.unlockedAchievements)
        }));
        
        // Salva stats (sem currentGameStats)
        const statsToSave = { ...achievementState.stats };
        delete statsToSave.currentGameStats;
        localStorage.setItem(STATS_KEY, JSON.stringify(statsToSave));
    } catch (e) {
        console.warn('Erro ao salvar conquistas:', e);
    }
}

/**
 * Verifica se uma conquista foi desbloqueada
 * @param {string} achievementId - ID da conquista
 * @returns {boolean} True se foi desbloqueada
 */
export function isAchievementUnlocked(achievementId) {
    return achievementState.unlockedAchievements.has(achievementId);
}

/**
 * Retorna configuração de uma conquista
 * @param {string} achievementId - ID da conquista
 * @returns {Object} Configuração da conquista
 */
export function getAchievementConfig(achievementId) {
    return ACHIEVEMENT_CONFIGS[achievementId];
}

/**
 * Retorna todas as conquistas
 * @returns {Object} Todas as conquistas
 */
export function getAllAchievements() {
    return ACHIEVEMENT_CONFIGS;
}

/**
 * Retorna conquistas por categoria
 * @param {string} category - Categoria
 * @returns {Array} Lista de conquistas da categoria
 */
export function getAchievementsByCategory(category) {
    return Object.keys(ACHIEVEMENT_CONFIGS).filter(achievementId => {
        return ACHIEVEMENT_CONFIGS[achievementId].category === category;
    });
}

/**
 * Retorna todas as conquistas desbloqueadas
 * @returns {Array} Lista de IDs de conquistas desbloqueadas
 */
export function getUnlockedAchievements() {
    return Array.from(achievementState.unlockedAchievements);
}

/**
 * Retorna progresso de uma conquista
 * @param {string} achievementId - ID da conquista
 * @returns {Object} Progresso {current, target, percentage}
 */
export function getAchievementProgress(achievementId) {
    const config = ACHIEVEMENT_CONFIGS[achievementId];
    if (!config) return null;
    
    const condition = config.condition;
    const stats = achievementState.stats;
    
    let current = 0;
    let target = condition.value;
    
    switch (condition.type) {
        case 'score':
            current = condition.inSingleGame ? stats.currentGameStats.score : stats.maxScore;
            break;
        case 'combo':
            current = stats.maxCombo;
            break;
        case 'sector':
            current = stats.maxSector;
            break;
        case 'games_played':
            current = stats.gamesPlayed;
            break;
        case 'total_hits':
            current = stats.totalHits;
            break;
        case 'powerups_used':
            current = condition.inSingleGame ? stats.currentGameStats.powerUpsUsed : stats.powerUpsUsed;
            break;
        case 'skins_purchased':
            current = stats.skinsPurchased;
            break;
        case 'accuracy':
            // Calcula precisão do setor atual
            const sector = stats.currentGameStats.sector;
            const sectorHits = stats.currentGameStats.sectorHits[sector] || 0;
            const sectorMisses = stats.currentGameStats.sectorMisses[sector] || 0;
            const total = sectorHits + sectorMisses;
            current = total > 0 ? Math.round((sectorHits / total) * 100) : 0;
            break;
        case 'no_miss_in_sector':
            // Verifica se completou setor sem erros
            const currentSector = stats.currentGameStats.sector;
            const misses = stats.currentGameStats.sectorMisses[currentSector] || 0;
            current = misses === 0 ? 1 : 0;
            target = 1;
            break;
    }
    
    const percentage = Math.min(100, Math.round((current / target) * 100));
    
    return {
        current,
        target,
        percentage,
        unlocked: isAchievementUnlocked(achievementId)
    };
}

/**
 * Registra um hit (acerto)
 */
export function registerHit() {
    achievementState.stats.totalHits++;
    achievementState.stats.currentGameStats.hits++;
    
    const currentSector = achievementState.stats.currentGameStats.sector;
    if (!achievementState.stats.currentGameStats.sectorHits[currentSector]) {
        achievementState.stats.currentGameStats.sectorHits[currentSector] = 0;
    }
    achievementState.stats.currentGameStats.sectorHits[currentSector]++;
    
    checkAchievements();
}

/**
 * Registra um miss (erro)
 */
export function registerMiss() {
    achievementState.stats.currentGameStats.misses++;
    
    const currentSector = achievementState.stats.currentGameStats.sector;
    if (!achievementState.stats.currentGameStats.sectorMisses[currentSector]) {
        achievementState.stats.currentGameStats.sectorMisses[currentSector] = 0;
    }
    achievementState.stats.currentGameStats.sectorMisses[currentSector]++;
    
    checkAchievements();
}

/**
 * Registra pontuação
 * @param {number} score - Pontuação atual
 */
export function registerScore(score) {
    achievementState.stats.currentGameStats.score = score;
    if (score > achievementState.stats.maxScore) {
        achievementState.stats.maxScore = score;
    }
    
    checkAchievements();
}

/**
 * Registra combo
 * @param {number} combo - Combo atual
 */
export function registerCombo(combo) {
    achievementState.stats.currentGameStats.combo = combo;
    if (combo > achievementState.stats.maxCombo) {
        achievementState.stats.maxCombo = combo;
    }
    
    checkAchievements();
}

/**
 * Registra setor alcançado
 * @param {number} sector - Setor atual
 */
export function registerSector(sector) {
    achievementState.stats.currentGameStats.sector = sector;
    if (sector > achievementState.stats.maxSector) {
        achievementState.stats.maxSector = sector;
    }
    
    checkAchievements();
}

/**
 * Registra uso de power-up
 */
export function registerPowerUpUsed() {
    achievementState.stats.powerUpsUsed++;
    achievementState.stats.currentGameStats.powerUpsUsed++;
    
    checkAchievements();
}

/**
 * Registra compra de skin
 */
export function registerSkinPurchased() {
    achievementState.stats.skinsPurchased++;
    checkAchievements();
}

/**
 * Inicia uma nova partida (reseta stats do jogo atual)
 */
export function startNewGame() {
    achievementState.stats.currentGameStats = {
        score: 0,
        combo: 0,
        sector: 1,
        hits: 0,
        misses: 0,
        powerUpsUsed: 0,
        sectorHits: {},
        sectorMisses: {}
    };
}

/**
 * Finaliza uma partida (salva stats)
 */
export function endGame() {
    achievementState.stats.gamesPlayed++;
    saveAchievementState();
    
    // Verifica conquistas finais
    checkAchievements();
}

/**
 * Verifica e desbloqueia conquistas
 */
function checkAchievements() {
    Object.keys(ACHIEVEMENT_CONFIGS).forEach(achievementId => {
        // Pula se já foi desbloqueada
        if (isAchievementUnlocked(achievementId)) {
            return;
        }
        
        const config = ACHIEVEMENT_CONFIGS[achievementId];
        const condition = config.condition;
        const stats = achievementState.stats;
        
        let unlocked = false;
        
        switch (condition.type) {
            case 'score':
                if (condition.inSingleGame) {
                    unlocked = stats.currentGameStats.score >= condition.value;
                } else {
                    unlocked = stats.maxScore >= condition.value;
                }
                break;
                
            case 'combo':
                unlocked = stats.maxCombo >= condition.value;
                break;
                
            case 'sector':
                unlocked = stats.maxSector >= condition.value;
                break;
                
            case 'games_played':
                unlocked = stats.gamesPlayed >= condition.value;
                break;
                
            case 'total_hits':
                unlocked = stats.totalHits >= condition.value;
                break;
                
            case 'powerups_used':
                if (condition.inSingleGame) {
                    unlocked = stats.currentGameStats.powerUpsUsed >= condition.value;
                } else {
                    unlocked = stats.powerUpsUsed >= condition.value;
                }
                break;
                
            case 'skins_purchased':
                unlocked = stats.skinsPurchased >= condition.value;
                break;
                
            case 'accuracy':
                if (condition.inSector) {
                    const sector = stats.currentGameStats.sector;
                    const sectorHits = stats.currentGameStats.sectorHits[sector] || 0;
                    const sectorMisses = stats.currentGameStats.sectorMisses[sector] || 0;
                    const total = sectorHits + sectorMisses;
                    if (total > 0) {
                        const accuracy = (sectorHits / total) * 100;
                        unlocked = accuracy >= condition.value;
                    }
                }
                break;
                
            case 'no_miss_in_sector':
                const currentSector = stats.currentGameStats.sector;
                const misses = stats.currentGameStats.sectorMisses[currentSector] || 0;
                unlocked = misses === 0 && stats.currentGameStats.sectorHits[currentSector] > 0;
                break;
        }
        
        if (unlocked) {
            unlockAchievement(achievementId);
        }
    });
}

/**
 * Desbloqueia uma conquista
 * @param {string} achievementId - ID da conquista
 */
function unlockAchievement(achievementId) {
    if (isAchievementUnlocked(achievementId)) {
        return; // Já desbloqueada
    }
    
    achievementState.unlockedAchievements.add(achievementId);
    saveAchievementState();
    
    const config = ACHIEVEMENT_CONFIGS[achievementId];
    
    console.log(`🏆 Conquista desbloqueada: ${config.name}`);
    
    if (callbacks.onAchievementUnlocked) {
        callbacks.onAchievementUnlocked(achievementId, config);
    }
}

/**
 * Retorna estatísticas do sistema
 * @returns {Object} Estatísticas
 */
export function getAchievementStats() {
    return {
        totalAchievements: Object.keys(ACHIEVEMENT_CONFIGS).length,
        unlockedCount: achievementState.unlockedAchievements.size,
        unlockedPercentage: Math.round((achievementState.unlockedAchievements.size / Object.keys(ACHIEVEMENT_CONFIGS).length) * 100),
        stats: { ...achievementState.stats }
    };
}

/**
 * Reseta o sistema de conquistas (para testes)
 */
export function resetAchievementSystem() {
    achievementState.unlockedAchievements.clear();
    achievementState.stats = {
        gamesPlayed: 0,
        totalHits: 0,
        totalScore: 0,
        maxCombo: 0,
        maxScore: 0,
        maxSector: 0,
        powerUpsUsed: 0,
        skinsPurchased: 0,
        currentGameStats: {
            score: 0,
            combo: 0,
            sector: 1,
            hits: 0,
            misses: 0,
            powerUpsUsed: 0,
            sectorHits: {},
            sectorMisses: {}
        }
    };
    saveAchievementState();
}


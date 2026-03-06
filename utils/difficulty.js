/**
 * Perfis de dificuldade do jogo
 */

// Tempo padrão de partida em segundos (configurável)
// Alterar este valor para ajustar a duração de todas as partidas
export const DEFAULT_GAME_TIME = 120; // 2 minutos

const difficultyProfiles = {
    easy: {
        targetSize: 100,
        respawnDelay: 2000,
        totalTime: DEFAULT_GAME_TIME
    },
    normal: {
        targetSize: 80,
        respawnDelay: 1500,
        totalTime: DEFAULT_GAME_TIME
    },
    hard: {
        targetSize: 60,
        respawnDelay: 1000,
        totalTime: DEFAULT_GAME_TIME
    }
};

/**
 * Retorna perfil de dificuldade
 * @param {string} level - 'easy', 'normal' ou 'hard'
 * @returns {Object} Perfil de dificuldade
 */
export function getDifficultyProfile(level) {
    return difficultyProfiles[level] || difficultyProfiles.normal;
}

/**
 * Retorna todos os perfis
 * @returns {Object} Todos os perfis de dificuldade
 */
export function getAllProfiles() {
    return difficultyProfiles;
}


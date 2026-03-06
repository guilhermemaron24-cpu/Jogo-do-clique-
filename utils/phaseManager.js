/**
 * Gerenciador de Fases e Setores - Nexus Prism
 * Controla progressão, transições e narrativa
 */

/**
 * Configurações de cada setor
 */
const sectorConfigs = {
    1: {
        name: 'Luz Inicial',
        description: 'Ambiente estável, fendas lentas',
        difficulty: {
            targetSize: 80,
            respawnDelay: 1500,
            minRespawnDelay: 1500,
            maxRespawnDelay: 1500
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.4)',
            borderColor: 'rgba(0, 240, 255, 0.3)',
            glowIntensity: 0.3,
            distortion: false
        },
        mechanics: {
            simultaneousTargets: 1,
            camouflagedTargets: false,
            targetOpacity: 1.0
        },
        orionMessage: {
            title: 'Setor 1 - Luz Inicial',
            text: 'Bem-vindo, Operador. Este é o Setor 1 - Luz Inicial. As fendas aqui são estáveis. Use este momento para se acostumar com o sistema.',
            duration: 4000
        }
    },
    2: {
        name: 'Circuito Particulado',
        description: 'Padrões mais rápidos, distorções visuais',
        difficulty: {
            targetSize: 70,
            respawnDelay: 1200,
            minRespawnDelay: 1000,
            maxRespawnDelay: 1400
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.5)',
            borderColor: 'rgba(255, 0, 240, 0.4)',
            glowIntensity: 0.5,
            distortion: true,
            distortionIntensity: 0.1
        },
        mechanics: {
            simultaneousTargets: 1,
            camouflagedTargets: false,
            targetOpacity: 1.0
        },
        orionMessage: {
            title: 'Setor 2 - Circuito Particulado',
            text: 'ATENÇÃO! Entrando no Setor 2 - Circuito Particulado. As fendas estão se tornando mais instáveis. Fique alerta!',
            duration: 4000
        }
    },
    3: {
        name: 'Campo de Ruído',
        description: 'Múltiplas fendas simultâneas, interferência',
        difficulty: {
            targetSize: 60,
            respawnDelay: 1000,
            minRespawnDelay: 800,
            maxRespawnDelay: 1200
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.6)',
            borderColor: 'rgba(255, 215, 0, 0.4)',
            glowIntensity: 0.7,
            distortion: true,
            distortionIntensity: 0.2
        },
        mechanics: {
            simultaneousTargets: 2, // Múltiplas fendas
            camouflagedTargets: false,
            targetOpacity: 1.0
        },
        orionMessage: {
            title: 'Setor 3 - Campo de Ruído',
            text: 'ALERTA CRÍTICO! Setor 3 - Campo de Ruído detectado. Múltiplas fendas simultâneas. A estabilidade está comprometida!',
            duration: 4500
        }
    },
    4: {
        name: 'Núcleo Distorto',
        description: 'Fendas camufladas, ambiente instável',
        difficulty: {
            targetSize: 50,
            respawnDelay: 800,
            minRespawnDelay: 600,
            maxRespawnDelay: 1000
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.7)',
            borderColor: 'rgba(255, 0, 240, 0.5)',
            glowIntensity: 0.9,
            distortion: true,
            distortionIntensity: 0.3
        },
        mechanics: {
            simultaneousTargets: 1,
            camouflagedTargets: true, // Fendas camufladas
            targetOpacity: 0.6, // Opacidade reduzida
            opacityVariation: 0.4, // Variação de opacidade
            fakeTargets: true, // Alvos falsos (clicar = perder combo)
            fakeTargetChance: 0.2 // 20% de chance de ser falso
        },
        orionMessage: {
            title: 'Setor 4 - Núcleo Distorto',
            text: 'PERIGO EXTREMO! Setor 4 - Núcleo Distorto. As fendas estão camufladas e o ambiente está instável. Confie nos seus instintos, Operador!',
            duration: 5000
        }
    },
    5: {
        name: 'Vórtice Quântico',
        description: 'Alvos rotacionam e pulam, movimento caótico',
        difficulty: {
            targetSize: 40,
            respawnDelay: 600,
            minRespawnDelay: 500,
            maxRespawnDelay: 700
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.8)',
            borderColor: 'rgba(0, 255, 255, 0.6)',
            glowIntensity: 1.0,
            distortion: true,
            distortionIntensity: 0.4
        },
        mechanics: {
            simultaneousTargets: 1,
            camouflagedTargets: false,
            targetOpacity: 1.0,
            movingTargets: true, // Alvos se movem
            // Alvos falsos introduzidos no Setor 5 para aumentar dificuldade
            fakeTargets: true,
            fakeTargetChance: 0.25, // 25% de chance de ser falso
            rotationSpeed: 2.0, // Rotação rápida
            jumpFrequency: 2000, // Pula a cada 2 segundos
            positionChangeFrequency: 3000 // Muda posição a cada 3 segundos
        },
        orionMessage: {
            title: 'Setor 5 - Vórtice Quântico',
            text: 'CAOS QUÂNTICO DETECTADO! Setor 5 - Vórtice Quântico. As fendas estão em constante movimento. A realidade está se desfazendo. Mantenha o foco!',
            duration: 5500
        }
    },
    6: {
        name: 'Abismo Prismático',
        description: 'Alvos desaparecem/reaparecem, múltiplos falsos',
        difficulty: {
            targetSize: 35,
            respawnDelay: 500,
            minRespawnDelay: 400,
            maxRespawnDelay: 600
        },
        visual: {
            backgroundColor: 'rgba(10, 14, 26, 0.9)',
            borderColor: 'rgba(255, 0, 0, 0.7)',
            glowIntensity: 1.2,
            distortion: true,
            distortionIntensity: 0.5
        },
        mechanics: {
            simultaneousTargets: 2, // Múltiplos alvos
            camouflagedTargets: true,
            targetOpacity: 0.5,
            opacityVariation: 0.3,
            fakeTargets: true,
            fakeTargetChance: 0.4, // 40% de chance de ser falso
            // Ativa movimento dinâmico no Setor 6 (alvos se movem constantemente)
            movingTargets: true,
            movementSpeed: 2.5,
            blinkFrequency: 1500, // Pisca a cada 1.5 segundos
            disappearChance: 0.3, // 30% de chance de desaparecer temporariamente
            reappearDelay: 1000 // Reaparece após 1 segundo
        },
        orionMessage: {
            title: 'Setor 6 - Abismo Prismático',
            text: '⚠️ ALERTA MÁXIMO! Setor 6 - Abismo Prismático. Este é o limite do Nexus. As fendas são ilusórias e a realidade colapsa. Apenas os mais ágeis sobreviverão. BOA SORTE!',
            duration: 6000
        }
    }
};

/**
 * Retorna configuração de um setor
 * @param {number} sectorNumber - Número do setor (1-6)
 * @returns {Object} Configuração do setor
 */
export function getSectorConfig(sectorNumber) {
    return sectorConfigs[sectorNumber] || sectorConfigs[1];
}

/**
 * Retorna mensagem de ORION para um setor
 * @param {number} sectorNumber - Número do setor
 * @returns {Object} Mensagem de ORION
 */
export function getOrionMessage(sectorNumber) {
    const config = getSectorConfig(sectorNumber);
    return config.orionMessage;
}

/**
 * Aplica configurações visuais de um setor ao elemento
 * @param {HTMLElement} gameArea - Área de jogo
 * @param {number} sectorNumber - Número do setor
 */
export function applySectorVisuals(gameArea, sectorNumber) {
    const config = getSectorConfig(sectorNumber);
    const visual = config.visual;
    
    if (!gameArea) return;
    
    // Aplica cores de fundo e borda
    gameArea.style.backgroundColor = visual.backgroundColor;
    gameArea.style.borderColor = visual.borderColor;
    
    // Aplica distorção se habilitada
    if (visual.distortion) {
        gameArea.classList.add('sector-distortion');
        gameArea.style.setProperty('--distortion-intensity', visual.distortionIntensity || 0.1);
    } else {
        gameArea.classList.remove('sector-distortion');
    }
    
    // Aplica intensidade de glow
    gameArea.style.setProperty('--glow-intensity', visual.glowIntensity);
}

/**
 * Retorna configuração de dificuldade de um setor
 * @param {number} sectorNumber - Número do setor
 * @returns {Object} Configuração de dificuldade
 */
export function getSectorDifficulty(sectorNumber) {
    const config = getSectorConfig(sectorNumber);
    return config.difficulty;
}

/**
 * Retorna mecânicas especiais de um setor
 * @param {number} sectorNumber - Número do setor
 * @returns {Object} Mecânicas do setor
 */
export function getSectorMechanics(sectorNumber) {
    const config = getSectorConfig(sectorNumber);
    return config.mechanics;
}

/**
 * Retorna todos os setores disponíveis
 * @returns {Object} Todos os setores
 */
export function getAllSectors() {
    return sectorConfigs;
}

/**
 * Verifica se um setor existe
 * @param {number} sectorNumber - Número do setor
 * @returns {boolean} True se o setor existe
 */
export function sectorExists(sectorNumber) {
    return sectorNumber >= 1 && sectorNumber <= 6 && sectorConfigs[sectorNumber] !== undefined;
}


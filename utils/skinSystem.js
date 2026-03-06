/**
 * Sistema de Skins - Nexus Prism
 * Gerencia skins visuais para os alvos do jogo
 */

/**
 * Tipos de skins disponíveis
 */
export const SKIN_TYPES = {
    // Skins Simples
    EMOJI_FELIZ: 'emoji_feliz',
    EMOJI_BRAVO: 'emoji_bravo',
    EMOJI_COOL: 'emoji_cool',
    NEON_ROXO: 'neon_roxo',
    MODO_SOMBRA: 'modo_sombra',
    
    // Skins Intermediárias
    ESTRELA_PULSANTE: 'estrela_pulsante',
    PLANETA_TERRA: 'planeta_terra',
    FOGO: 'fogo',
    GELO: 'gelo',
    CIRCUITO_TECH: 'circuito_tech',
    
    // Skins Raras
    GALAXIA: 'galaxia',
    FRAGMENTO_PRISMATICO: 'fragmento_prismatico',
    RAIO: 'raio',
    CRISTAL_AZUL: 'cristal_azul',
    
    // Skin Lendária
    NUCLEO_DIVINO: 'nucleo_divino'
};

/**
 * Configurações de cada skin
 */
const SKIN_CONFIGS = {
    // Skins Simples
    [SKIN_TYPES.EMOJI_FELIZ]: {
        name: 'Emoji Feliz',
        category: 'Simples',
        price: 20,
        icon: '😊',
        rarity: 'simples',
        description: 'Um alvo feliz e amigável',
        visual: {
            outerColor: '#ffd700',
            coreColor: '#ffd700',
            particleColor: '#ffd700',
            coreShape: 'emoji',
            emoji: '😊'
        }
    },
    [SKIN_TYPES.EMOJI_BRAVO]: {
        name: 'Emoji Bravo',
        category: 'Simples',
        price: 25,
        icon: '😠',
        rarity: 'simples',
        description: 'Um alvo determinado',
        visual: {
            outerColor: '#ff4444',
            coreColor: '#ff4444',
            particleColor: '#ff4444',
            coreShape: 'emoji',
            emoji: '😠'
        }
    },
    [SKIN_TYPES.EMOJI_COOL]: {
        name: 'Emoji Cool',
        category: 'Simples',
        price: 30,
        icon: '😎',
        rarity: 'simples',
        description: 'Um alvo estiloso',
        visual: {
            outerColor: '#00aaff',
            coreColor: '#00aaff',
            particleColor: '#00aaff',
            coreShape: 'emoji',
            emoji: '😎'
        }
    },
    [SKIN_TYPES.NEON_ROXO]: {
        name: 'Neon Roxo',
        category: 'Simples',
        price: 35,
        icon: '💜',
        rarity: 'simples',
        description: 'Brilho neon roxo vibrante',
        visual: {
            outerColor: '#b347ff',
            coreColor: '#b347ff',
            particleColor: '#ff00ff',
            coreShape: 'circle',
            glowIntensity: 1.2
        }
    },
    [SKIN_TYPES.MODO_SOMBRA]: {
        name: 'Modo Sombra',
        category: 'Simples',
        price: 30,
        icon: '🌑',
        rarity: 'simples',
        description: 'Alvo sombrio e misterioso',
        visual: {
            outerColor: '#333333',
            coreColor: '#1a1a1a',
            particleColor: '#666666',
            coreShape: 'circle',
            opacity: 0.8
        }
    },
    
    // Skins Intermediárias
    [SKIN_TYPES.ESTRELA_PULSANTE]: {
        name: 'Estrela Pulsante',
        category: 'Intermediária',
        price: 70,
        icon: '⭐',
        rarity: 'intermediaria',
        description: 'Estrela que pulsa com energia',
        visual: {
            outerColor: '#ffd700',
            coreColor: '#ffff00',
            particleColor: '#ffaa00',
            coreShape: 'star',
            animation: 'pulse'
        }
    },
    [SKIN_TYPES.PLANETA_TERRA]: {
        name: 'Planeta Terra',
        category: 'Intermediária',
        price: 80,
        icon: '🌍',
        rarity: 'intermediaria',
        description: 'Alvo com visual de planeta',
        visual: {
            outerColor: '#4a90e2',
            coreColor: '#2e5c8a',
            particleColor: '#87ceeb',
            coreShape: 'planet',
            pattern: 'earth'
        }
    },
    [SKIN_TYPES.FOGO]: {
        name: 'Fogo',
        category: 'Intermediária',
        price: 90,
        icon: '🔥',
        rarity: 'intermediaria',
        description: 'Chamas dançantes',
        visual: {
            outerColor: '#ff4400',
            coreColor: '#ff8800',
            particleColor: '#ffaa00',
            coreShape: 'circle',
            animation: 'flame',
            gradient: ['#ff4400', '#ff8800', '#ffaa00']
        }
    },
    [SKIN_TYPES.GELO]: {
        name: 'Gelo',
        category: 'Intermediária',
        price: 75,
        icon: '❄️',
        rarity: 'intermediaria',
        description: 'Cristais de gelo brilhantes',
        visual: {
            outerColor: '#00d4ff',
            coreColor: '#87ceeb',
            particleColor: '#b0e0e6',
            coreShape: 'crystal',
            animation: 'sparkle'
        }
    },
    [SKIN_TYPES.CIRCUITO_TECH]: {
        name: 'Circuito Tech',
        category: 'Intermediária',
        price: 100,
        icon: '⚡',
        rarity: 'intermediaria',
        description: 'Circuito tecnológico avançado',
        visual: {
            outerColor: '#00ff00',
            coreColor: '#00ff88',
            particleColor: '#88ff00',
            coreShape: 'circuit',
            pattern: 'circuit'
        }
    },
    
    // Skins Raras
    [SKIN_TYPES.GALAXIA]: {
        name: 'Galáxia',
        category: 'Rara',
        price: 150,
        icon: '🌌',
        rarity: 'rara',
        description: 'Vórtice galáctico em movimento',
        visual: {
            outerColor: '#6b46c1',
            coreColor: '#9333ea',
            particleColor: '#a855f7',
            coreShape: 'galaxy',
            animation: 'spiral',
            gradient: ['#6b46c1', '#9333ea', '#a855f7', '#c084fc']
        }
    },
    [SKIN_TYPES.FRAGMENTO_PRISMATICO]: {
        name: 'Fragmento Prismático',
        category: 'Rara',
        price: 160,
        icon: '💎',
        rarity: 'rara',
        description: 'Fragmento que refrata a luz',
        visual: {
            outerColor: '#00f0ff',
            coreColor: '#ff00f0',
            particleColor: '#ffd700',
            coreShape: 'prism',
            animation: 'prism',
            gradient: ['#00f0ff', '#ff00f0', '#ffd700']
        }
    },
    [SKIN_TYPES.RAIO]: {
        name: 'Raio',
        category: 'Rara',
        price: 170,
        icon: '⚡',
        rarity: 'rara',
        description: 'Energia elétrica pura',
        visual: {
            outerColor: '#ffff00',
            coreColor: '#ffaa00',
            particleColor: '#ffffff',
            coreShape: 'lightning',
            animation: 'electric',
            glowIntensity: 1.5
        }
    },
    [SKIN_TYPES.CRISTAL_AZUL]: {
        name: 'Cristal Azul',
        category: 'Rara',
        price: 140,
        icon: '💠',
        rarity: 'rara',
        description: 'Cristal azul puro e brilhante',
        visual: {
            outerColor: '#0066ff',
            coreColor: '#0088ff',
            particleColor: '#00aaff',
            coreShape: 'crystal',
            animation: 'glow',
            glowIntensity: 1.3
        }
    },
    
    // Skin Lendária
    [SKIN_TYPES.NUCLEO_DIVINO]: {
        name: 'Núcleo Divino',
        category: 'Lendária',
        price: 200,
        icon: '✨',
        rarity: 'lendaria',
        description: 'O poder divino em sua forma mais pura',
        visual: {
            outerColor: '#ffffff',
            coreColor: '#ffd700',
            particleColor: '#ffffff',
            coreShape: 'divine',
            animation: 'divine',
            gradient: ['#ffffff', '#ffd700', '#ffaa00', '#ffffff'],
            glowIntensity: 2.0
        }
    }
};

/**
 * Chave para localStorage
 */
const STORAGE_KEY = 'nexus_prism_skins';
const SELECTED_SKIN_KEY = 'nexus_prism_selected_skin';

/**
 * Estado do sistema de skins
 */
let skinState = {
    purchasedSkins: new Set(),
    selectedSkin: null
};

/**
 * Callbacks para eventos
 */
let callbacks = {
    onSkinPurchased: null,
    onSkinSelected: null
};

/**
 * Inicializa o sistema de skins
 * @param {Object} options - Opções de inicialização
 */
export function initSkinSystem(options = {}) {
    if (options.onSkinPurchased) {
        callbacks.onSkinPurchased = options.onSkinPurchased;
    }
    if (options.onSkinSelected) {
        callbacks.onSkinSelected = options.onSkinSelected;
    }
    
    // Carrega estado salvo
    loadSkinState();
}

/**
 * Carrega estado de skins do localStorage
 */
function loadSkinState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            skinState.purchasedSkins = new Set(data.purchasedSkins || []);
        }
        
        const savedSelected = localStorage.getItem(SELECTED_SKIN_KEY);
        if (savedSelected) {
            skinState.selectedSkin = savedSelected;
        }
    } catch (e) {
        console.warn('Erro ao carregar skins:', e);
    }
}

/**
 * Salva estado de skins no localStorage
 */
function saveSkinState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            purchasedSkins: Array.from(skinState.purchasedSkins)
        }));
        if (skinState.selectedSkin) {
            localStorage.setItem(SELECTED_SKIN_KEY, skinState.selectedSkin);
        }
    } catch (e) {
        console.warn('Erro ao salvar skins:', e);
    }
}

/**
 * Compra uma skin
 * @param {string} skinType - Tipo da skin
 * @param {Function} purchaseCallback - Função para verificar/descontar moedas
 * @returns {boolean} True se compra foi bem-sucedida
 */
export function purchaseSkin(skinType, purchaseCallback) {
    const config = SKIN_CONFIGS[skinType];
    if (!config) {
        console.error('Skin não encontrada:', skinType);
        return false;
    }
    
    // Verifica se já foi comprada
    if (hasSkin(skinType)) {
        console.warn('Skin já foi comprada:', skinType);
        return false;
    }
    
    // Chama callback para verificar/descontar moedas
    if (purchaseCallback) {
        const success = purchaseCallback(config.price);
        if (!success) {
            return false;
        }
    }
    
    // Compra a skin
    skinState.purchasedSkins.add(skinType);
    
    // Automaticamente seleciona a skin comprada
    skinState.selectedSkin = skinType;
    saveSkinState();
    
    if (callbacks.onSkinPurchased) {
        callbacks.onSkinPurchased(skinType, config);
    }
    
    // Chama callback de seleção também
    if (callbacks.onSkinSelected) {
        callbacks.onSkinSelected(skinType, config);
    }
    
    return true;
}

/**
 * Verifica se uma skin foi comprada
 * @param {string} skinType - Tipo da skin
 * @returns {boolean} True se foi comprada
 */
export function hasSkin(skinType) {
    return skinState.purchasedSkins.has(skinType);
}

/**
 * Seleciona uma skin para usar
 * @param {string} skinType - Tipo da skin (null para padrão)
 * @returns {boolean} True se seleção foi bem-sucedida
 */
export function selectSkin(skinType) {
    // Verifica se a skin foi comprada (ou se é null para padrão)
    if (skinType !== null && !hasSkin(skinType)) {
        console.warn('Skin não comprada:', skinType);
        return false;
    }
    
    skinState.selectedSkin = skinType;
    saveSkinState();
    
    if (callbacks.onSkinSelected) {
        const config = skinType ? SKIN_CONFIGS[skinType] : null;
        callbacks.onSkinSelected(skinType, config);
    }
    
    return true;
}

/**
 * Retorna a skin selecionada
 * @returns {string|null} Tipo da skin selecionada
 */
export function getSelectedSkin() {
    return skinState.selectedSkin;
}

/**
 * Retorna configuração de uma skin
 * @param {string} skinType - Tipo da skin
 * @returns {Object} Configuração da skin
 */
export function getSkinConfig(skinType) {
    return SKIN_CONFIGS[skinType];
}

/**
 * Retorna todas as skins disponíveis
 * @returns {Object} Todas as skins
 */
export function getAllSkins() {
    return SKIN_CONFIGS;
}

/**
 * Retorna skins por categoria
 * @param {string} category - Categoria (simples, intermediaria, rara, lendaria)
 * @returns {Array} Lista de skins da categoria
 */
export function getSkinsByCategory(category) {
    return Object.keys(SKIN_CONFIGS).filter(skinType => {
        return SKIN_CONFIGS[skinType].category === category;
    });
}

/**
 * Retorna todas as skins compradas
 * @returns {Array} Lista de tipos de skins compradas
 */
export function getPurchasedSkins() {
    return Array.from(skinState.purchasedSkins);
}

/**
 * Aplica visual de uma skin a um elemento de alvo
 * @param {HTMLElement} targetElement - Elemento do alvo
 * @param {string} skinType - Tipo da skin (null para padrão)
 */
export function applySkinToTarget(targetElement, skinType) {
    if (!targetElement) return;
    
    const config = skinType ? SKIN_CONFIGS[skinType] : null;
    
    if (!config) {
        // Aplica visual padrão
        applyDefaultSkin(targetElement);
        return;
    }
    
    const visual = config.visual;
    
    // Aguarda o SVG estar disponível (pode não estar renderizado ainda)
    const applySkin = () => {
        const svg = targetElement.querySelector('.target-svg');
        if (!svg) {
            // Se o SVG ainda não existe, tenta novamente após um pequeno delay
            setTimeout(applySkin, 10);
            return;
        }
    
        // Aplica cores
        const outerRing = svg.querySelector('.outer-ring');
        const core = svg.querySelector('.core');
        const particle = svg.querySelector('.particle');
        
        if (outerRing) {
            outerRing.setAttribute('stroke', visual.outerColor || '#00f0ff');
            if (visual.glowIntensity) {
                outerRing.style.filter = `drop-shadow(0 0 ${visual.glowIntensity * 5}px ${visual.outerColor})`;
            } else {
                outerRing.style.filter = '';
            }
        }
        
        if (core) {
            if (visual.coreShape === 'emoji' && visual.emoji) {
                // Substitui círculo por emoji
                core.style.display = 'none';
                let emojiElement = svg.querySelector('.emoji-core');
                if (!emojiElement) {
                    emojiElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    emojiElement.setAttribute('class', 'emoji-core');
                    emojiElement.setAttribute('x', '50');
                    emojiElement.setAttribute('y', '50');
                    emojiElement.setAttribute('text-anchor', 'middle');
                    emojiElement.setAttribute('dominant-baseline', 'middle');
                    emojiElement.setAttribute('font-size', '40');
                    svg.appendChild(emojiElement);
                }
                emojiElement.textContent = visual.emoji;
                emojiElement.style.display = 'block';
            } else {
                // Mantém círculo padrão
                core.setAttribute('fill', visual.coreColor || '#00f0ff');
                if (visual.glowIntensity) {
                    core.style.filter = `drop-shadow(0 0 ${visual.glowIntensity * 5}px ${visual.coreColor})`;
                } else {
                    core.style.filter = '';
                }
                core.style.display = 'block';
                const emojiElement = svg.querySelector('.emoji-core');
                if (emojiElement) {
                    emojiElement.style.display = 'none';
                }
            }
        }
        
        if (particle) {
            particle.setAttribute('fill', visual.particleColor || '#00f0ff');
        }
        
        // Aplica opacidade se especificada
        if (visual.opacity !== undefined) {
            targetElement.style.opacity = visual.opacity;
        } else {
            targetElement.style.opacity = '1';
        }
        
        // Remove animações anteriores
        targetElement.classList.remove(...Array.from(targetElement.classList).filter(c => c.startsWith('skin-')));
        
        // Aplica animação se especificada
        if (visual.animation) {
            targetElement.classList.add(`skin-${visual.animation}`);
        }
    };
    
    // Inicia aplicação
    applySkin();
}

/**
 * Aplica visual padrão ao alvo
 * @param {HTMLElement} targetElement - Elemento do alvo
 */
function applyDefaultSkin(targetElement) {
    if (!targetElement) return;
    
    const svg = targetElement.querySelector('.target-svg');
    if (!svg) return;
    
    const outerRing = svg.querySelector('.outer-ring');
    const core = svg.querySelector('.core');
    const particle = svg.querySelector('.particle');
    const emojiElement = svg.querySelector('.emoji-core');
    
    if (outerRing) {
        outerRing.setAttribute('stroke', '#00f0ff');
        outerRing.style.filter = '';
    }
    
    if (core) {
        core.setAttribute('fill', '#00f0ff');
        core.style.filter = '';
        core.style.display = 'block';
    }
    
    if (emojiElement) {
        emojiElement.style.display = 'none';
    }
    
    if (particle) {
        particle.setAttribute('fill', '#00f0ff');
    }
    
    targetElement.style.opacity = '1';
    targetElement.classList.remove(...Array.from(targetElement.classList).filter(c => c.startsWith('skin-')));
}

/**
 * Reseta o sistema de skins (para testes)
 */
export function resetSkinSystem() {
    skinState.purchasedSkins.clear();
    skinState.selectedSkin = null;
    saveSkinState();
}

/**
 * Retorna estatísticas do sistema de skins
 * @returns {Object} Estatísticas
 */
export function getSkinStats() {
    return {
        totalSkins: Object.keys(SKIN_CONFIGS).length,
        purchasedSkins: skinState.purchasedSkins.size,
        selectedSkin: skinState.selectedSkin,
        purchasedSkinTypes: Array.from(skinState.purchasedSkins)
    };
}


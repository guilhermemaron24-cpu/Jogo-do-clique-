/**
 * Sistema de Feedback Visual Avançado - Nexus Prism
 * Gerencia todos os efeitos visuais de feedback do jogo
 */

/**
 * Cria números flutuantes ao clicar em alvo
 * @param {HTMLElement} container - Container do jogo
 * @param {HTMLElement} target - Alvo clicado
 * @param {number} points - Pontos ganhos
 * @param {number} multiplier - Multiplicador aplicado
 */
export function showFloatingPoints(container, target, points, multiplier) {
    if (!target || !target.parentNode || !container) return;
    
    const rect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    
    const feedback = document.createElement('div');
    feedback.className = 'floating-points';
    
    // Cor baseada no multiplicador
    let color = '#00f0ff';
    let glowColor = 'rgba(0, 240, 255, 0.8)';
    let size = '1.5rem';
    
    if (multiplier >= 5.0) {
        color = '#ffd700';
        glowColor = 'rgba(255, 215, 0, 0.8)';
        size = '2.5rem';
    } else if (multiplier >= 3.0) {
        color = '#ff00f0';
        glowColor = 'rgba(255, 0, 240, 0.8)';
        size = '2rem';
    } else if (multiplier >= 2.0) {
        color = '#b347ff';
        glowColor = 'rgba(179, 71, 255, 0.8)';
        size = '1.8rem';
    }
    
    feedback.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size};
        font-weight: 900;
        color: ${color};
        text-shadow: 0 0 20px ${glowColor}, 0 0 40px ${glowColor};
        z-index: 100;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: floatingPoints 1.2s ease-out forwards;
        white-space: nowrap;
        font-family: 'Montserrat', sans-serif;
    `;
    
    let text = `+${points}`;
    if (multiplier > 1.0) {
        text += ` <span style="font-size: 0.7em; opacity: 0.9;">x${multiplier.toFixed(1)}</span>`;
    }
    feedback.innerHTML = text;
    
    container.appendChild(feedback);
    
    // Remove após animação
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.animation = 'floatingPointsFadeOut 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 1200);
}

/**
 * Cria partículas ao clicar em alvo
 * @param {HTMLElement} container - Container do jogo
 * @param {HTMLElement} target - Alvo clicado
 * @param {string} color - Cor das partículas
 * @param {number} count - Quantidade de partículas
 */
export function createParticles(container, target, color = '#00f0ff', count = 8) {
    if (!target || !target.parentNode || !container) return;
    
    const rect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / count;
        const distance = 40 + Math.random() * 20;
        const duration = 0.6 + Math.random() * 0.4;
        const size = 4 + Math.random() * 4;
        
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: absolute;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
            z-index: 99;
            pointer-events: none;
            transform: translate(-50%, -50%);
        `;
        
        // Anima manualmente para evitar problemas com CSS custom properties
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(1, elapsed / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentX = centerX + (targetX - centerX) * easeOut;
            const currentY = centerY + (targetY - centerY) * easeOut;
            const currentScale = 1 - easeOut;
            const currentOpacity = 1 - easeOut;
            
            particle.style.left = `${currentX}px`;
            particle.style.top = `${currentY}px`;
            particle.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
            particle.style.opacity = currentOpacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (particle.parentNode) {
                    particle.remove();
                }
            }
        };
        
        requestAnimationFrame(animate);
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }
}

/**
 * Cria barra de progresso para próximo setor
 * @param {HTMLElement} container - Container onde adicionar a barra
 * @param {number} currentScore - Pontuação atual
 * @param {number} currentSector - Setor atual
 * @returns {HTMLElement} Elemento da barra de progresso
 */
export function createSectorProgressBar(container, currentScore, currentSector) {
    // Remove barra existente se houver
    const existing = container.querySelector('.sector-progress-bar');
    if (existing) {
        existing.remove();
    }
    
    const sectorThresholds = [0, 15, 40, 100, 250, 600];
    const maxSector = 6;
    
    const bossHud = document.getElementById('boss-hud');
    if (currentSector >= maxSector || (bossHud && bossHud.style.display !== 'none')) {
        // Já está no último setor ou há um chefe ativo
        return null;
    }
    
    const currentThreshold = sectorThresholds[currentSector - 1] || 0;
    const nextThreshold = sectorThresholds[currentSector] || 600;
    const progress = Math.min(100, ((currentScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
    
    // Encontra o elemento HUD para posicionar abaixo dele
    const hud = document.querySelector('.hud');
    const hudBottom = hud ? hud.getBoundingClientRect().bottom : 100;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'sector-progress-bar';
    progressContainer.style.cssText = `
        position: fixed;
        top: ${hudBottom + 8}px;
        left: 50%;
        transform: translateX(-50%);
        width: 85%;
        max-width: 350px;
        z-index: 50;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 6px;
        padding: 0.35rem 0.6rem;
        backdrop-filter: blur(8px);
        pointer-events: none;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: ${progress}%;
        height: 3px;
        background: linear-gradient(90deg, #00f0ff, #ff00f0);
        border-radius: 3px;
        transition: width 0.3s ease;
        box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
    `;
    
    const progressText = document.createElement('div');
    progressText.style.cssText = `
        text-align: center;
        font-size: 0.65rem;
        color: #888;
        margin-top: 0.25rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.8;
    `;
    progressText.textContent = `Setor ${currentSector + 1}: ${Math.round(progress)}%`;
    
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    
    // Adiciona ao body em vez do container para usar position: fixed
    document.body.appendChild(progressContainer);
    
    return progressContainer;
}

/**
 * Atualiza barra de progresso
 * @param {HTMLElement} container - Container do jogo
 * @param {number} currentScore - Pontuação atual
 * @param {number} currentSector - Setor atual
 */
export function updateSectorProgressBar(container, currentScore, currentSector) {
    // Remove barra existente (pode estar no body ou no container)
    const existing = document.querySelector('.sector-progress-bar');
    if (existing) {
        existing.remove();
    }
    createSectorProgressBar(container, currentScore, currentSector);
}

/**
 * Mostra animação de "Level Up" ao mudar de setor
 * @param {HTMLElement} container - Container do jogo
 * @param {number} newSector - Novo setor
 * @param {Function} callback - Callback após animação
 */
export function showLevelUpAnimation(container, newSector, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'level-up-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: levelUpFadeIn 0.3s ease-out;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        text-align: center;
        animation: levelUpPop 0.6s ease-out;
    `;
    
    content.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem; animation: levelUpIcon 1s ease-out;">⚡</div>
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #00f0ff; margin-bottom: 0.5rem; text-shadow: 0 0 30px #00f0ff;">
            SETOR ${newSector}
        </h2>
        <p style="font-size: 1.2rem; color: #a0a0a0; text-transform: uppercase; letter-spacing: 0.2em;">
            Nível Aumentado!
        </p>
    `;
    
    overlay.appendChild(content);
    container.appendChild(overlay);
    
    // Remove após animação
    setTimeout(() => {
        overlay.style.animation = 'levelUpFadeOut 0.5s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 500);
    }, 2000);
}

/**
 * Cria efeito de tela para power-up ativado
 * @param {HTMLElement} container - Container do jogo
 * @param {string} powerUpName - Nome do power-up
 * @param {string} color - Cor do efeito
 * @param {number} duration - Duração em ms
 */
export function showPowerUpScreenEffect(container, powerUpName, color = '#00f0ff', duration = 500) {
    const effect = document.createElement('div');
    effect.className = 'powerup-screen-effect';
    effect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${color}20;
        border: 3px solid ${color};
        z-index: 80;
        pointer-events: none;
        animation: powerUpScreenEffect ${duration}ms ease-out;
    `;
    
    const text = document.createElement('div');
    text.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: 900;
        color: ${color};
        text-shadow: 0 0 30px ${color};
        text-transform: uppercase;
        letter-spacing: 0.2em;
        animation: powerUpText 0.8s ease-out;
    `;
    text.textContent = powerUpName;
    
    effect.appendChild(text);
    container.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, duration);
}

/**
 * Cria efeito de combo especial
 * @param {HTMLElement} container - Container do jogo
 * @param {number} combo - Valor do combo
 */
export function showComboEffect(container, combo) {
    if (combo < 10) return; // Só mostra para combos altos
    
    const milestones = [10, 20, 30, 50, 75, 100];
    if (!milestones.includes(combo)) return;
    
    const effect = document.createElement('div');
    effect.className = 'combo-effect';
    effect.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 90;
        pointer-events: none;
        text-align: center;
        animation: comboEffect 1s ease-out;
    `;
    
    let color = '#00f0ff';
    let text = 'COMBO!';
    
    if (combo >= 100) {
        color = '#ffd700';
        text = 'COMBO LENDÁRIO!';
    } else if (combo >= 50) {
        color = '#ff00f0';
        text = 'COMBO ÉPICO!';
    } else if (combo >= 30) {
        color = '#b347ff';
        text = 'COMBO INCRÍVEL!';
    }
    
    effect.innerHTML = `
        <div style="font-size: 4rem; font-weight: 900; color: ${color}; text-shadow: 0 0 40px ${color}; margin-bottom: 0.5rem;">
            ${text}
        </div>
        <div style="font-size: 2rem; font-weight: 700; color: ${color}; text-shadow: 0 0 20px ${color};">
            ${combo}x
        </div>
    `;
    
    container.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 1000);
}

/**
 * Cria efeito de ripple ao clicar
 * @param {HTMLElement} container - Container do jogo
 * @param {HTMLElement} target - Alvo clicado
 * @param {string} color - Cor do ripple
 */
export function createRippleEffect(container, target, color = '#00f0ff') {
    if (!target || !target.parentNode || !container) return;
    
    const rect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        border: 2px solid ${color};
        z-index: 98;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: rippleExpand 0.6s ease-out;
    `;
    
    container.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}


/**
 * Sistema de Movimento de Alvos - Nexus Prism
 * Gerencia movimentos dinâmicos, rotação, pulos e efeitos especiais
 */

/**
 * Aplica movimento dinâmico a um alvo baseado nas mecânicas do setor
 * @param {HTMLElement} target - Elemento do alvo
 * @param {Object} mechanics - Mecânicas do setor
 * @param {HTMLElement} container - Container do jogo
 */
export function applyTargetMovement(target, mechanics, container) {
    if (!target || !mechanics) return;
    
    // Limpa movimentos anteriores
    if (target.dataset.movementInterval) {
        clearInterval(parseInt(target.dataset.movementInterval));
    }
    if (target.dataset.rotationInterval) {
        clearInterval(parseInt(target.dataset.rotationInterval));
    }
    if (target.dataset.blinkInterval) {
        clearInterval(parseInt(target.dataset.blinkInterval));
    }
    
    // Movimento contínuo (Setor 3+)
    if (mechanics.movingTargets) {
        startContinuousMovement(target, container, mechanics);
    }
    
    // Rotação (Setor 5+)
    if (mechanics.rotationSpeed) {
        startRotation(target, mechanics.rotationSpeed);
    }
    
    // Pulos (Setor 5+)
    if (mechanics.jumpFrequency) {
        startJumping(target, mechanics.jumpFrequency);
    }
    
    // Mudança de posição (Setor 5+)
    if (mechanics.positionChangeFrequency) {
        startPositionChanges(target, container, mechanics.positionChangeFrequency);
    }
    
    // Piscar/Desaparecer (Setor 6)
    if (mechanics.blinkFrequency) {
        startBlinking(target, mechanics);
    }
}

/**
 * Inicia movimento contínuo do alvo
 */
function startContinuousMovement(target, container, mechanics) {
    const speed = mechanics.movementSpeed || 2; // pixels por frame
    const direction = {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed
    };
    
    const moveInterval = setInterval(() => {
        if (!target.parentNode || target.style.display === 'none') {
            clearInterval(moveInterval);
            return;
        }
        
        const currentLeft = parseFloat(target.style.left) || 0;
        const currentTop = parseFloat(target.style.top) || 0;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const targetWidth = target.offsetWidth;
        const targetHeight = target.offsetHeight;
        
        // Calcula nova posição
        let newLeft = currentLeft + direction.x;
        let newTop = currentTop + direction.y;
        
        // Bounce nas bordas
        if (newLeft <= 0 || newLeft + targetWidth >= containerWidth) {
            direction.x *= -1;
            newLeft = Math.max(0, Math.min(newLeft, containerWidth - targetWidth));
        }
        if (newTop <= 0 || newTop + targetHeight >= containerHeight) {
            direction.y *= -1;
            newTop = Math.max(0, Math.min(newTop, containerHeight - targetHeight));
        }
        
        target.style.left = `${newLeft}px`;
        target.style.top = `${newTop}px`;
    }, 16); // ~60fps
    
    target.dataset.movementInterval = moveInterval;
}

/**
 * Inicia rotação do alvo
 */
function startRotation(target, speed) {
    let rotation = 0;
    
    const rotationInterval = setInterval(() => {
        if (!target.parentNode || target.style.display === 'none') {
            clearInterval(rotationInterval);
            return;
        }
        
        rotation += speed;
        target.style.transform = `rotate(${rotation}deg)`;
    }, 16); // ~60fps
    
    target.dataset.rotationInterval = rotationInterval;
}

/**
 * Inicia pulos do alvo
 */
function startJumping(target, frequency) {
    const jumpInterval = setInterval(() => {
        if (!target.parentNode || target.style.display === 'none') {
            clearInterval(jumpInterval);
            return;
        }
        
        // Animação de pulo
        target.style.transition = 'transform 0.2s ease-out';
        target.style.transform = 'translateY(-20px) scale(1.1)';
        
        setTimeout(() => {
            if (target.parentNode) {
                target.style.transform = 'translateY(0) scale(1)';
            }
        }, 200);
    }, frequency);
    
    target.dataset.jumpInterval = jumpInterval;
}

/**
 * Inicia mudanças de posição aleatórias
 */
function startPositionChanges(target, container, frequency) {
    const positionInterval = setInterval(() => {
        if (!target.parentNode || target.style.display === 'none') {
            clearInterval(positionInterval);
            return;
        }
        
        // Teleporta para nova posição aleatória
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const targetWidth = target.offsetWidth;
        const targetHeight = target.offsetHeight;
        
        const maxX = Math.max(0, containerWidth - targetWidth);
        const maxY = Math.max(0, containerHeight - targetHeight);
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        target.style.transition = 'opacity 0.1s ease';
        target.style.opacity = '0.5';
        
        setTimeout(() => {
            if (target.parentNode) {
                target.style.left = `${newX}px`;
                target.style.top = `${newY}px`;
                target.style.opacity = '1';
            }
        }, 100);
    }, frequency);
    
    target.dataset.positionInterval = positionInterval;
}

/**
 * Inicia efeito de piscar/desaparecer
 */
function startBlinking(target, mechanics) {
    const blinkInterval = setInterval(() => {
        if (!target.parentNode || target.style.display === 'none') {
            clearInterval(blinkInterval);
            return;
        }
        
        // Chance de desaparecer temporariamente
        if (mechanics.disappearChance && Math.random() < mechanics.disappearChance) {
            target.style.opacity = '0';
            target.style.pointerEvents = 'none';
            
            setTimeout(() => {
                if (target.parentNode && target.style.display !== 'none') {
                    target.style.opacity = target.dataset.originalOpacity || '1';
                    target.style.pointerEvents = 'auto';
                }
            }, mechanics.reappearDelay || 1000);
        } else {
            // Piscar normal
            target.style.opacity = '0.3';
            setTimeout(() => {
                if (target.parentNode) {
                    target.style.opacity = target.dataset.originalOpacity || '1';
                }
            }, 200);
        }
    }, mechanics.blinkFrequency);
    
    target.dataset.blinkInterval = blinkInterval;
}

/**
 * Limpa todos os movimentos de um alvo
 */
export function clearTargetMovement(target) {
    if (target.dataset.movementInterval) {
        clearInterval(parseInt(target.dataset.movementInterval));
        target.dataset.movementInterval = null;
    }
    if (target.dataset.rotationInterval) {
        clearInterval(parseInt(target.dataset.rotationInterval));
        target.dataset.rotationInterval = null;
    }
    if (target.dataset.jumpInterval) {
        clearInterval(parseInt(target.dataset.jumpInterval));
        target.dataset.jumpInterval = null;
    }
    if (target.dataset.positionInterval) {
        clearInterval(parseInt(target.dataset.positionInterval));
        target.dataset.positionInterval = null;
    }
    if (target.dataset.blinkInterval) {
        clearInterval(parseInt(target.dataset.blinkInterval));
        target.dataset.blinkInterval = null;
    }
    
    // Reseta transformações
    target.style.transform = '';
    target.style.transition = '';
}


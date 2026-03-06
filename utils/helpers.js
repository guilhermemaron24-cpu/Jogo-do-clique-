/**
 * Gera posição aleatória para elemento dentro do container
 * @param {HTMLElement} container - Container pai (deve ter position: relative)
 * @param {HTMLElement} element - Elemento a posicionar (deve ter position: absolute)
 */
export function randomPosition(container, element) {
    if (!container || !element) {
        console.warn('randomPosition: container ou element inválido');
        return;
    }
    
    // Usa offsetWidth/offsetHeight para dimensões reais do container
    const containerWidth = container.offsetWidth || container.clientWidth;
    const containerHeight = container.offsetHeight || container.clientHeight;
    
    if (containerWidth === 0 || containerHeight === 0) {
        console.warn('randomPosition: container sem dimensões válidas');
        return;
    }
    
    // Força o elemento a ter display block para calcular dimensões
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    
    if (originalDisplay === 'none') {
        element.style.display = 'block';
    }
    if (originalVisibility === 'hidden') {
        element.style.visibility = 'hidden'; // Mantém hidden mas permite cálculo
    }
    
    // Usa offsetWidth/offsetHeight do elemento (já com tamanho definido)
    // Se não conseguir, usa o valor do style.width/height
    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;
    
    if (elementWidth === 0 || elementHeight === 0) {
        const widthStr = element.style.width || '80px';
        const heightStr = element.style.height || '80px';
        elementWidth = parseInt(widthStr) || 80;
        elementHeight = parseInt(heightStr) || 80;
    }
    
    // Calcula posições máximas garantindo que o elemento fique totalmente dentro
    const maxX = Math.max(0, containerWidth - elementWidth);
    const maxY = Math.max(0, containerHeight - elementHeight);
    
    // Se o elemento for maior que o container, centraliza
    if (maxX < 0 || maxY < 0) {
        element.style.left = `${Math.max(0, (containerWidth - elementWidth) / 2)}px`;
        element.style.top = `${Math.max(0, (containerHeight - elementHeight) / 2)}px`;
        return;
    }
    
    // Gera posição aleatória dentro dos limites
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    // Garante que o elemento está posicionado absolutamente
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    
    // Validação final: garante que não saiu dos limites
    const finalX = parseFloat(element.style.left) || 0;
    const finalY = parseFloat(element.style.top) || 0;
    
    if (finalX < 0 || finalX > maxX || finalY < 0 || finalY > maxY) {
        // Se ainda assim saiu, força para dentro
        element.style.left = `${clamp(finalX, 0, maxX)}px`;
        element.style.top = `${clamp(finalY, 0, maxY)}px`;
    }
}

/**
 * Limita valor entre min e max
 * @param {number} value - Valor a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor limitado
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Formata segundos em MM:SS
 * @param {number} seconds - Segundos totais
 * @returns {string} Tempo formatado
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Testes básicos (executar no console)
if (typeof window !== 'undefined') {
    console.log('Helpers carregados');
    console.log('formatTime(125):', formatTime(125)); // "02:05"
    console.log('clamp(150, 0, 100):', clamp(150, 0, 100)); // 100
}


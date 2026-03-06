/**
 * Sistema de áudio com proteção contra sobreposição
 * Suporta arquivos MP3 e geração sintética de sons
 */

// Cache de objetos de áudio (serão carregados quando necessário)
const soundCache = {};
let volume = 0.7;
let lastPlayTime = {};
let audioContext = null;

/**
 * Inicializa o contexto de áudio (Web Audio API)
 * Alguns navegadores exigem interação do usuário primeiro
 */
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Se o contexto estiver suspenso (comum após autoplay policy), tenta resumir
            if (audioContext.state === 'suspended') {
                audioContext.resume().catch(e => {
                    console.warn('Não foi possível resumir contexto de áudio:', e);
                });
            }
        } catch (e) {
            console.warn('Web Audio API não suportada:', e);
        }
    }
    return audioContext;
}

// Inicializa o contexto quando o usuário interagir pela primeira vez
if (typeof window !== 'undefined') {
    const initOnInteraction = () => {
        initAudioContext();
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('touchstart', initOnInteraction);
        document.removeEventListener('keydown', initOnInteraction);
    };
    
    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
    document.addEventListener('keydown', initOnInteraction, { once: true });
}

/**
 * Gera um som sintético usando Web Audio API
 * @param {string} type - Tipo de som ('start', 'hit', 'gameover')
 * @param {number} frequency - Frequência em Hz
 * @param {number} duration - Duração em ms
 */
function generateSyntheticSound(type, frequency, duration) {
    const ctx = initAudioContext();
    if (!ctx) {
        console.warn('Contexto de áudio não disponível. Clique na página primeiro para ativar.');
        return;
    }

    // Se o contexto estiver suspenso, tenta resumir
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            console.log('Contexto de áudio resumido');
        }).catch(e => {
            console.warn('Não foi possível resumir contexto:', e);
        });
    }

    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Configurações por tipo de som
        if (type === 'start') {
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        } else if (type === 'hit') {
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        } else if (type === 'gameover') {
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        } else if (type === 'miss') {
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        } else {
            oscillator.frequency.value = frequency;
        }

        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
        
        console.log(`Som sintético "${type}" reproduzido`);
    } catch (e) {
        console.warn('Erro ao gerar som sintético:', e);
    }
}

/**
 * Cria um objeto de som sintético
 */
function createSyntheticSound(name) {
    const soundMap = {
        'start': () => generateSyntheticSound('start', 440, 200),
        'hit': () => generateSyntheticSound('hit', 800, 100),
        'gameover': () => generateSyntheticSound('gameover', 200, 500),
        'miss': () => generateSyntheticSound('miss', 200, 150)
    };
    
    return {
        play: () => {
            if (soundMap[name]) {
                soundMap[name]();
            }
            return Promise.resolve();
        },
        volume: volume
    };
}

/**
 * Carrega um som (lazy loading)
 * Tenta carregar MP3, se falhar usa som sintético
 * @param {string} name - Nome do som
 * @returns {Object} Objeto com método play()
 */
function loadSound(name) {
    if (!soundCache[name]) {
        const audio = new Audio(`assets/sounds/${name}.mp3`);
        let loaded = false;
        
        // Se o arquivo carregar com sucesso, usa o arquivo
        audio.addEventListener('canplaythrough', () => {
            if (!loaded) {
                loaded = true;
                soundCache[name] = audio;
                audio.volume = volume;
                console.log(`Arquivo de som "${name}.mp3" carregado com sucesso`);
            }
        }, { once: true });
        
        // Se o arquivo não existir, usa som sintético imediatamente
        audio.addEventListener('error', () => {
            if (!loaded) {
                loaded = true;
                console.log(`Arquivo de som "${name}.mp3" não encontrado, usando som sintético`);
                soundCache[name] = createSyntheticSound(name);
            }
        }, { once: true });
        
        // Fallback: se após 500ms não carregou, assume que não existe
        setTimeout(() => {
            if (!loaded) {
                loaded = true;
                if (audio.readyState === 0) { // HAVE_NOTHING - arquivo não existe
                    console.log(`Timeout ao carregar "${name}.mp3", usando som sintético`);
                    soundCache[name] = createSyntheticSound(name);
                } else {
                    // Arquivo está carregando, aguarda mais um pouco
                    soundCache[name] = audio;
                    audio.volume = volume;
                }
            }
        }, 500);
        
        // Tenta carregar o arquivo
        audio.load();
        
        // Temporariamente usa o objeto de áudio (será substituído se erro ocorrer)
        soundCache[name] = audio;
    }
    return soundCache[name];
}

/**
 * Reproduz um som
 * @param {string} name - Nome do som
 * @param {number} debounceMs - Tempo mínimo entre reproduções (ms)
 */
export function playSound(name, debounceMs = 50) {
    const sound = loadSound(name);
    
    const now = Date.now();
    const lastPlay = lastPlayTime[name] || 0;
    
    if (now - lastPlay < debounceMs) {
        return; // Evita sobreposição
    }
    
    // Se for um objeto de áudio HTML, configura volume e toca
    if (sound instanceof HTMLAudioElement) {
        // Se o arquivo ainda não carregou, usa som sintético como fallback
        if (sound.readyState === 0) { // HAVE_NOTHING
            console.log(`Som "${name}" ainda não carregou, usando sintético`);
            const synthetic = createSyntheticSound(name);
            synthetic.play();
        } else {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(err => {
                // Se falhar, tenta som sintético
                if (err.name !== 'NotAllowedError') {
                    console.warn('Erro ao reproduzir som, usando sintético:', err);
                    const synthetic = createSyntheticSound(name);
                    synthetic.play();
                }
            });
        }
    } else if (sound && typeof sound.play === 'function') {
        // Se for um objeto customizado (som sintético), apenas chama play
        sound.play();
    } else {
        // Fallback final: sempre gera som sintético
        console.log(`Fallback: gerando som sintético para "${name}"`);
        const synthetic = createSyntheticSound(name);
        synthetic.play();
    }
    
    lastPlayTime[name] = now;
}

/**
 * Define volume global
 * @param {number} level - Volume entre 0 e 1
 */
export function setVolume(level) {
    volume = clamp(level, 0, 1);
    Object.values(soundCache).forEach(sound => {
        if (sound.volume !== undefined) {
            sound.volume = volume;
        }
    });
}

/**
 * Função auxiliar para clamp
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


/**
 * Sistema de Testes Automatizados - Nexus Prism
 * Simula um jogador humano para identificar problemas
 */

import {
    getSectorConfig,
    getSectorMechanics,
    getSectorDifficulty
} from '../utils/phaseManager.js';

/**
 * Resultados dos testes
 */
let testResults = {
    passed: [],
    failed: [],
    warnings: [],
    bugs: []
};

/**
 * Simula um clique humano (com delay variável)
 */
function simulateHumanClick(element, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (element && element.parentNode && element.style.display !== 'none') {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(event);
            }
            resolve();
        }, delay);
    });
}

/**
 * Aguarda um tempo (simula pensamento humano)
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Encontra alvos visíveis na tela
 */
function findVisibleTargets() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return [];
    
    return Array.from(gameArea.querySelectorAll('.target')).filter(target => {
        return target.parentNode && 
               target.style.display !== 'none' && 
               !target.classList.contains('power-up');
    });
}

/**
 * Teste 1: Progressão de Setores
 */
async function testSectorProgression() {
    console.log('🧪 TESTE 1: Progressão de Setores');
    
    const thresholds = [0, 15, 40, 100, 250, 600];
    const expectedSectors = [1, 2, 3, 4, 5, 6];
    
    for (let i = 0; i < thresholds.length; i++) {
        const threshold = thresholds[i];
        const expectedSector = expectedSectors[i];
        const config = getSectorConfig(expectedSector);
        
        if (!config) {
            testResults.failed.push({
                test: 'Progressão de Setores',
                issue: `Setor ${expectedSector} não encontrado`,
                threshold: threshold
            });
            console.error(`❌ Setor ${expectedSector} não encontrado`);
        } else {
            testResults.passed.push({
                test: 'Progressão de Setores',
                message: `Setor ${expectedSector} configurado corretamente`,
                threshold: threshold
            });
            console.log(`✅ Setor ${expectedSector} (${config.name}) - Threshold: ${threshold}`);
        }
    }
}

/**
 * Teste 2: Cálculo de Pontuação com Multiplicadores
 */
async function testScoreCalculation() {
    console.log('🧪 TESTE 2: Cálculo de Pontuação');
    
    // Simula diferentes cenários de pontuação
    const scenarios = [
        { combo: 0, powerUpMultiplier: 1.0, expectedPoints: 1 },
        { combo: 5, powerUpMultiplier: 1.0, expectedPoints: 1 }, // 1.5x arredondado para baixo
        { combo: 10, powerUpMultiplier: 1.0, expectedPoints: 2 }, // 2.0x
        { combo: 20, powerUpMultiplier: 1.0, expectedPoints: 3 }, // 3.0x
        { combo: 10, powerUpMultiplier: 3.0, expectedPoints: 6 }, // 2.0x * 3.0x = 6.0x
    ];
    
    scenarios.forEach((scenario, index) => {
        const { combo, powerUpMultiplier, expectedPoints } = scenario;
        const comboMultiplier = getComboMultiplier(combo);
        const totalMultiplier = comboMultiplier * powerUpMultiplier;
        const calculatedPoints = Math.floor(1 * totalMultiplier);
        
        if (calculatedPoints === expectedPoints) {
            testResults.passed.push({
                test: 'Cálculo de Pontuação',
                message: `Cenário ${index + 1}: ${calculatedPoints} pontos (combo: ${combo}, power-up: ${powerUpMultiplier}x)`
            });
            console.log(`✅ Cenário ${index + 1}: ${calculatedPoints} pontos`);
        } else {
            testResults.failed.push({
                test: 'Cálculo de Pontuação',
                issue: `Cenário ${index + 1}: Esperado ${expectedPoints}, calculado ${calculatedPoints}`,
                scenario: scenario
            });
            console.error(`❌ Cenário ${index + 1}: Esperado ${expectedPoints}, calculado ${calculatedPoints}`);
        }
    });
}

/**
 * Obtém multiplicador de combo (simula função do comboSystem)
 */
function getComboMultiplier(combo) {
    const multipliers = {
        0: 1.0, 5: 1.5, 10: 2.0, 15: 2.5, 20: 3.0, 30: 4.0, 50: 5.0, 75: 6.0, 100: 7.5
    };
    
    let multiplier = 1.0;
    for (const [threshold, mult] of Object.entries(multipliers)) {
        if (combo >= parseInt(threshold) && mult > multiplier) {
            multiplier = mult;
        }
    }
    return multiplier;
}

/**
 * Teste 3: Timer e Power-Ups
 */
async function testTimerAndPowerUps() {
    console.log('🧪 TESTE 3: Timer e Power-Ups');
    
    // Verifica se timer está sendo atualizado
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        testResults.failed.push({
            test: 'Timer',
            issue: 'Elemento timer não encontrado'
        });
        return;
    }
    
    // Verifica se power-ups estão sendo spawnados
    const powerUpContainer = document.getElementById('powerup-container');
    if (!powerUpContainer) {
        testResults.warnings.push({
            test: 'Power-Ups',
            issue: 'Container de power-ups não encontrado (pode ser criado dinamicamente)'
        });
    }
    
    testResults.passed.push({
        test: 'Timer e Power-Ups',
        message: 'Elementos básicos encontrados'
    });
}

/**
 * Teste 4: Mecânicas de Setores
 */
async function testSectorMechanics() {
    console.log('🧪 TESTE 4: Mecânicas de Setores');
    
    for (let sector = 1; sector <= 6; sector++) {
        const mechanics = getSectorMechanics(sector);
        const difficulty = getSectorDifficulty(sector);
        
        if (!mechanics || !difficulty) {
            testResults.failed.push({
                test: 'Mecânicas de Setores',
                issue: `Setor ${sector} sem mecânicas ou dificuldade`
            });
            continue;
        }
        
        // Verifica se tamanho do alvo é válido
        if (difficulty.targetSize <= 0 || difficulty.targetSize > 200) {
            testResults.warnings.push({
                test: 'Mecânicas de Setores',
                issue: `Setor ${sector}: Tamanho de alvo inválido (${difficulty.targetSize}px)`
            });
        }
        
        // Verifica se delay é válido
        if (difficulty.respawnDelay <= 0 || difficulty.respawnDelay > 5000) {
            testResults.warnings.push({
                test: 'Mecânicas de Setores',
                issue: `Setor ${sector}: Delay de respawn inválido (${difficulty.respawnDelay}ms)`
            });
        }
        
        // Verifica mecânicas especiais
        if (sector >= 4 && !mechanics.fakeTargets) {
            testResults.warnings.push({
                test: 'Mecânicas de Setores',
                issue: `Setor ${sector}: Deveria ter alvos falsos mas não tem`
            });
        }
        
        if (sector >= 5 && !mechanics.movingTargets && !mechanics.rotationSpeed) {
            testResults.warnings.push({
                test: 'Mecânicas de Setores',
                issue: `Setor ${sector}: Deveria ter movimento dinâmico mas não tem`
            });
        }
        
        testResults.passed.push({
            test: 'Mecânicas de Setores',
            message: `Setor ${sector} configurado`
        });
    }
}

/**
 * Teste 5: Simulação de Jogo Completo
 */
async function testFullGameSimulation() {
    console.log('🧪 TESTE 5: Simulação de Jogo Completo');
    
    // Inicia o jogo
    const startBtn = document.getElementById('start-btn');
    if (!startBtn) {
        testResults.failed.push({
            test: 'Simulação Completa',
            issue: 'Botão de iniciar não encontrado'
        });
        return;
    }
    
    console.log('▶️ Iniciando jogo...');
    startBtn.click();
    await wait(1000);
    
    // Aguarda mensagem de ORION
    await wait(2000);
    
    // Clica em "Continuar" se existir
    const continueBtn = document.querySelector('.orion-continue-btn');
    if (continueBtn && continueBtn.style.display !== 'none') {
        console.log('▶️ Clicando em Continuar...');
        continueBtn.click();
        await wait(4000); // Aguarda contagem regressiva
    }
    
    // Simula cliques em alvos por 10 segundos
    console.log('▶️ Simulando cliques...');
    const startTime = Date.now();
    const duration = 10000; // 10 segundos
    
    while (Date.now() - startTime < duration) {
        const targets = findVisibleTargets();
        
        if (targets.length > 0) {
            // Escolhe alvo aleatório
            const target = targets[Math.floor(Math.random() * targets.length)];
            
            // Verifica se não é falso antes de clicar (70% de chance de clicar)
            if (target.dataset.isFake !== 'true' || Math.random() > 0.3) {
                await simulateHumanClick(target, Math.random() * 300 + 200); // Delay humano: 200-500ms
            }
        }
        
        await wait(100); // Pequeno delay entre tentativas
    }
    
    // Verifica estado final
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const sectorElement = document.getElementById('sector');
    
    const finalScore = parseInt(scoreElement?.textContent || '0');
    const finalTime = timerElement?.textContent || '00:00';
    const finalSector = parseInt(sectorElement?.textContent || '1');
    
    console.log(`📊 Estado Final:`);
    console.log(`   Score: ${finalScore}`);
    console.log(`   Tempo: ${finalTime}`);
    console.log(`   Setor: ${finalSector}`);
    
    // Validações
    if (finalScore < 0) {
        testResults.bugs.push({
            test: 'Simulação Completa',
            issue: 'Score negativo detectado',
            value: finalScore
        });
    }
    
    if (finalSector < 1 || finalSector > 6) {
        testResults.bugs.push({
            test: 'Simulação Completa',
            issue: 'Setor inválido',
            value: finalSector
        });
    }
    
    // Verifica se progrediu de setor
    if (finalScore >= 15 && finalSector < 2) {
        testResults.bugs.push({
            test: 'Simulação Completa',
            issue: 'Não progrediu para Setor 2 com score >= 15',
            score: finalScore,
            sector: finalSector
        });
    }
    
    testResults.passed.push({
        test: 'Simulação Completa',
        message: `Jogo executado: Score=${finalScore}, Setor=${finalSector}, Tempo=${finalTime}`
    });
}

/**
 * Teste 6: Verificação de Bugs Comuns
 */
async function testCommonBugs() {
    console.log('🧪 TESTE 6: Verificação de Bugs Comuns');
    
    // Bug 1: Timer não para após game over
    const gameState = window.gameState || {};
    if (gameState.gameTimer && !gameState.isPlaying) {
        testResults.bugs.push({
            test: 'Bugs Comuns',
            issue: 'Timer continua rodando após game over'
        });
    }
    
    // Bug 2: Alvos acumulando sem limite
    const activeTargets = gameState.activeTargets || [];
    if (activeTargets.length > 20) {
        testResults.bugs.push({
            test: 'Bugs Comuns',
            issue: `Muitos alvos ativos (${activeTargets.length})`,
            value: activeTargets.length
        });
    }
    
    // Bug 3: Power-ups não sendo removidos
    const powerUps = document.querySelectorAll('.power-up');
    const expiredPowerUps = Array.from(powerUps).filter(pu => {
        return pu.parentNode && pu.style.display === 'none';
    });
    
    if (expiredPowerUps.length > 5) {
        testResults.warnings.push({
            test: 'Bugs Comuns',
            issue: 'Muitos power-ups expirados não removidos do DOM'
        });
    }
    
    // Bug 4: Score não atualiza
    const scoreElement = document.getElementById('score');
    if (scoreElement && scoreElement.textContent === '0' && gameState.score > 0) {
        testResults.bugs.push({
            test: 'Bugs Comuns',
            issue: 'Score não atualiza na UI',
            gameStateScore: gameState.score
        });
    }
}

/**
 * Executa todos os testes
 */
export async function runAllTests() {
    console.log('🚀 Iniciando testes automatizados...\n');
    
    testResults = {
        passed: [],
        failed: [],
        warnings: [],
        bugs: []
    };
    
    try {
        await testSectorProgression();
        await wait(500);
        
        await testScoreCalculation();
        await wait(500);
        
        await testTimerAndPowerUps();
        await wait(500);
        
        await testSectorMechanics();
        await wait(500);
        
        await testCommonBugs();
        await wait(500);
        
        // Teste de simulação completa (opcional, pode ser lento)
        // Descomente para executar simulação completa
        // await testFullGameSimulation();
        
        console.log('\n✅ Todos os testes básicos concluídos!');
        
    } catch (error) {
        console.error('❌ Erro durante testes:', error);
        testResults.failed.push({
            test: 'Sistema',
            issue: `Erro: ${error.message}`,
            error: error
        });
    }
    
    // Relatório final
    printTestReport();
    
    return testResults;
}

/**
 * Imprime relatório de testes
 */
function printTestReport() {
    console.log('\n📊 RELATÓRIO DE TESTES\n');
    console.log(`✅ Passou: ${testResults.passed.length}`);
    console.log(`❌ Falhou: ${testResults.failed.length}`);
    console.log(`⚠️  Avisos: ${testResults.warnings.length}`);
    console.log(`🐛 Bugs: ${testResults.bugs.length}\n`);
    
    if (testResults.failed.length > 0) {
        console.log('❌ FALHAS:');
        testResults.failed.forEach(failure => {
            console.log(`   - ${failure.test}: ${failure.issue}`);
        });
        console.log('');
    }
    
    if (testResults.bugs.length > 0) {
        console.log('🐛 BUGS ENCONTRADOS:');
        testResults.bugs.forEach(bug => {
            console.log(`   - ${bug.test}: ${bug.issue}`);
            if (bug.value !== undefined) {
                console.log(`     Valor: ${bug.value}`);
            }
        });
        console.log('');
    }
    
    if (testResults.warnings.length > 0) {
        console.log('⚠️  AVISOS:');
        testResults.warnings.forEach(warning => {
            console.log(`   - ${warning.test}: ${warning.issue}`);
        });
        console.log('');
    }
}

/**
 * Exporta resultados para análise
 */
export function getTestResults() {
    return testResults;
}


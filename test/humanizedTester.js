/**
 * Testes Humanizados - Simula um jogador real
 * Identifica bugs, erros e problemas de UX
 */

let bugReport = {
    bugs: [],
    errors: [],
    warnings: [],
    passed: []
};

function logBug(title, description, severity = 'HIGH') {
    console.log(`🐛 BUG [${severity}]: ${title}`);
    console.log(`   ${description}`);
    bugReport.bugs.push({ title, description, severity });
}

function logError(title, description) {
    console.log(`❌ ERROR: ${title}`);
    console.log(`   ${description}`);
    bugReport.errors.push({ title, description });
}

function logWarning(title, description) {
    console.log(`⚠️ WARNING: ${title}`);
    console.log(`   ${description}`);
    bugReport.warnings.push({ title, description });
}

function logPass(title) {
    console.log(`✅ PASS: ${title}`);
    bugReport.passed.push(title);
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickElement(selector, delay = 500) {
    const element = document.querySelector(selector);
    if (!element) {
        logError(`Element not found: ${selector}`, 'Could not locate element to click');
        return false;
    }
    
    if (element.style.display === 'none' || element.offsetParent === null) {
        logWarning(`Element hidden: ${selector}`, 'Element is hidden/not displayed');
        return false;
    }
    
    element.click();
    await wait(delay);
    return true;
}

async function testInitialScreen() {
    console.log('\n📋 TEST 1: Initial Screen Load');
    
    // Verificar se elementos iniciais existem
    const titleEl = document.querySelector('.game-title');
    const startBtn = document.querySelector('#start-btn');
    const hudItems = document.querySelectorAll('.hud-item');
    
    if (titleEl && titleEl.textContent === 'NEXUS PRISM') {
        logPass('Game title displays correctly');
    } else {
        logError('Game title not found', 'Title element or text mismatch');
    }
    
    if (startBtn && startBtn.style.display !== 'none') {
        logPass('Start button is visible');
    } else {
        logError('Start button hidden', 'Start button should be visible on initial load');
    }
    
    if (hudItems.length === 3) {
        logPass('HUD displays 3 items (Energy, Sector, Time)');
    } else {
        logWarning('HUD item count mismatch', `Expected 3, got ${hudItems.length}`);
    }
}

async function testGameStart() {
    console.log('\n🎮 TEST 2: Game Start');
    
    const startBtn = document.querySelector('#start-btn');
    if (!startBtn) {
        logError('Start button not found', 'Cannot proceed with game start test');
        return;
    }
    
    console.log('   Clicking start button...');
    await clickElement('#start-btn', 2000);
    
    // Aguardar mensagem ORION aparecer
    await wait(1000);
    
    const orionMessage = document.querySelector('.orion-message-box');
    const continueBtn = document.querySelector('.orion-continue-btn');
    
    if (orionMessage && continueBtn) {
        logPass('ORION message appears after game start');
    } else {
        logError('ORION message missing', 'Continue button or message box not found');
    }
}

async function testContinueButton() {
    console.log('\n⏱️ TEST 3: Continue Button & Countdown');
    
    const continueBtn = document.querySelector('.orion-continue-btn');
    if (!continueBtn) {
        logWarning('Continue button not found', 'Skipping continue test');
        return;
    }
    
    console.log('   Clicking continue button...');
    await clickElement('.orion-continue-btn', 500);
    
    // Verificar se countdown aparece
    const countdownEl = document.querySelector('.countdown-display');
    if (countdownEl) {
        logPass('Countdown display appears');
    } else {
        logBug('Countdown not shown', 'After clicking continue, countdown should appear', 'MEDIUM');
    }
    
    // Verificar se o botão foi removido
    const btnAfterClick = document.querySelector('.orion-continue-btn');
    if (!btnAfterClick) {
        logPass('Continue button removed after click');
    } else {
        if (btnAfterClick.style.display === 'none') {
            logWarning('Continue button hidden instead of removed', 'Button is hidden, not removed from DOM');
        } else {
            logBug('Continue button still visible', 'Button should be removed or hidden after click', 'HIGH');
        }
    }
    
    // Aguardar countdown terminar
    console.log('   Waiting for countdown to complete...');
    await wait(4000);
}

async function testGameplay() {
    console.log('\n🎯 TEST 4: Gameplay Mechanics');
    
    // Aguardar alvo aparecer
    await wait(1000);
    
    const target = document.querySelector('#target');
    const timer = document.querySelector('#timer');
    const energyCounter = document.querySelector('#score');
    
    if (target && target.style.display !== 'none') {
        logPass('Target appears during gameplay');
    } else {
        logBug('Target not visible', 'Target element should be visible after countdown', 'HIGH');
    }
    
    if (timer) {
        const timerText = timer.textContent;
        if (timerText && timerText !== '00:00') {
            logPass('Timer is running');
        } else {
            logBug('Timer not running', 'Timer should be counting down, shows: ' + timerText, 'HIGH');
        }
    }
    
    // Simular alguns cliques no alvo
    if (target && target.style.display !== 'none') {
        for (let i = 0; i < 5; i++) {
            target.click();
            await wait(200);
        }
        
        const energy = energyCounter.textContent;
        if (energy && energy !== '0') {
            logPass('Energy counter increases on target click');
        } else {
            logBug('Energy not increasing', 'Clicks on target should increase energy counter', 'HIGH');
        }
    }
}

async function testMenuInteraction() {
    console.log('\n📱 TEST 5: Menu Interaction');
    
    // Aguardar o jogo estar realmente rodando (botão menu aparecer)
    let menuBtn = null;
    for (let i = 0; i < 20; i++) {
        menuBtn = document.querySelector('#menu-btn');
        if (menuBtn && menuBtn.style.display !== 'none') break;
        await wait(100);
    }
    
    if (!menuBtn || menuBtn.style.display === 'none') {
        logWarning('Menu button not visible during gameplay', 'Cannot test menu interaction');
        return;
    }
    
    console.log('   Clicking menu button...');
    await clickElement('#menu-btn', 500);
    
    const gameMenu = document.querySelector('#game-menu');
    const menuContent = document.querySelector('.menu-content');
    
    if (gameMenu && gameMenu.style.display !== 'none') {
        logPass('Menu opens when clicking menu button');
    } else {
        logBug('Menu not opening', 'Game menu should be visible after clicking menu button', 'HIGH');
    }
    
    // Verificar se a tela de jogo está coberta
    const gameArea = document.querySelector('#game-area');
    if (gameArea && gameMenu) {
        const menuOverlay = gameMenu.querySelector('.menu-overlay');
        if (menuOverlay) {
            const overlayOpacity = window.getComputedStyle(menuOverlay).opacity;
            if (overlayOpacity > 0.5) {
                logPass('Menu overlay properly covers game area');
            } else {
                logBug('Menu overlay too transparent', `Overlay opacity is ${overlayOpacity}, should be higher`, 'MEDIUM');
            }
        }
    }
    
    // Fechar menu
    console.log('   Clicking cancel button...');
    await clickElement('#menu-cancel-btn', 500);
    
    if (gameMenu.style.display === 'none') {
        logPass('Menu closes when clicking cancel');
    } else {
        logBug('Menu not closing', 'Menu should close when clicking cancel button', 'HIGH');
    }
    
    // Verificar se o jogo resume
    await wait(500);
    const timerAfterMenu = document.querySelector('#timer');
    if (timerAfterMenu && timerAfterMenu.textContent !== '00:00') {
        logPass('Game resumes after closing menu');
    } else {
        logWarning('Game state after menu close', 'Could not verify if game resumed properly');
    }
}

async function testGameOver() {
    console.log('\n💀 TEST 6: Game Over Screen');
    
    // Simular cliques até o timer acabar ou setor mudar
    let lastEnergy = 0;
    let clicCount = 0;
    const maxWait = 35000; // Esperar até 35 segundos
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
        const target = document.querySelector('#target');
        const gameOverScreen = document.querySelector('#game-over-screen');
        const timer = document.querySelector('#timer');
        
        if (gameOverScreen && gameOverScreen.style.display !== 'none') {
            logPass('Game over screen appears');
            
            const finalScore = document.querySelector('#final-score');
            if (finalScore) {
                logPass(`Final score displayed: ${finalScore.textContent}`);
            }
            break;
        }
        
        if (target && target.style.display !== 'none') {
            target.click();
            clicCount++;
        }
        
        await wait(100);
    }
    
    if (clicCount > 0) {
        logPass(`Successfully clicked target ${clicCount} times during gameplay`);
    }
}

async function testResponsiveness() {
    console.log('\n📐 TEST 7: Responsiveness Check');
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    logPass(`Window size: ${windowWidth}x${windowHeight}`);
    
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        const style = window.getComputedStyle(gameContainer);
        if (style.width && style.height) {
            logPass('Game container has dimensions');
        }
    }
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.height < 40) {
            logWarning('Button size small', `Button "${btn.textContent.trim()}" height: ${rect.height}px (min recommended: 40px)`);
        }
    });
}

async function testConsoleErrors() {
    console.log('\n🔍 TEST 8: Console Errors Check');
    
    const errors = window.__consoleErrors || [];
    if (errors.length === 0) {
        logPass('No console errors detected');
    } else {
        errors.forEach(err => {
            logBug('Console error detected', err, 'MEDIUM');
        });
    }
}

async function runAllTests() {
    console.clear();
    console.log('🧪 STARTING HUMANIZED TESTS...\n');
    console.log('='.repeat(60));
    
    try {
        // Interceptar erros de console
        window.__consoleErrors = [];
        const originalError = console.error;
        console.error = function(...args) {
            window.__consoleErrors.push(args.join(' '));
            originalError(...args);
        };
        
        await testInitialScreen();
        await testGameStart();
        await testContinueButton();
        await testGameplay();
        await testMenuInteraction();
        await testGameOver();
        await testResponsiveness();
        await testConsoleErrors();
        
        console.log('\n' + '='.repeat(60));
        console.log('\n📊 TEST SUMMARY');
        console.log(`✅ Passed: ${bugReport.passed.length}`);
        console.log(`❌ Errors: ${bugReport.errors.length}`);
        console.log(`🐛 Bugs: ${bugReport.bugs.length}`);
        console.log(`⚠️ Warnings: ${bugReport.warnings.length}`);
        
        if (bugReport.bugs.length > 0) {
            console.log('\n🐛 BUGS FOUND:');
            bugReport.bugs.forEach((bug, i) => {
                console.log(`   ${i + 1}. [${bug.severity}] ${bug.title}`);
                console.log(`      ${bug.description}`);
            });
        }
        
        if (bugReport.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            bugReport.errors.forEach((err, i) => {
                console.log(`   ${i + 1}. ${err.title}`);
                console.log(`      ${err.description}`);
            });
        }
        
        if (bugReport.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            bugReport.warnings.forEach((warn, i) => {
                console.log(`   ${i + 1}. ${warn.title}`);
                console.log(`      ${warn.description}`);
            });
        }
        
        // Retornar resultados
        window.testResults = bugReport;
        
    } catch (err) {
        logError('Test execution failed', err.message);
        console.error(err);
    }
}

// Iniciar testes quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 1000);
    });
} else {
    setTimeout(runAllTests, 1000);
}

// Expor relatório globalmente para ferramentas externas (Puppeteer)
window.bugReport = bugReport;

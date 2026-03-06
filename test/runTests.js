/**
 * Executor de Testes - Nexus Prism
 * Executa testes automatizados e gera relatório
 */

import { runAllTests, getTestResults } from './gameTester.js';

/**
 * Executa testes e exibe resultados no console
 */
export async function executeTests() {
    console.log('🚀 Iniciando testes automatizados do Nexus Prism...\n');
    
    try {
        await runAllTests();
        const results = getTestResults();
        
        // Análise detalhada
        console.log('\n📊 ANÁLISE DETALHADA:\n');
        
        // Verifica bugs críticos
        if (results.bugs.length > 0) {
            console.log('🔴 BUGS CRÍTICOS ENCONTRADOS:');
            results.bugs.forEach((bug, index) => {
                console.log(`   ${index + 1}. ${bug.test}: ${bug.issue}`);
                if (bug.value !== undefined) {
                    console.log(`      Valor detectado: ${bug.value}`);
                }
            });
        }
        
        // Verifica falhas
        if (results.failed.length > 0) {
            console.log('\n❌ FALHAS:');
            results.failed.forEach((failure, index) => {
                console.log(`   ${index + 1}. ${failure.test}: ${failure.issue}`);
            });
        }
        
        // Verifica avisos
        if (results.warnings.length > 0) {
            console.log('\n⚠️  AVISOS:');
            results.warnings.forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning.test}: ${warning.issue}`);
            });
        }
        
        // Resumo final
        console.log('\n' + '='.repeat(50));
        console.log('📈 RESUMO FINAL:');
        console.log(`   ✅ Testes passaram: ${results.passed.length}`);
        console.log(`   ❌ Testes falharam: ${results.failed.length}`);
        console.log(`   ⚠️  Avisos: ${results.warnings.length}`);
        console.log(`   🐛 Bugs encontrados: ${results.bugs.length}`);
        console.log('='.repeat(50));
        
        // Retorna resultados para análise
        return results;
        
    } catch (error) {
        console.error('❌ Erro ao executar testes:', error);
        throw error;
    }
}

// Executa automaticamente se chamado diretamente
if (import.meta.url === `file://${process.cwd()}/test/runTests.js`) {
    executeTests();
}


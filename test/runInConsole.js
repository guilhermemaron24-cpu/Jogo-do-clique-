/**
 * Script para executar testes no console do navegador
 * Cole este código no console (F12) quando o jogo estiver aberto
 */

(async function() {
    console.log('🚀 Iniciando testes automatizados...\n');
    
    try {
        // Importa o módulo de testes
        const { runAllTests, getTestResults } = await import('./test/gameTester.js');
        
        // Executa os testes
        const results = await runAllTests();
        
        // Exibe resumo
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO DOS TESTES');
        console.log('='.repeat(60));
        console.log(`✅ Testes que passaram: ${results.passed.length}`);
        console.log(`❌ Testes que falharam: ${results.failed.length}`);
        console.log(`⚠️  Avisos: ${results.warnings.length}`);
        console.log(`🐛 Bugs encontrados: ${results.bugs.length}`);
        console.log('='.repeat(60));
        
        // Detalhes dos bugs
        if (results.bugs.length > 0) {
            console.log('\n🐛 BUGS ENCONTRADOS:');
            results.bugs.forEach((bug, index) => {
                console.log(`\n${index + 1}. ${bug.test}:`);
                console.log(`   Problema: ${bug.issue}`);
                if (bug.value !== undefined) {
                    console.log(`   Valor: ${bug.value}`);
                }
                if (bug.scoreBefore !== undefined) {
                    console.log(`   Score antes: ${bug.scoreBefore}, depois: ${bug.scoreAfter}`);
                }
            });
        }
        
        // Detalhes das falhas
        if (results.failed.length > 0) {
            console.log('\n❌ FALHAS:');
            results.failed.forEach((fail, index) => {
                console.log(`\n${index + 1}. ${fail.test}:`);
                console.log(`   ${fail.issue}`);
            });
        }
        
        // Detalhes dos avisos
        if (results.warnings.length > 0) {
            console.log('\n⚠️  AVISOS:');
            results.warnings.forEach((warn, index) => {
                console.log(`\n${index + 1}. ${warn.test}:`);
                console.log(`   ${warn.issue}`);
            });
        }
        
        // Retorna resultados para análise
        return results;
        
    } catch (error) {
        console.error('❌ Erro ao executar testes:', error);
        console.error('Stack:', error.stack);
        throw error;
    }
})();


# 🧪 Como Executar os Testes

## Opção 1: Interface Web (Recomendado)

1. Certifique-se de que o servidor está rodando:
   ```bash
   python -m http.server 8000
   ```

2. Abra no navegador:
   - **Testes com interface:** `http://localhost:8000/test/executeTests.html`
   - **Testes automáticos:** `http://localhost:8000/test/autoRunTests.html`

3. Clique em "Executar Todos os Testes" e aguarde os resultados.

---

## Opção 2: Console do Navegador

1. Abra o jogo no navegador: `http://localhost:8000`

2. Abra o Console (F12 → Console)

3. Cole e execute o seguinte código:

```javascript
(async function() {
    console.log('🚀 Iniciando testes...');
    const { runAllTests, getTestResults } = await import('./test/gameTester.js');
    const results = await runAllTests();
    
    console.log('\n📊 RESUMO:');
    console.log(`✅ Passou: ${results.passed.length}`);
    console.log(`❌ Falhou: ${results.failed.length}`);
    console.log(`⚠️  Avisos: ${results.warnings.length}`);
    console.log(`🐛 Bugs: ${results.bugs.length}`);
    
    if (results.bugs.length > 0) {
        console.log('\n🐛 BUGS ENCONTRADOS:');
        results.bugs.forEach(bug => {
            console.log(`- ${bug.test}: ${bug.issue}`);
        });
    }
    
    return results;
})();
```

---

## Opção 3: Arquivo de Script

1. Abra o arquivo `test/runInConsole.js` no editor
2. Copie todo o conteúdo
3. Cole no console do navegador (F12) quando o jogo estiver aberto
4. Pressione Enter para executar

---

## Testes Implementados

### ✅ Teste 1: Progressão de Setores
- Valida configuração de todos os setores (1-6)
- Verifica thresholds: 0, 15, 40, 100, 250, 600
- Confirma mensagens de ORION

### ✅ Teste 2: Cálculo de Pontuação
- Testa diferentes cenários de multiplicadores
- Valida combinação combo + power-up
- Verifica arredondamento

### ✅ Teste 3: Timer e Power-Ups
- Verifica elementos de UI
- Valida estrutura de power-ups

### ✅ Teste 4: Mecânicas de Setores
- Verifica tamanho de alvos
- Valida delays de respawn
- Confirma mecânicas especiais

### ✅ Teste 5: Simulação de Jogo Completo
- Simula jogador humano
- Monitora score, tempo e setor
- Detecta bugs durante gameplay

### ✅ Teste 6: Verificação de Bugs Comuns
- Timer não para após game over
- Alvos acumulando sem limite
- Power-ups não removidos
- Score não atualiza

---

## Bugs Já Corrigidos

### 🐛 Bug #1: Alvos Falsos Dando Pontos
- **Status:** ✅ CORRIGIDO
- **Problema:** Alvos falsos davam pontos antes de serem detectados
- **Solução:** Verificação movida para ANTES do cálculo de pontos

---

## Interpretando os Resultados

- **✅ Passou:** Teste executado com sucesso
- **❌ Falhou:** Teste encontrou um problema
- **⚠️  Aviso:** Possível problema ou configuração não ideal
- **🐛 Bug:** Problema crítico que precisa ser corrigido

---

## Próximos Passos

Após executar os testes:
1. Revise os bugs encontrados
2. Corrija os problemas identificados
3. Execute os testes novamente para validar as correções
4. Repita até não haver mais bugs críticos


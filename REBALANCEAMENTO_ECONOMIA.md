# ⚖️ Rebalanceamento da Economia - Sistema de Moedas

**Data:** 2024-12-19  
**Status:** ✅ Implementado

---

## 🎯 Objetivo

Ajustar o sistema de recompensas para tornar as moedas mais difíceis de conseguir, criando um progresso mais equilibrado e recompensador. Cada moeda deve ter valor real.

---

## 📊 Mudanças Implementadas

### ❌ Sistema Anterior (Muito Generoso)

**Energia ganha por partida:**
- Setor 1: 10 moedas base + bônus por pontuação (1 por 100 pontos) + bônus por combo (5-20)
- Setor 2: 20 moedas base + bônus...
- Setor 3: 30 moedas base + bônus...
- **Resultado:** Jogadores ganhavam 30-50+ moedas facilmente em uma partida

### ✅ Sistema Novo (Equilibrado)

**Energia ganha apenas ao finalizar partida completa:**

| Setor Alcançado | Moedas Base | Progressão |
|----------------|-------------|------------|
| Setor 1 | 5 moedas | Base |
| Setor 2 | 20 moedas | +15 |
| Setor 3 | 40 moedas | +20 |
| Setor 4 | 70 moedas | +30 |
| Setor 5 | 110 moedas | +40 |
| Setor 6 | 160 moedas | +50 |

**Bônus Adicionais (Muito Raros):**
- Pontuação: 1 moeda por **500 pontos** (antes era 1 por 100)
- Combo 30+: 1 moeda extra
- Combo 50+: 3 moedas extras
- Combo 75+: 5 moedas extras

**Resultado:** Jogadores ganham 5-20 moedas na maioria das partidas, tornando cada moeda valiosa.

---

## 💰 Economia de Upgrades

### Custos dos Upgrades (Mantidos)

| Upgrade | Custo | Partidas Necessárias |
|---------|-------|---------------------|
| Precisão Aprimorada | 50 moedas | 10x Setor 1, ou 2-3x Setor 2, ou 1-2x Setor 3 |
| Reflexos Acelerados | 75 moedas | 15x Setor 1, ou 3-4x Setor 2, ou 1-2x Setor 3 |
| Visão Prismática | 100 moedas | 20x Setor 1, ou 5x Setor 2, ou 2-3x Setor 3 |
| Multiplicador Permanente | 150 moedas | 30x Setor 1, ou 7-8x Setor 2, ou 3-4x Setor 3 |
| Power-Up Plus | 200 moedas | 40x Setor 1, ou 10x Setor 2, ou 4-5x Setor 3 |

### Progressão Esperada

**Jogador Iniciante:**
- Primeiras partidas: 5 moedas (Setor 1)
- Após melhorar: 20 moedas (Setor 2)
- **Primeiro upgrade:** Após 10-15 partidas (Precisão Aprimorada)

**Jogador Intermediário:**
- Partidas regulares: 20-40 moedas (Setor 2-3)
- **Upgrades:** Consegue comprar 1-2 upgrades após algumas horas de jogo

**Jogador Avançado:**
- Partidas: 40-70 moedas (Setor 3-4)
- **Upgrades:** Consegue comprar upgrades mais caros com mais facilidade

**Jogador Expert:**
- Partidas: 70-160 moedas (Setor 4-6)
- **Upgrades:** Consegue comprar todos os upgrades após várias partidas de alto nível

---

## 🎮 Impacto no Gameplay

### Antes
- ❌ Moedas eram ganhas muito rápido
- ❌ Upgrades eram comprados facilmente
- ❌ Pouco senso de progressão
- ❌ Moedas não tinham valor real

### Agora
- ✅ Moedas são ganhas com esforço
- ✅ Upgrades requerem dedicação
- ✅ Progressão clara e recompensadora
- ✅ Cada moeda tem valor
- ✅ Senso de conquista ao comprar upgrade

---

## 📈 Exemplos de Progressão

### Cenário 1: Jogador que sempre chega no Setor 1
- **Partida 1:** 5 moedas (Total: 5)
- **Partida 2:** 5 moedas (Total: 10)
- **Partida 3:** 5 moedas (Total: 15)
- ...
- **Partida 10:** 5 moedas (Total: 50) → **Pode comprar primeiro upgrade!**

### Cenário 2: Jogador que melhora gradualmente
- **Partidas 1-5:** 5 moedas cada (Total: 25)
- **Partidas 6-8:** 20 moedas cada (Total: 85) → **Pode comprar 2 upgrades!**
- **Partidas 9-10:** 40 moedas cada (Total: 165) → **Pode comprar upgrade caro!**

### Cenário 3: Jogador experiente
- **Partida 1:** 40 moedas (Setor 3)
- **Partida 2:** 70 moedas (Setor 4)
- **Partida 3:** 110 moedas (Setor 5) → **Pode comprar upgrade mais caro!**

---

## 🔧 Mudanças Técnicas

### Arquivo: `utils/upgradeSystem.js`

1. **Função `calculateEnergyFromGame()`:**
   - Removido: Cálculo baseado em `maxSector * 10`
   - Removido: Bônus generoso por pontuação (1 por 100 pontos)
   - Removido: Bônus generoso por combo
   - Adicionado: Sistema de recompensas fixas por setor
   - Adicionado: Bônus muito menores e mais raros

2. **Função `calculateEnergyFromSector()`:**
   - Alterado: Agora retorna 0 (energia só é dada ao finalizar partida completa)
   - Motivo: Evitar ganho de moedas durante o jogo

---

## ✅ Resultado Final

O sistema agora oferece:
- ✅ Progressão equilibrada e recompensadora
- ✅ Moedas difíceis de conseguir (cada uma tem valor)
- ✅ Upgrades que requerem dedicação
- ✅ Senso de conquista ao progredir
- ✅ Economia sustentável e balanceada

---

## 📝 Notas

- Os custos dos upgrades foram mantidos (podem ser ajustados no futuro se necessário)
- O sistema de bônus por desempenho excepcional ainda existe, mas é muito mais raro
- A progressão é clara: quanto mais avançado o setor, mais moedas você ganha
- O jogador precisa realmente trabalhar para conseguir moedas

---

**Última atualização:** 2024-12-19  
**Status:** ✅ Implementado e Pronto para Testes


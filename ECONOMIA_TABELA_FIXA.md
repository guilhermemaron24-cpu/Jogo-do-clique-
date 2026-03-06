# 💰 Economia com Tabela Fixa de Recompensas

**Data:** 2024-12-19  
**Status:** ✅ Implementado

---

## 🎯 Objetivo

Ajustar o sistema de moedas para seguir uma tabela fixa de recompensas, garantindo que:
- O jogador demore para comprar itens
- Ao chegar na fase 15, tenha quase 200 moedas (valor do item mais caro)
- Progressão equilibrada e previsível

---

## 📊 Tabela Fixa de Recompensas

| Fase | Moedas | Acúmulo Total | Progressão |
|------|--------|---------------|------------|
| Fase 1 | 3 moedas | 3 | Base |
| Fase 2 | 6 moedas | 9 | +3 |
| Fase 3 | 10 moedas | 19 | +4 |
| Fase 4 | 14 moedas | 33 | +4 |
| Fase 5 | 20 moedas | 53 | +6 |
| Fase 6 | 28 moedas | 81 | +8 |
| Fase 7 | 38 moedas | 119 | +10 |
| Fase 8 | 50 moedas | 169 | +12 |
| Fase 9 | 65 moedas | 234 | +15 |
| Fase 10 | 85 moedas | 319 | +20 |
| Fase 11 | 110 moedas | 429 | +25 |
| Fase 12 | 135 moedas | 564 | +25 |
| Fase 13 | 160 moedas | 724 | +25 |
| Fase 14 | 180 moedas | 904 | +20 |
| Fase 15 | 195 moedas | **1.099** | +15 |

---

## 💎 Economia de Upgrades

### Custos dos Upgrades

| Upgrade | Custo | Quando Conseguir |
|---------|-------|------------------|
| Precisão Aprimorada | 50 moedas | Após ~17 partidas (Fase 1) ou 1-2 partidas (Fase 8+) |
| Reflexos Acelerados | 75 moedas | Após ~25 partidas (Fase 1) ou 1-2 partidas (Fase 9+) |
| Visão Prismática | 100 moedas | Após ~33 partidas (Fase 1) ou 1-2 partidas (Fase 10+) |
| Multiplicador Permanente | 150 moedas | Após ~50 partidas (Fase 1) ou 1-2 partidas (Fase 11+) |
| Power-Up Plus | **200 moedas** | Após ~67 partidas (Fase 1) ou **1 partida (Fase 15)** |

---

## 🎮 Progressão Esperada

### Jogador Iniciante (Fases 1-3)
- **Fase 1:** 3 moedas por partida
- **Fase 2:** 6 moedas por partida
- **Fase 3:** 10 moedas por partida
- **Primeiro upgrade (50 moedas):** Após ~17 partidas na Fase 1, ou ~8 partidas na Fase 2, ou ~5 partidas na Fase 3

### Jogador Intermediário (Fases 4-7)
- **Fase 4:** 14 moedas por partida
- **Fase 5:** 20 moedas por partida
- **Fase 6:** 28 moedas por partida
- **Fase 7:** 38 moedas por partida
- **Upgrades:** Consegue comprar upgrades básicos após 2-4 partidas

### Jogador Avançado (Fases 8-12)
- **Fase 8:** 50 moedas por partida
- **Fase 9:** 65 moedas por partida
- **Fase 10:** 85 moedas por partida
- **Fase 11:** 110 moedas por partida
- **Fase 12:** 135 moedas por partida
- **Upgrades:** Consegue comprar qualquer upgrade após 1-2 partidas

### Jogador Expert (Fases 13-15)
- **Fase 13:** 160 moedas por partida
- **Fase 14:** 180 moedas por partida
- **Fase 15:** 195 moedas por partida (quase 200!)
- **Upgrade mais caro (200 moedas):** Consegue comprar após 1 partida na Fase 15

---

## 📈 Análise da Progressão

### Acúmulo Total de Moedas

- **Fase 5:** 53 moedas acumuladas → Pode comprar primeiro upgrade (50 moedas)
- **Fase 8:** 169 moedas acumuladas → Pode comprar upgrade de 150 moedas
- **Fase 9:** 234 moedas acumuladas → Pode comprar upgrade mais caro (200 moedas)
- **Fase 15:** 1.099 moedas acumuladas → Pode comprar todos os upgrades várias vezes

### Tempo para Primeiro Upgrade

**Cenário Conservador (sempre Fase 1):**
- 17 partidas × 3 moedas = 51 moedas → Primeiro upgrade

**Cenário Realista (melhora gradual):**
- 5 partidas Fase 1 (15 moedas) + 3 partidas Fase 2 (18 moedas) + 1 partida Fase 3 (10 moedas) = 43 moedas
- Mais algumas partidas e consegue o primeiro upgrade

**Cenário Otimista (chega rápido na Fase 3):**
- 5 partidas na Fase 3 = 50 moedas → Primeiro upgrade

---

## ✅ Características do Sistema

### Vantagens
- ✅ **Progressão previsível:** Jogador sabe exatamente quanto ganhará
- ✅ **Equilibrado:** Demora para comprar itens, mas recompensa ao avançar
- ✅ **Recompensador:** Fase 15 dá quase 200 moedas (item mais caro)
- ✅ **Sem surpresas:** Sem bônus aleatórios que quebram a economia
- ✅ **Escalável:** Tabela pronta para até 15 fases

### Como Funciona
1. Jogador finaliza uma partida
2. Sistema verifica o setor/fase máximo alcançado
3. Retorna exatamente o valor da tabela para aquela fase
4. **Sem bônus extras** (pontuação, combo, etc.)
5. Progressão pura e equilibrada

---

## 🔧 Implementação Técnica

### Arquivo: `utils/upgradeSystem.js`

**Função `calculateEnergyFromGame()`:**
- Usa tabela fixa `phaseRewards` com valores exatos
- Não aplica bônus por pontuação
- Não aplica bônus por combo
- Retorna exatamente o valor da tabela
- Se setor > 15, usa valor da fase 15 (195 moedas)

### Compatibilidade
- Sistema funciona com qualquer número de setores
- Se o jogo tiver menos de 15 setores, usa os valores das fases disponíveis
- Se o jogo tiver mais de 15 setores, fases 16+ ganham 195 moedas (mesmo valor da fase 15)

---

## 📝 Notas Importantes

1. **Sem Bônus Extras:**
   - Pontuação não afeta moedas ganhas
   - Combo não afeta moedas ganhas
   - Apenas o setor/fase alcançado importa

2. **Progressão Linear:**
   - Cada fase dá um valor fixo
   - Não há surpresas ou variações
   - Jogador sempre sabe quanto ganhará

3. **Objetivo Alcançado:**
   - ✅ Jogador demora para comprar itens (fases iniciais dão poucas moedas)
   - ✅ Fase 15 dá quase 200 moedas (195, valor do item mais caro é 200)
   - ✅ Progressão equilibrada e recompensadora

---

**Última atualização:** 2024-12-19  
**Status:** ✅ Implementado e Pronto para Testes


# 🎯 Próximo Passo - Plano de Desenvolvimento

## ✅ Status Atual

### Milestone 1: MVP - Core Gameplay ✅ COMPLETO
- ✅ HTML estruturado
- ✅ CSS com tema épico moderno (mobile-first)
- ✅ JavaScript principal funcional
- ✅ Sistema de clique, score, timer
- ✅ HUD funcional
- ✅ Responsividade mobile-first
- ✅ Sistema de áudio com fallback sintético
- ✅ Posicionamento de alvos corrigido

### Milestone 2: Módulos Utilitários ✅ COMPLETO
- ✅ `utils/helpers.js` (randomPosition, clamp, formatTime)
- ✅ `utils/audio.js` (playSound, setVolume, sons sintéticos)
- ✅ `utils/difficulty.js` (perfis easy/normal/hard)
- ✅ Integração com `game.js`

---

## 🎯 PRÓXIMO PASSO: Milestone 3 - Sistema de Fases e Setores

### Objetivo
Implementar progressão narrativa completa com 4 setores únicos, transições visuais e mensagens de ORION.

### O Que Será Implementado

#### 1. Criar `utils/phaseManager.js`
- Gerenciador centralizado de setores
- Configurações por setor (dificuldade, efeitos visuais)
- Mensagens narrativas de ORION
- Sistema de transições

#### 2. Melhorar os 4 Setores

**Setor 1 - Luz Inicial:**
- ✅ Já funciona (básico)
- ⏭️ Adicionar mensagem narrativa de ORION
- ⏭️ Transição visual ao entrar

**Setor 2 - Circuito Particulado:**
- ✅ Já funciona (básico)
- ⏭️ Padrões mais rápidos (já tem)
- ⏭️ Distorções visuais sutis
- ⏭️ Mensagem narrativa
- ⏭️ Transição visual do Setor 1

**Setor 3 - Campo de Ruído:**
- ✅ Já funciona (básico)
- ⏭️ Múltiplas fendas simultâneas
- ⏭️ Efeitos de interferência gráfica
- ⏭️ Mensagem narrativa
- ⏭️ Transição visual

**Setor 4 - Núcleo Distorto:**
- ✅ Já funciona (básico)
- ⏭️ Fendas camufladas (opacidade variável)
- ⏭️ Ambiente visualmente instável
- ⏭️ Mensagem narrativa
- ⏭️ Transição visual

#### 3. Transições Visuais
- Efeito de fade/flash ao mudar de setor
- Animações de transição
- Feedback visual claro da mudança

#### 4. Mensagens Narrativas
- Mensagens de ORION ao entrar em cada setor
- Sistema de diálogo/notificação
- Integração com a história

---

## 📋 Tarefas do Milestone 3

### Fase 1: Estrutura Base (1 dia)
- [ ] Criar `utils/phaseManager.js`
- [ ] Definir configurações de cada setor
- [ ] Criar sistema de mensagens narrativas
- [ ] Integrar com `game.js`

### Fase 2: Transições Visuais (1 dia)
- [ ] Implementar animações de transição
- [ ] Efeitos visuais por setor
- [ ] Feedback visual ao mudar de setor

### Fase 3: Mecânicas Especiais (1 dia)
- [ ] Múltiplas fendas simultâneas (Setor 3)
- [ ] Fendas camufladas (Setor 4)
- [ ] Distorções visuais (Setor 2)
- [ ] Testes e ajustes

---

## 🎨 Exemplos do Que Será Adicionado

### Mensagens de ORION
```
Setor 1: "Bem-vindo, Operador. Este é o Setor 1 - Luz Inicial. 
          As fendas aqui são estáveis. Use este momento para se acostumar."

Setor 2: "Atenção! Entrando no Setor 2 - Circuito Particulado. 
          As fendas estão se tornando mais instáveis. Fique alerta!"

Setor 3: "ALERTA CRÍTICO! Setor 3 - Campo de Ruído detectado. 
          Múltiplas fendas simultâneas. A estabilidade está comprometida!"

Setor 4: "PERIGO EXTREMO! Setor 4 - Núcleo Distorto. 
          As fendas estão camufladas. Confie nos seus instintos, Operador!"
```

### Transições Visuais
- Flash de luz ao mudar de setor
- Efeito de "glitch" para setores mais difíceis
- Mudança sutil de cor de fundo
- Animação de partículas

---

## ⏱️ Tempo Estimado
**3 dias** de desenvolvimento

---

## 🚀 Começar Agora?

Posso começar implementando:
1. **`utils/phaseManager.js`** - Estrutura base
2. **Sistema de mensagens narrativas** - ORION falando
3. **Transições visuais** - Efeitos ao mudar de setor

**Deseja que eu comece agora?** 🎮


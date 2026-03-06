# 🗺️ Roadmap Visual - Nexus Prism

## Timeline de Desenvolvimento (12-15 dias)

```
DIA 1-2          DIA 3-4          DIA 5-6          DIA 7-8
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│   MVP   │  →   │ Módulos │  →   │  Fases  │  →   │ Chefes  │
│  Core   │      │ Utils   │      │ Setores │      │ Bosses  │
└─────────┘      └─────────┘      └─────────┘      └─────────┘
   ✅              ✅                ✅                ✅

DIA 9-10         DIA 11-12         DIA 13-14        DIA 15
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│Supabase │  →   │ Social  │  →   │  A11y   │  →   │ Deploy  │
│Leaderbd │      │Sharing  │      │ Mobile  │      │  Docs   │
└─────────┘      └─────────┘      └─────────┘      └─────────┘
   ✅              ✅                ✅                ✅
```

---

## 📅 Cronograma Detalhado

### **Semana 1: Fundação e Core**

#### Dias 1-2: MVP - Core Gameplay
```
┌─────────────────────────────────────┐
│ ✅ HTML estruturado                 │
│ ✅ CSS tema épico                   │
│ ✅ JS básico (clique, score, timer) │
│ ✅ Tela início/game over            │
│ ✅ HUD funcional                    │
└─────────────────────────────────────┘
```

#### Dias 3-4: Módulos Utilitários
```
┌─────────────────────────────────────┐
│ ✅ utils/helpers.js                 │
│ ✅ utils/audio.js                   │
│ ✅ utils/difficulty.js              │
│ ✅ Integração com game.js           │
└─────────────────────────────────────┘
```

#### Dias 5-6: Sistema de Fases
```
┌─────────────────────────────────────┐
│ ✅ utils/phaseManager.js            │
│ ✅ Setor 1-4 implementados          │
│ ✅ Transições visuais               │
│ ✅ Mensagens narrativas             │
└─────────────────────────────────────┘
```

---

### **Semana 2: Conteúdo e Integração**

#### Dias 7-8: Sistema de Chefes
```
┌─────────────────────────────────────┐
│ ✅ utils/bossManager.js             │
│ ✅ 4 chefes implementados           │
│ ✅ Mecânicas únicas                 │
│ ✅ Animações de chefes              │
└─────────────────────────────────────┘
```

#### Dias 9-10: Supabase Leaderboard
```
┌─────────────────────────────────────┐
│ ✅ Configuração Supabase            │
│ ✅ Tabelas criadas                  │
│ ✅ RLS configurado                  │
│ ✅ submitScore / getTopScores       │
│ ✅ UI de leaderboard                │
└─────────────────────────────────────┘
```

#### Dias 11-12: Social e Polimento
```
┌─────────────────────────────────────┐
│ ✅ Compartilhamento                 │
│ ✅ Desafios diários                 │
│ ✅ Polimento visual                 │
│ ✅ Sons e animações                 │
└─────────────────────────────────────┘
```

---

### **Semana 3: Finalização**

#### Dias 13-14: Acessibilidade e Mobile
```
┌─────────────────────────────────────┐
│ ✅ ARIA labels                      │
│ ✅ Navegação teclado                │
│ ✅ Otimização mobile                │
│ ✅ Testes em dispositivos           │
└─────────────────────────────────────┘
```

#### Dia 15: Deploy e Documentação
```
┌─────────────────────────────────────┐
│ ✅ Deploy produção                  │
│ ✅ Testes finais                    │
│ ✅ Documentação completa            │
│ ✅ README atualizado                │
└─────────────────────────────────────┘
```

---

## 🎯 Milestones Principais

### Milestone 1: MVP Funcional (Dia 2)
**Critério de Sucesso:** Jogo jogável end-to-end
- [x] Jogador pode iniciar
- [x] Alvos aparecem e podem ser clicados
- [x] Score e timer funcionam
- [x] Game over funciona

### Milestone 2: Progressão (Dia 6)
**Critério de Sucesso:** 4 setores funcionais
- [ ] Transições entre setores
- [ ] Dificuldade progressiva
- [ ] Narrativa integrada

### Milestone 3: Chefes (Dia 8)
**Critério de Sucesso:** Todos os chefes implementados
- [ ] 4 chefes com mecânicas únicas
- [ ] Animações e efeitos
- [ ] Sistema de vitória/derrota

### Milestone 4: Online (Dia 10)
**Critério de Sucesso:** Leaderboard funcional
- [ ] Scores salvos no Supabase
- [ ] Ranking exibido corretamente
- [ ] Filtros funcionando

### Milestone 5: Lançamento (Dia 15)
**Critério de Sucesso:** Jogo publicado e documentado
- [ ] Deploy em produção
- [ ] Sem bugs críticos
- [ ] Documentação completa

---

## 📊 Métricas de Progresso

### Por Funcionalidade
```
Core Gameplay:        [████████░░] 80%
Progressão:           [████░░░░░░] 40%
Chefes:               [░░░░░░░░░░]  0%
Leaderboard:          [░░░░░░░░░░]  0%
Social:               [░░░░░░░░░░]  0%
Acessibilidade:       [░░░░░░░░░░]  0%
```

### Por Milestone
```
Milestone 1 (MVP):           [██████████] 100%
Milestone 2 (Módulos):      [████████░░]  80%
Milestone 3 (Fases):        [████░░░░░░]  40%
Milestone 4 (Chefes):       [░░░░░░░░░░]   0%
Milestone 5 (Supabase):     [░░░░░░░░░░]   0%
Milestone 6 (Social):       [░░░░░░░░░░]   0%
Milestone 7 (Polimento):    [░░░░░░░░░░]   0%
Milestone 8 (A11y/Mobile):  [░░░░░░░░░░]   0%
Milestone 9 (Testes):       [░░░░░░░░░░]   0%
Milestone 10 (Deploy):      [░░░░░░░░░░]   0%
```

---

## 🚦 Status Atual

**Fase:** Planejamento ✅  
**Próximo Passo:** Iniciar Milestone 1 (MVP)  
**Bloqueios:** Nenhum  
**Riscos:** Integração Supabase (curva de aprendizado)

---

## 📝 Notas de Desenvolvimento

### Decisões Técnicas
- ✅ Vanilla JS (sem frameworks) para simplicidade
- ✅ Supabase para backend (PostgreSQL + Auth)
- ✅ Mobile-first design
- ✅ Acessibilidade desde o início

### Prioridades
1. **P0 (Crítico):** Core gameplay, fases, chefes
2. **P1 (Importante):** Leaderboard, áudio, visual
3. **P2 (Desejável):** Desafios, compartilhamento avançado

### Riscos Identificados
- ⚠️ Performance em mobile (precisa otimização)
- ⚠️ Integração Supabase (pode ter curva de aprendizado)
- ⚠️ Assets de áudio (pode precisar criar ou licenciar)

---

## 🔄 Atualizações

**v1.0** (Data) - Plano inicial criado
- Estrutura completa definida
- Milestones estabelecidos
- Checklist criado

---

**Última atualização:** [Data]  
**Próxima revisão:** Após Milestone 1


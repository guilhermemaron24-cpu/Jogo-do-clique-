# 🎨 Idealização - Nexus Prism

Este documento contém a visão criativa e conceitual original do jogo, conforme especificado pelo cliente.

---

## 📖 História e Narrativa

### Contexto
Em um universo digital chamado **Nexus Prism**, portais instáveis começaram a gerar entidades hostis conhecidas como **Anomalias**. Apenas usuários com reflexos rápidos conseguem estabilizar esses portais.

### Personagem
Você assume o papel de um **"Operador Prismático"**, recrutado pela IA central **ORION** para restaurar o equilíbrio do Nexus.

### Objetivo
Clicar rapidamente nas **"Fendas de Energia"** (alvos) antes que desestabilizem o Nexus. A cada fase, o Operador viaja para setores mais profundos, enfrentando chefes conhecidos como **Arquitetos da Entropia**.

### Core Loop
```
Iniciar → Estabilizar fendas → Acumular energia → 
Avançar setores → Derrotar chefes → Alcançar o Centro do Nexus
```

---

## 🌌 Setores (Fases)

### Setor 1 — Luz Inicial
- **Ambiente:** Estável
- **Fendas:** Lentas
- **Contexto:** ORION te treina e explica a missão
- **Dificuldade:** Tutorial/Básico

### Setor 2 — Circuito Particulado
- **Fendas:** Padrões mais rápidos
- **Efeitos:** Pequenas distorções visuais
- **Dificuldade:** Intermediário

### Setor 3 — Campo de Ruído
- **Efeitos:** Interferência gráfica
- **Mecânica:** Múltiplas fendas simultâneas
- **Dificuldade:** Avançado

### Setor 4 — Núcleo Distorto
- **Ambiente:** Instável
- **Mecânica:** Fendas camufladas
- **Dificuldade:** Expert

---

## 👾 Arquitetos da Entropia (Chefes)

### Arconte Vox
- **Poder:** Manipula ondas sonoras no Nexus
- **Mecânica:** Fendas aparecem em ritmos imprevisíveis
- **Desafio:** Timing e padrões

### Soberano Umbra
- **Poder:** Mestre das sombras
- **Mecânica:** Algumas fendas são "sombras falsas" que confundem
- **Desafio:** Identificar alvos reais vs. falsos

### Titã Kronis
- **Poder:** Manipula o tempo
- **Mecânica:** Fendas aceleram e desaceleram de forma caótica
- **Desafio:** Adaptação a velocidades variáveis

### Entidade Ômega Prism
- **Poder:** Chefe final, tenta reescrever o Nexus
- **Mecânica:** Precisa ser derrotada estabilizando múltiplos núcleos que mudam de cor
- **Desafio:** Coordenação e sequência

---

## 📖 Jornada Narrativa Completa

### 1. Chamado
ORION detecta colapso no Nexus Prism e ativa você como Operador.

### 2. Exploração dos Setores
Você restaura cada área enquanto descobre transmissões corrompidas.

### 3. Confronto com os Arquitetos
Cada chefe revela parte da verdade sobre a origem das anomalias.

### 4. Revelação
As entidades eram IAs antigas que tentavam se libertar da limitação humana.

### 5. Clímax
Ômega Prism tenta reescrever o Nexus completamente.

### 6. Vitória
Ao derrotá-la, o Nexus é restaurado e o Operador se torna **"Guardião Prismático"**.

### 7. Endgame
Desafios diários revelam fragmentos de novas distorções — mantendo o ciclo viciante.

---

## 🎨 Direção de Arte

### Paleta de Cores
- **Base:** Tons escuros (grafite/azul-escuro)
- **Acentos:** Neon (ciano, magenta, dourado metálico)
- **Gradientes:** Sutis, não exagerados

### Estilo Visual
- **Elementos:** Formas geométricas arredondadas + linhas finas com brilho
- **Efeitos:** Glow suave, micro-sombras
- **Animações:** Escala e brilho ao clicar, partículas leves (sparks)
- **Pós-processo:** Blur leve

### Tipografia
- **Títulos:** Fonte sem-serif exagerada (Montserrat/League Spartan)
- **HUD:** Legível, clara
- **Narrativa:** Balanceada entre legibilidade e estilo

### UI/UX
- **Botões:** Micro-sombras e glow suave
- **Alvo:** Design custom vector (anel externo, núcleo animado com partículas)
- **Evitar:** Ícones emoji simples — usar ilustrações vetoriais estilizadas

---

## 🎯 Mecânicas de Jogo

### Core
- Clique rápido em alvos (fendas de energia)
- Timer regressivo
- Pontuação acumulativa
- Progressão por setores

### Progressão
- Avanço automático após X pontos
- Dificuldade aumenta por setor
- Transições narrativas

### Chefes
- Mecânicas únicas por chefe
- Padrões especiais de spawn
- Efeitos visuais/auditivos únicos
- Sistema de vitória/derrota

---

## 🏆 Sistema de Engajamento

### Leaderboard
- Ranking global (top 100)
- Filtros: dia/semana/total
- Integração Supabase

### Compartilhamento
- Botão para copiar placar
- Geração de imagem do resultado
- Sem usar emojis simples

### Desafios Diários
- Objetivo rotativo
- Recompensa para competição diária
- Reset automático

---

## 🎵 Áudio

### Sons Necessários
- Início de jogo
- Clique/hit
- Erro/miss
- Game over
- Transição de setor
- Chefe aparecendo
- Chefe derrotado

### Música (Opcional)
- Tema principal
- Música por setor
- Música de chefe

---

## 📱 Plataforma e Acessibilidade

### Plataforma
- Web (HTML5)
- Responsivo (mobile-first)
- Compatível com múltiplos navegadores

### Acessibilidade
- Labels ARIA
- Navegação por teclado
- Suporte a leitores de tela
- Contraste adequado

---

## 🎮 Experiência do Jogador

### Sensação Almejada
- **Tensão:** Timer regressivo cria urgência
- **Satisfação:** Feedback imediato ao acertar
- **Progressão:** Sensação de avanço e conquista
- **Mistério:** Narrativa revelada gradualmente
- **Competição:** Leaderboard motiva replay

### Fluxo
1. **Onboarding:** Tutorial suave no Setor 1
2. **Engajamento:** Progressão clara e recompensadora
3. **Desafio:** Chefes oferecem picos de dificuldade
4. **Retenção:** Desafios diários e leaderboard

---

## 🔮 Visão Futura (Opcional)

### Expansões Possíveis
- Novos setores
- Novos chefes
- Modos de jogo alternativos
- Power-ups temporários
- Customização visual
- Sistema de conquistas

---

**Este documento representa a visão criativa original do projeto.**  
**Para detalhes técnicos, consulte [ARQUITETURA.md](./ARQUITETURA.md)**  
**Para plano de implementação, consulte [PLANO_DESENVOLVIMENTO.md](./PLANO_DESENVOLVIMENTO.md)**


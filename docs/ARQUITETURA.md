# Arquitetura Técnica - Nexus Prism

## 📐 Visão Geral da Arquitetura

### Stack Tecnológico
- **Frontend:** HTML5 + CSS3 + JavaScript ES6+ (Vanilla, sem frameworks)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Netlify ou Vercel
- **Versionamento:** Git

### Princípios de Design
- **Modularidade:** Código organizado em módulos reutilizáveis
- **Performance:** Otimizações para 60fps, mobile-first
- **Acessibilidade:** WCAG 2.1 Level AA mínimo
- **Escalabilidade:** Estrutura preparada para futuras features

---

## 🗂️ Estrutura de Arquivos Detalhada

```
clique-relampago/
│
├── index.html                    # Ponto de entrada HTML
├── style.css                     # Estilos globais e componentes
├── game.js                       # Orquestrador principal do jogo
│
├── utils/                        # Módulos utilitários
│   ├── audio.js                 # Sistema de áudio (playSound, setVolume)
│   ├── helpers.js               # Funções auxiliares (randomPosition, clamp, formatTime)
│   ├── difficulty.js            # Perfis de dificuldade (easy, normal, hard)
│   ├── phaseManager.js          # Gerenciador de setores/fases
│   ├── bossManager.js           # Gerenciador de chefes
│   ├── animations.js             # Animações e efeitos visuais
│   └── storage.js               # LocalStorage para dados locais
│
├── assets/                       # Recursos estáticos
│   ├── svgs/                    # Ilustrações vetoriais
│   │   ├── target-big.svg
│   │   ├── target-medium.svg
│   │   ├── target-small.svg
│   │   ├── particles.svg
│   │   └── boss-icons/
│   └── sounds/                  # Arquivos de áudio
│       ├── start.mp3
│       ├── click.mp3
│       ├── hit.mp3
│       ├── miss.mp3
│       ├── gameover.mp3
│       ├── sector-transition.mp3
│       ├── boss-appear.mp3
│       └── boss-defeat.mp3
│
├── supabase/                     # Integração Supabase
│   ├── config.js                # Configuração e inicialização do cliente
│   ├── leaderboard.js           # Funções de leaderboard (submitScore, getTopScores)
│   ├── auth.js                  # Autenticação (opcional)
│   └── migrations/              # SQL migrations (opcional)
│
├── docs/                         # Documentação
│   ├── PLANO_DESENVOLVIMENTO.md
│   ├── IDEALIZACAO.md
│   └── ARQUITETURA.md
│
└── README.md                     # Documentação principal do projeto
```

---

## 🔧 Módulos Principais

### `game.js` - Orquestrador Principal
**Responsabilidades:**
- Gerenciar estado global do jogo
- Coordenar interações entre módulos
- Controlar ciclo de vida do jogo (init → play → gameover)
- Gerenciar eventos DOM

**Estrutura:**
```javascript
// Estado global
const gameState = {
    isPlaying: boolean,
    score: number,
    timeLeft: number,
    sector: number,
    difficulty: string,
    currentBoss: string | null,
    // ...
};

// Elementos DOM
const elements = { /* ... */ };

// Funções principais
function init() { /* ... */ }
function startGame() { /* ... */ }
function endGame() { /* ... */ }
function updateUI() { /* ... */ }
```

---

### `utils/phaseManager.js` - Gerenciador de Fases
**Responsabilidades:**
- Gerenciar transições entre setores
- Aplicar configurações por setor
- Exibir mensagens narrativas
- Controlar dificuldade progressiva

**Estrutura:**
```javascript
const sectors = {
    1: {
        name: 'Luz Inicial',
        difficulty: { targetSize: 80, respawnDelay: 1500 },
        message: 'Bem-vindo ao Setor 1...',
        visualEffects: []
    },
    // ...
};

export function getSectorConfig(sectorNumber) { /* ... */ }
export function transitionToSector(sectorNumber) { /* ... */ }
export function getSectorMessage(sectorNumber) { /* ... */ }
```

---

### `utils/bossManager.js` - Gerenciador de Chefes
**Responsabilidades:**
- Gerenciar mecânicas únicas de cada chefe
- Controlar spawn de alvos especiais
- Aplicar efeitos visuais/auditivos
- Detectar vitória/derrota

**Estrutura:**
```javascript
const bosses = {
    'arconte-vox': {
        name: 'Arconte Vox',
        pattern: 'rhythmic',
        mechanics: { /* ... */ }
    },
    // ...
};

export function spawnBoss(bossId) { /* ... */ }
export function updateBossMechanics(bossId, deltaTime) { /* ... */ }
export function checkBossDefeat(bossId) { /* ... */ }
```

---

### `supabase/leaderboard.js` - Sistema de Ranking
**Responsabilidades:**
- Submeter scores para o banco
- Buscar top scores
- Filtrar por modo (daily/weekly/total)
- Validar integridade dos dados

**Estrutura:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function submitScore({ username, score, mode, sector }) { /* ... */ }
export async function getTopScores({ mode, limit = 100 }) { /* ... */ }
export async function getPlayerRank(playerId, mode) { /* ... */ }
```

---

## 🎨 Sistema de Design

### Paleta de Cores
```css
:root {
    /* Backgrounds */
    --bg-primary: #0a0e1a;      /* Grafite escuro */
    --bg-secondary: #1a1f2e;    /* Azul-escuro */
    
    /* Acentos Neon */
    --accent-cyan: #00f0ff;      /* Ciano brilhante */
    --accent-magenta: #ff00f0;   /* Magenta vibrante */
    --accent-gold: #ffd700;      /* Dourado metálico */
    
    /* Texto */
    --text-primary: #ffffff;     /* Branco */
    --text-secondary: #a0a0a0;   /* Cinza claro */
    
    /* Efeitos */
    --glow-cyan: 0 0 20px rgba(0, 240, 255, 0.5);
    --glow-magenta: 0 0 20px rgba(255, 0, 240, 0.5);
    --glow-gold: 0 0 20px rgba(255, 215, 0, 0.5);
}
```

### Tipografia
- **Títulos:** Montserrat (900 weight) - Exagerada, sem-serif
- **Corpo:** Montserrat (400-600 weight) - Legível
- **HUD:** Montserrat (700 weight) - Destaque

### Componentes Visuais
- **Botões:** Gradientes neon, glow suave, micro-sombras
- **Alvos:** SVGs animados com partículas
- **HUD:** Backdrop blur, bordas neon
- **Telas:** Overlay escuro com blur, conteúdo centralizado

---

## 🗄️ Esquema de Banco de Dados (Supabase)

### Tabela: `players`
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_played_at TIMESTAMP WITH TIME ZONE,
  total_games INTEGER DEFAULT 0
);

CREATE INDEX idx_players_username ON players(username);
```

### Tabela: `scores`
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  mode TEXT NOT NULL CHECK (mode IN ('daily', 'weekly', 'total')),
  sector INTEGER NOT NULL CHECK (sector >= 1 AND sector <= 4),
  boss_defeated TEXT,
  time_played INTEGER, -- segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scores_mode_created ON scores(mode, created_at DESC);
CREATE INDEX idx_scores_player ON scores(player_id);
CREATE INDEX idx_scores_leaderboard ON scores(mode, score DESC, created_at DESC);
```

### Row Level Security (RLS)
```sql
-- Política de leitura pública para leaderboard
CREATE POLICY "Leaderboard is viewable by everyone"
  ON scores FOR SELECT
  USING (true);

-- Política de escrita autenticada (ou validada)
CREATE POLICY "Users can insert their own scores"
  ON scores FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR validate_score(score));
```

### Função de Validação (Edge Function)
```sql
-- Validação básica de score (exemplo)
CREATE OR REPLACE FUNCTION validate_score(score_value INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validações: score razoável, não muito alto, etc.
  RETURN score_value >= 0 AND score_value <= 10000;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 Fluxo de Dados

### Fluxo Principal do Jogo
```
1. Usuário clica "Iniciar"
   ↓
2. game.js → startGame()
   ↓
3. phaseManager → getSectorConfig(1)
   ↓
4. game.js → spawnTarget()
   ↓
5. Usuário clica no alvo
   ↓
6. game.js → handleTargetClick()
   ↓
7. audio.js → playSound('hit')
   ↓
8. game.js → updateScore()
   ↓
9. phaseManager → checkSectorProgression()
   ↓
10. Timer expira → endGame()
    ↓
11. leaderboard.js → submitScore()
```

### Fluxo de Leaderboard
```
1. Usuário abre leaderboard
   ↓
2. leaderboard.js → getTopScores({ mode: 'total' })
   ↓
3. Supabase → Query com RLS
   ↓
4. Dados retornados → UI atualizada
```

---

## 🎯 Padrões de Código

### Convenções de Nomenclatura
- **Variáveis:** camelCase (`gameState`, `targetSize`)
- **Funções:** camelCase (`startGame`, `handleTargetClick`)
- **Constantes:** UPPER_SNAKE_CASE (`SUPABASE_URL`, `MAX_SCORE`)
- **Classes CSS:** kebab-case (`.game-area`, `.btn-primary`)

### Estrutura de Funções
```javascript
/**
 * Descrição clara da função
 * @param {Type} paramName - Descrição do parâmetro
 * @returns {Type} Descrição do retorno
 */
export function functionName(paramName) {
    // Validação de entrada
    if (!paramName) return;
    
    // Lógica principal
    const result = /* ... */;
    
    // Retorno
    return result;
}
```

### Tratamento de Erros
```javascript
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    console.error('Contexto do erro:', error);
    // Fallback ou notificação ao usuário
    return defaultValue;
}
```

---

## ⚡ Otimizações de Performance

### CSS
- Usar `transform` e `opacity` para animações (GPU-accelerated)
- Evitar `position: absolute` excessivo
- Usar `will-change` com moderação
- Minimizar repaints/reflows

### JavaScript
- Debounce/throttle em eventos frequentes
- Cache de seleções DOM
- Lazy loading de assets
- RequestAnimationFrame para animações

### Assets
- SVGs otimizados (sem metadados desnecessários)
- Áudio comprimido (MP3 128kbps ou OGG)
- Lazy load de sons não críticos

---

## 🔒 Segurança

### Frontend
- Nunca expor chaves secretas do Supabase
- Validar inputs do usuário
- Sanitizar dados antes de exibir
- Usar HTTPS em produção

### Backend (Supabase)
- Row Level Security (RLS) habilitado
- Validação de scores no servidor
- Rate limiting (se possível)
- Logs de auditoria

---

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### Touch Targets
- Mínimo 44x44px para elementos clicáveis
- Espaçamento adequado entre botões
- Feedback visual imediato

---

## 🧪 Estratégia de Testes

### Testes Manuais
- Múltiplos navegadores (Chrome, Firefox, Safari, Edge)
- Dispositivos móveis (iOS, Android)
- Diferentes tamanhos de tela
- Performance (DevTools)

### Testes Automatizados (Futuro)
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

---

## 🚀 Deploy

### Variáveis de Ambiente
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
```

### Build Process
1. Minificar CSS/JS (opcional)
2. Otimizar assets
3. Injetar variáveis de ambiente
4. Deploy para Netlify/Vercel

### Checklist de Deploy
- [ ] Variáveis de ambiente configuradas
- [ ] RLS policies testadas
- [ ] Performance testada
- [ ] Mobile testado
- [ ] Analytics configurado (opcional)

---

**Última atualização:** [Data]  
**Versão:** 1.0


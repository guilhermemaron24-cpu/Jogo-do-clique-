# 🎮 Nexus Prism - Clique Relâmpago

Um jogo arcade de reflexos com progressão narrativa, onde você assume o papel de um Operador Prismático tentando estabilizar portais instáveis no universo digital Nexus Prism.

## 📖 Sobre o Jogo

Em um universo digital chamado **Nexus Prism**, portais instáveis começaram a gerar entidades hostis conhecidas como **Anomalias**. Apenas usuários com reflexos rápidos conseguem estabilizar esses portais. Você assume o papel de um "Operador Prismático", recrutado pela IA central **ORION** para restaurar o equilíbrio.

### Objetivo
Clicar rapidamente nas "Fendas de Energia" (alvos) antes que desestabilizem o Nexus. A cada fase, o Operador viaja para setores mais profundos, enfrentando chefes conhecidos como **Arquitetos da Entropia**.

## 🎯 Funcionalidades

### Core Gameplay
- ✅ Sistema de clique em alvos (fendas de energia)
- ✅ Geração aleatória de alvos
- ✅ Timer regressivo
- ✅ Sistema de pontuação
- ✅ Feedback visual e sonoro

### Progressão
- ✅ 4 Setores únicos com dificuldade progressiva
- ✅ Transições narrativas
- ✅ Mensagens de ORION

### Chefes
- ✅ 4 Arquitetos da Entropia com mecânicas únicas
- ✅ Animações e efeitos especiais

### Social
- ✅ Leaderboard global (Supabase)
- ✅ Compartilhamento de resultados
- ✅ Desafios diários

## 🚀 Como Jogar

1. Clique em **"Iniciar Missão"**
2. Clique rapidamente nas **Fendas de Energia** (alvos) que aparecem na tela
3. Acumule energia (pontos) antes que o tempo acabe
4. Avance pelos setores enfrentando desafios cada vez maiores
5. Derrote os Arquitetos da Entropia para restaurar o Nexus

## 🛠️ Tecnologias

- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deploy:** Netlify/Vercel
- **Fontes:** Google Fonts (Montserrat)

## 📁 Estrutura do Projeto

```
clique-relampago/
├── index.html              # HTML principal
├── style.css               # Estilos
├── game.js                 # Lógica do jogo
├── utils/                  # Módulos utilitários
├── assets/                 # Recursos (SVGs, sons)
├── supabase/              # Integração Supabase
└── docs/                  # Documentação
```

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd clique-relampago
```

2. Configure o Supabase (opcional para desenvolvimento local):
   - Crie um projeto no [Supabase](https://supabase.com)
   - Configure as variáveis de ambiente:
   ```env
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxx...
   ```

3. Abra `index.html` em um navegador ou use um servidor local:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

4. Acesse `http://localhost:8000`

## 📝 Documentação

- [Plano de Desenvolvimento](./docs/PLANO_DESENVOLVIMENTO.md)
- [Arquitetura Técnica](./docs/ARQUITETURA.md)
- [Checklist de Funcionalidades](./docs/CHECKLIST_FUNCIONALIDADES.md)

## 🎨 Direção de Arte

- **Paleta:** Tons escuros (grafite/azul-escuro) + acentos neon (ciano, magenta, dourado)
- **Estilo:** Formas geométricas arredondadas + linhas finas com brilho
- **Tipografia:** Montserrat (sem-serif exagerada para títulos)

## 🏆 Setores e Chefes

### Setores
1. **Luz Inicial** - Ambiente estável, fendas lentas
2. **Circuito Particulado** - Padrões mais rápidos, distorções visuais
3. **Campo de Ruído** - Múltiplas fendas simultâneas, interferência
4. **Núcleo Distorto** - Fendas camufladas, ambiente instável

### Arquitetos da Entropia
- **Arconte Vox** - Manipula ondas sonoras, ritmos imprevisíveis
- **Soberano Umbra** - Mestre das sombras, fendas falsas
- **Titã Kronis** - Manipula o tempo, aceleração/desaceleração
- **Entidade Ômega Prism** - Chefe final, múltiplos núcleos coloridos

## 📊 Status do Projeto

**Fase Atual:** Planejamento ✅

Consulte o [Plano de Desenvolvimento](./docs/PLANO_DESENVOLVIMENTO.md) para ver o progresso detalhado.

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões e feedback são bem-vindos!

## 📄 Licença

[Especificar licença]

## 👤 Autor

[Seu nome]

---

**Desenvolvido com ❤️ para desafiar seus reflexos!**


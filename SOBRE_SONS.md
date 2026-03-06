# 🔊 Sistema de Áudio - Nexus Prism

## ✅ Atualização: Sons Sintéticos

O sistema de áudio foi atualizado para **gerar sons sintéticos automaticamente** quando os arquivos MP3 não estão disponíveis!

### Como Funciona

1. **Primeiro:** Tenta carregar arquivos MP3 de `assets/sounds/`
2. **Se não encontrar:** Gera sons sintéticos usando Web Audio API
3. **Resultado:** Você sempre terá feedback sonoro!

### Sons Disponíveis

- **start** - Som de início (beep ascendente)
- **hit** - Som ao acertar alvo (beep agudo)
- **gameover** - Som de fim de jogo (beep grave descendente)
- **miss** - Som ao errar (beep grave)

### Adicionar Arquivos MP3 (Opcional)

Se quiser usar sons personalizados:

1. Adicione arquivos MP3 em `assets/sounds/`:
   - `start.mp3`
   - `hit.mp3`
   - `gameover.mp3`
   - `miss.mp3`

2. O sistema automaticamente usará os arquivos MP3 se disponíveis

3. Se os arquivos não existirem, continuará usando sons sintéticos

### Requisitos

- Navegador moderno com suporte a Web Audio API
- Primeira interação do usuário (clique) para ativar áudio (política do navegador)

### Notas

- Os sons sintéticos são simples mas funcionais
- Volume pode ser ajustado (padrão: 70%)
- Sons não bloqueiam se arquivos não existirem
- Sistema funciona offline

---

**Status:** ✅ Sistema de áudio funcional com fallback sintético!


# 🔍 Debug - Problema ao Iniciar

## Problema Comum: Módulos ES6

Se você abriu o arquivo `index.html` diretamente no navegador (duplo clique), os módulos ES6 não funcionarão devido a restrições de CORS.

## ✅ Solução: Use um Servidor Local

### Opção 1: Python (Recomendado)
```bash
# No terminal, na pasta do projeto:
python -m http.server 8000
```
Depois acesse: **http://localhost:8000**

### Opção 2: Node.js
```bash
npx serve
```

### Opção 3: VS Code
- Instale a extensão "Live Server"
- Clique com botão direito em `index.html`
- Selecione "Open with Live Server"

## 🔍 Verificar no Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Procure por erros como:
   - `Failed to load module`
   - `CORS policy`
   - `Cannot access before initialization`

## ✅ Logs Adicionados

Adicionei logs de debug no código. Você deve ver no console:
- "Nexus Prism inicializado com sucesso!"
- "Elementos encontrados: [...]"
- "Botão clicado!" (quando clicar em iniciar)
- "Iniciando jogo..."
- "Jogo iniciado!"

Se não ver esses logs, há um problema de carregamento.

## 🐛 Problemas Possíveis

1. **Módulos ES6 não carregam** → Use servidor local
2. **Elementos DOM não encontrados** → Verifique se o HTML está correto
3. **Erro de JavaScript** → Verifique o console

## 📝 Teste Rápido

Abra o console (F12) e digite:
```javascript
document.getElementById('start-btn')
```

Se retornar `null`, há um problema com o HTML.
Se retornar o elemento, o problema é no JavaScript.


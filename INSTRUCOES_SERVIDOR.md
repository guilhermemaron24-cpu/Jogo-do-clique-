# 🚀 Como Iniciar o Servidor Local

## ⚠️ PROBLEMA IDENTIFICADO

Você está abrindo o arquivo diretamente do Windows (file:///), o que **bloqueia módulos ES6** por segurança.

**Erro no console:**
```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

## ✅ SOLUÇÃO: Servidor Local

### Opção 1: Python (Já Iniciado!)

O servidor já está rodando! Acesse:

**👉 http://localhost:8000**

### Opção 2: Se o Python não funcionar

#### Usando Node.js:
```bash
npx serve
```
Depois acesse a URL que aparecer (geralmente http://localhost:3000)

#### Usando VS Code:
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## 📋 Passos

1. ✅ Servidor iniciado (Python na porta 8000)
2. ⏭️ Abra o navegador
3. ⏭️ Acesse: **http://localhost:8000**
4. ⏭️ Clique em "Iniciar Missão"
5. ✅ Deve funcionar!

## 🔍 Verificar se Funcionou

No console (F12), você deve ver:
- ✅ "Nexus Prism inicializado com sucesso!"
- ✅ "Elementos encontrados: [...]"

E ao clicar em "Iniciar Missão":
- ✅ "Botão clicado!"
- ✅ "Iniciando jogo..."
- ✅ "Jogo iniciado!"

## ⚠️ IMPORTANTE

**NUNCA abra arquivos HTML com módulos ES6 diretamente!**
Sempre use um servidor local para desenvolvimento web.

---

**Acesse agora: http://localhost:8000** 🎮


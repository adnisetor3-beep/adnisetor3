# 🚀 EventFlow - Sistema de Agenda Corporativa

## 📋 Início Rápido

### 1. Iniciar o Sistema

**Opção mais fácil:** Clique duas vezes em `iniciar.bat`

Isso iniciará automaticamente:
- ✅ Servidor de Dados (porta 3001)
- ✅ Aplicação Web (porta 3000)
- ✅ Banco de Dados JSON

### 2. Acessar no Navegador

Abra seu navegador e acesse:
```
http://localhost:3000/
```

### 3. Fazer Login

Use uma das contas de demo:

| Email | Senha | Função |
|-------|-------|--------|
| admin@demo.com | 123 | Administrador |
| user@demo.com | 123 | Usuário Comum |
| viewer@demo.com | 123 | Visualizador |

---

## 💾 Banco de Dados

Todos os seus dados são **automaticamente salvos** em:

```
data/
├── events.json      # Eventos/Compromissos
└── users.json       # Usuários
```

✅ **Dados persistem** ao fechar e reabrir a página!

---

## 🎯 Funcionalidades

### 👤 Usuários
- ✅ Criar/Editar/Deletar usuários
- ✅ Gerenciar permissões (Admin, Comum, Visualizador)
- ✅ Ativar/Desativar contas

### 📅 Eventos
- ✅ Criar eventos em datas específicas
- ✅ Solicitar aprovação (usuários comuns)
- ✅ Aprovar/Rejeitar eventos (admin)
- ✅ Ver calendario mensal
- ✅ Editar/Deletar eventos

### 🔐 Segurança
- ✅ Login com controle de acesso
- ✅ Roles: ADMIN | COMMON | VIEWER
- ✅ Dados isolados por permissão

---

## 📂 Estrutura do Projeto

```
Agenda Julio/
│
├── 🚀 iniciar.bat              # Iniciar tudo (clique aqui!)
│
├── 📁 src/                     # Código-fonte
│   ├── components/             # Componentes React
│   ├── pages/                  # Páginas (Login, Dashboard, Admin)
│   ├── context/                # Estados globais
│   └── services/               # Serviços (storage, API)
│
├── 📁 data/                    # 💾 BANCO DE DADOS
│   ├── events.json
│   └── users.json
│
├── 📄 server.ts                # Servidor de Dados (Node.js)
├── 📄 package.json             # Dependências
├── 📄 vite.config.ts           # Config Vite
│
├── 📘 BANCO_DE_DADOS.md        # Documentação do BD
└── 📘 README.md                # Este arquivo
```

---

## ⚡ Comandos Úteis

```bash
# Iniciar tudo de uma vez
npm run dev:all

# Apenas aplicação web
npm run dev

# Apenas servidor de dados
npm run server

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🔧 Requisitos

- **Node.js** 16+ 
- **npm** (incluído com Node.js)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

---

## ❓ FAQ

**P: Onde meus dados são salvos?**
R: Em arquivos JSON na pasta `data/`. Você também vê no localStorage do navegador.

**P: Meus dados desaparecem?**
R: Não! Eles estão em `data/events.json` e `data/users.json`. Verifique se ambos os servidores (Vite e Node.js) estão rodando.

**P: Posso editar os dados manualmente?**
R: Sim! Edite `data/events.json` ou `data/users.json` com qualquer editor de texto. O sistema lerá ao recarregar.

**P: Como faço backup?**
R: Copie a pasta `data/` para um local seguro.

**P: Erro de porta em uso?**
R: Se porta 3000 ou 3001 estiverem ocupadas, modifique em `vite.config.ts` (porta 3000) ou `server.ts` (porta 3001).

---

## 🐛 Solução de Problemas

### Tela em branco
1. Verifique Console (`F12`) para erros
2. Limpe cache: `Ctrl+Shift+Delete`
3. Reinicie o servidor: `npm run dev:all`

### Dados não salvam
1. Verifique se `npm run server` está rodando
2. Abra DevTools (`F12`) → Network
3. Procure por erros em requisições para `localhost:3001`

### Porta ocupada
```bash
# Windows - Encontre o processo usando a porta
netstat -ano | findstr :3000
# Mate o processo
taskkill /PID <PID> /F
```

---

## 📞 Suporte

Tecnologias utilizadas:
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Express.js
- **Database:** JSON Files
- **UI Icons:** Lucide React

---

## 📝 Notas de Desenvolvimento

- Aplicação é **Progressive Web App** (funciona offline)
- Dados sincronizam automaticamente entre abas
- Suporta temas escuro/claro (Tailwind)
- Responsivo para mobile/tablet/desktop

---

**EventFlow © 2024** - Desenvolvido com ❤️ para gerenciamento de agendas corporativas

---

### 🎉 Pronto para usar!

Se tudo funcionar corretamente, você verá:
- Tela de login colorida (roxo/azul)
- Calendário com eventos
- Painel administrativo (para admin)
- Dados salvos automaticamente

**Divirta-se usando EventFlow!** 🚀

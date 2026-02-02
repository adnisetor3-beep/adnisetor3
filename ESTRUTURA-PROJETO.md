# 📂 Estrutura Final do Projeto

```
C:\Users\Henrique\Desktop\Agenda Julio\
│
├── 🚀 SCRIPTS DE INICIALIZAÇÃO
│   ├── iniciar.bat                    ⭐ CLIQUE AQUI PRIMEIRO!
│   │   └─ Inicia Vite + Servidor (tudo em um)
│   ├── iniciar-frontend.bat           (Apenas Vite)
│   └── iniciar-servidor.bat           (Apenas Servidor)
│
├── 📖 DOCUMENTAÇÃO (Escolha por tema)
│   ├── INDICE.md                      ← Comece aqui!
│   ├── LEIA-ME.md                     (Rápido - 5 min)
│   ├── GUIA-VISUAL.md                 (Exemplos - 10 min)
│   ├── BANCO_DE_DADOS.md              (BD - 15 min)
│   ├── REFERENCIA-TECNICA.md          (Técnico - 20 min)
│   ├── ALTERACOES-REALIZADAS.md       (Mudanças)
│   └── SUMARIO-ARQUIVOS.md            (Arquivos criados)
│
├── 💾 BANCO DE DADOS (Seus dados aqui!)
│   └── data/
│       ├── events.json                (Todos os eventos)
│       └── users.json                 (Todos os usuários)
│
├── 🔧 CÓDIGO PRINCIPAL
│   ├── src/
│   │   ├── App.tsx                    (Componente raiz)
│   │   ├── index.tsx                  (Entry point)
│   │   ├── types.ts                   (Tipos TypeScript)
│   │   │
│   │   ├── pages/                     (Telas principais)
│   │   │   ├── Login.tsx              (Tela de login)
│   │   │   ├── Dashboard.tsx          (Calendário)
│   │   │   └── AdminPanel.tsx         (Painel admin)
│   │   │
│   │   ├── components/                (Componentes React)
│   │   │   ├── Layout.tsx             (Sidebar + layout)
│   │   │   └── EventModal.tsx         (Modal de eventos)
│   │   │
│   │   ├── context/                   (Estados globais)
│   │   │   ├── AuthContext.tsx        (Login)
│   │   │   ├── DataContext.tsx        (Eventos/Usuários)
│   │   │   └── ToastContext.tsx       (Notificações)
│   │   │
│   │   └── services/
│   │       └── storage.ts             (API de sincronização)
│   │
│   ├── index.html                     (HTML principal)
│   ├── index.css                      (Estilos globais)
│   │
│   ├── server.ts                      🖥️ SERVIDOR NODE.JS
│   │   └─ Express API na porta 3001
│   │
│   ├── package.json                   (Dependências)
│   ├── tsconfig.json                  (Config TypeScript)
│   ├── vite.config.ts                 (Config Vite)
│   └── .gitignore                     (Git ignore)
│
├── 📦 DEPENDÊNCIAS (Gerenciadas)
│   └── node_modules/                  (npm install)
│
└── 🏗️ BUILD (Gerado em produção)
    └── dist/                          (npm run build)
```

---

## 🎯 O Que Cada Arquivo Faz

### 🚀 Inicialização

```
iniciar.bat
├─ Verifica Node.js instalado
├─ Instala npm packages
├─ Cria pasta data/
└─ Executa: npm run dev:all
   ├─ Vite (http://localhost:3000)
   └─ Servidor (http://localhost:3001)
```

### 📖 Documentação

| Arquivo | Pra Quem | Tema |
|---------|---------|------|
| **INDICE.md** | Todos | Navegação dos docs |
| **LEIA-ME.md** | Usuários | Como usar rápido |
| **GUIA-VISUAL.md** | Usuários | Passo a passo |
| **BANCO_DE_DADOS.md** | Admin/Dev | Como funciona BD |
| **REFERENCIA-TECNICA.md** | Devs | Arquitetura |
| **ALTERACOES-REALIZADAS.md** | Devs | O que mudou |
| **SUMARIO-ARQUIVOS.md** | Devs | Arquivos criados |

### 💾 Dados

```
data/
├─ events.json
│  ├─ { id, title, description, date, requesterId, status }
│  ├─ { id, title, description, date, requesterId, status }
│  └─ ...
│
└─ users.json
   ├─ { id, name, email, password, role, active }
   ├─ { id, name, email, password, role, active }
   └─ ...
```

### 🔧 Frontend (src/)

```
App.tsx (raiz)
├─ HashRouter (navegação)
├─ ToastProvider (notificações)
├─ DataProvider (eventos/usuários)
└─ AuthProvider (login)
   ├─ /login → Login.tsx
   ├─ / → Dashboard.tsx (protegido)
   └─ /admin → AdminPanel.tsx (protegido)

Componentes:
├─ Layout.tsx (sidebar + main)
└─ EventModal.tsx (criar/editar eventos)

Contextos:
├─ AuthContext (currentUser, login, logout)
├─ DataContext (events, users, CRUD)
└─ ToastContext (notificações)

Serviços:
└─ storage.ts (sincronização com servidor)
```

### 🖥️ Backend (server.ts)

```
server.ts (Express)
├─ Porta 3001
├─ CORS habilitado
├─ Rotas:
│  ├─ GET/POST/PUT/DELETE /api/events
│  ├─ GET/POST/PUT/DELETE /api/users
│  ├─ GET /api/sync
│  └─ GET /api/health
└─ Armazena em:
   ├─ data/events.json
   └─ data/users.json
```

---

## 🔄 Fluxo de Execução

### Inicialização

```
1. Duplo clique em iniciar.bat
2. npm run dev:all (concurrently)
   ├─ npm run dev
   │  └─ Vite inicia → http://localhost:3000
   └─ npm run server
      └─ Express inicia → http://localhost:3001
3. Aguarde mensagens "ready" em ambos
4. Abra navegador em http://localhost:3000/
```

### Ao Usar (Criar Evento)

```
1. Usuário clica 2x em dia
2. Modal abre
3. Usuário digita título + descrição
4. Clica "Solicitar Evento"
5. addEvent() em DataContext
6. Salva em localStorage IMEDIATO
7. persistEvents() chama API
8. Servidor salva em events.json
9. UI atualiza com novo evento
✅ Pronto! Persiste para sempre
```

### Ao Reabrir

```
1. Usuário abre http://localhost:3000/
2. React inicia
3. getLocalEvents() carrega do localStorage
4. UI mostra eventos IMEDIATAMENTE ⚡
5. Em background: fetchInitialData()
6. Se servidor offline: usa localStorage
7. Se servidor online: sincroniza
✅ Dados sempre disponíveis
```

---

## 📊 Tamanho & Localização

### Disco

```
Agenda Julio/
├─ src/ (código)           ~2 MB
├─ data/                   <1 MB (cresce com uso)
├─ node_modules/           ~500 MB (gerado)
├─ dist/ (build)           ~1 MB (gerado)
└─ Outros arquivos         ~1 MB
─────────────────────────────────────
Total sem node_modules     ~10 MB
Total com node_modules     ~510 MB
```

### Estrutura Recomendada

```
Para Versionamento (git):
├─ src/                    ✅ Sincronize
├─ data/                   ❌ Ignore (dados locais)
├─ node_modules/           ❌ Ignore (gerado)
├─ dist/                   ❌ Ignore (gerado)
├─ package.json            ✅ Sincronize
├─ package-lock.json       ✅ Sincronize
└─ Documentação            ✅ Sincronize
```

---

## 🔗 Conexões Entre Arquivos

### Frontend → Backend

```
Componente React
    ↓
Contexto (DataContext)
    ↓
services/storage.ts
    ↓
localStorage
    ↓
HTTP POST/PUT/GET
    ↓
server.ts (Express)
    ↓
data/events.json
data/users.json
```

### Backend → Frontend

```
server.ts GET /api/sync
    ↓
data/events.json
data/users.json
    ↓
HTTP Response JSON
    ↓
services/storage.ts
    ↓
localStorage + Context
    ↓
React Component (UI atualiza)
```

---

## 📋 Dependências Instaladas

### Runtime
```json
{
  "react": "19.2.3",
  "react-router-dom": "7.12.0",
  "react-dom": "19.2.3",
  "date-fns": "4.1.0",
  "lucide-react": "0.562.0",
  "express": "4.18.2",
  "cors": "2.8.5"
}
```

### Dev Only
```json
{
  "typescript": "5.8.2",
  "vite": "6.4.1",
  "@vitejs/plugin-react": "5.0.0",
  "@types/node": "22.14.0",
  "@types/express": "4.17.21",
  "@types/cors": "2.8.17",
  "tsx": "4.7.0",
  "concurrently": "8.2.2"
}
```

---

## 🎨 Portas & URLs

### Desenvolvimento

```
Frontend:  http://localhost:3000/
Backend:   http://localhost:3001/

Endpoints Backend:
  GET  /api/sync
  GET  /api/health
  GET  /api/events
  POST /api/events
  PUT  /api/events/:id
  DELETE /api/events/:id
  (idem para /api/users)
```

### Produção (Exemplo)

```
Frontend:  https://seuapp.vercel.app
Backend:   https://api.seuapp.com
```

---

## ✅ Checklist de Estrutura

- [ ] Pasta `src/` existe com componentes
- [ ] Pasta `data/` existe vazia
- [ ] `server.ts` está na raiz
- [ ] `iniciar.bat` está na raiz
- [ ] `package.json` com scripts atualizados
- [ ] `index.css` com estilos
- [ ] Documentação .md presente
- [ ] `node_modules/` será criado ao `npm install`
- [ ] `dist/` será criado ao `npm run build`

---

## 🚀 Próximos Passos

1. Execute `iniciar.bat`
2. Abra http://localhost:3000/
3. Faça login (admin@demo.com / 123)
4. Crie um evento
5. Abra `data/events.json` - evento está lá! ✅
6. Feche navegador e reabra - evento continua! ✅

---

## 📞 Dúvidas?

- Usuário final? → Leia [LEIA-ME.md](LEIA-ME.md)
- Desenvolvedor? → Leia [REFERENCIA-TECNICA.md](REFERENCIA-TECNICA.md)
- Administrador? → Leia [BANCO_DE_DADOS.md](BANCO_DE_DADOS.md)
- Perdido? → Veja [INDICE.md](INDICE.md)

---

**EventFlow © 2024 - Sistema de Agenda Corporativa Completo** ✅

Estrutura pronta para uso em: `c:\Users\Henrique\Desktop\Agenda Julio\`

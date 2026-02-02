# 🔧 Referência Técnica - EventFlow

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                   NAVEGADOR (Frontend)                  │
│  React 19 + TypeScript + Vite + Tailwind CSS           │
│  ├─ páginas (Login, Dashboard, AdminPanel)             │
│  ├─ componentes (Layout, EventModal)                   │
│  ├─ context (Auth, Data, Toast)                        │
│  └─ services (storage)                                 │
│       ↓                                                  │
│  localStorage (Cache Local)                             │
└─────────────────────────────────────────────────────────┘
                          ↕ API HTTP
┌─────────────────────────────────────────────────────────┐
│              NODE.JS SERVER (Backend)                   │
│  Express.js + CORS                                      │
│  ├─ GET/POST/PUT/DELETE /api/events                   │
│  ├─ GET/POST/PUT/DELETE /api/users                    │
│  ├─ GET /api/sync                                      │
│  └─ GET /api/health                                    │
│       ↓                                                  │
│  JSON Files (Banco de Dados)                            │
│  ├─ data/events.json                                   │
│  └─ data/users.json                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Frontend
```json
{
  "React": "19.2.3",
  "React Router": "7.12.0",
  "TypeScript": "5.8.2",
  "Vite": "6.4.1",
  "Tailwind CSS": "via CDN",
  "Lucide React": "0.562.0 (Icons)",
  "date-fns": "4.1.0 (Datas)"
}
```

### Backend
```json
{
  "Node.js": "18+ (recomendado)",
  "Express": "4.18.2",
  "CORS": "2.8.5",
  "TypeScript": "5.8.2",
  "TSX": "4.7.0 (Runtime TS)"
}
```

### DevTools
```json
{
  "Vite": "6.4.1",
  "Concurrently": "8.2.2 (Rodar múltiplos processos)",
  "Tailwind CSS": "via Script CDN"
}
```

---

## Estrutura de Diretórios

```
Agenda Julio/
│
├── 📄 package.json                    # Dependências e scripts
├── 📄 tsconfig.json                   # Config TypeScript
├── 📄 vite.config.ts                  # Config Vite
├── 📄 index.html                      # HTML principal
├── 📄 index.css                       # Estilos globais
├── 📄 index.tsx                       # Entry point React
│
├── 🖥️ server.ts                       # Servidor Node.js/Express
│
├── 📁 src/
│   ├── App.tsx                        # Componente raiz
│   │
│   ├── components/
│   │   ├── Layout.tsx                 # Layout com sidebar
│   │   └── EventModal.tsx             # Modal de eventos
│   │
│   ├── pages/
│   │   ├── Login.tsx                  # Tela de login
│   │   ├── Dashboard.tsx              # Calendário/agenda
│   │   └── AdminPanel.tsx             # Painel admin
│   │
│   ├── context/
│   │   ├── AuthContext.tsx            # Autenticação
│   │   ├── DataContext.tsx            # Estado global de dados
│   │   └── ToastContext.tsx           # Notificações
│   │
│   ├── services/
│   │   └── storage.ts                 # API de sincronização
│   │
│   └── types.ts                       # Tipos TypeScript
│
├── 📁 data/                           # 💾 BANCO DE DADOS
│   ├── events.json                    # Eventos salvos
│   └── users.json                     # Usuários salvos
│
├── 📁 node_modules/                   # (Gerado automaticamente)
├── 📁 dist/                           # (Gerado em build)
│
├── 🚀 iniciar.bat                     # Script: tudo
├── 🚀 iniciar-frontend.bat            # Script: só frontend
├── 🚀 iniciar-servidor.bat            # Script: só servidor
│
├── 📘 README.md                       # (Original)
├── 📘 LEIA-ME.md                      # Guia em português
├── 📘 GUIA-VISUAL.md                  # Guia com exemplos
├── 📘 BANCO_DE_DADOS.md               # Documentação BD
└── 📘 REFERENCIA-TECNICA.md           # Este arquivo
```

---

## Flow de Dados

### Criação de Evento

```
1. Usuário clica 2x em um dia
   ↓
2. Modal abre com formulário
   ↓
3. Usuário preenche título + descrição
   ↓
4. Clica "Solicitar Evento"
   ↓
5. addEvent() em DataContext.tsx é chamado:
   a) Cria novo EventRequest com UUID
   b) Adiciona à lista local
   c) chama persistEvents() em background
   ↓
6. persistEvents() (storage.ts):
   a) Salva em localStorage IMEDIATAMENTE
   b) Tenta sincronizar com servidor HTTP
   c) Se falhar, dados já estão no localStorage
   ↓
7. Servidor recebe PUT /api/events
   a) Atualiza arquivo events.json
   b) Retorna sucesso
   ↓
8. UI atualiza mostrando o novo evento
   ✅ PERSISTIDO EM DOIS LUGARES:
      - localStorage (rápido)
      - data/events.json (durável)
```

### Sincronização ao Reabrir

```
1. Usuário abre http://localhost:3000/
   ↓
2. React inicia DataContext
   ↓
3. getLocalEvents() carrega do localStorage
   ↓
4. UI mostra dados IMEDIATAMENTE ⚡
   (Sem esperar servidor!)
   ↓
5. Em background, fetchInitialData() é executado:
   a) Faz GET /api/sync
   b) Compara com localStorage
   c) Se houver diferenças, atualiza
   ↓
6. Se servidor falhar:
   a) Usa dados do localStorage
   b) Funciona OFFLINE ✅
```

---

## Estrutura de Dados

### Event (events.json)

```typescript
interface EventRequest {
  id: string;                  // UUID único
  title: string;               // "Reunião de Vendas"
  description: string;         // Descrição longa
  date: string;               // "2026-01-20" (YYYY-MM-DD)
  requesterId: string;        // ID do usuário que solicitou
  requesterName: string;      // Nome do solicitante
  status: EventStatus;        // "PENDING" | "APPROVED" | "REJECTED"
}
```

### User (users.json)

```typescript
interface User {
  id: string;                 // UUID único
  name: string;              // "João Silva"
  email: string;             // "joao@empresa.com"
  password: string;          // Hash (em produção)
  role: UserRole;            // "ADMIN" | "COMMON" | "VIEWER"
  active: boolean;           // true/false
}
```

### Enums

```typescript
enum EventStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

enum UserRole {
  ADMIN = "ADMIN",
  COMMON = "COMMON",
  VIEWER = "VIEWER"
}
```

---

## Endpoints da API

### Eventos

```http
GET http://localhost:3001/api/events
Response: EventRequest[]

POST http://localhost:3001/api/events
Body: Partial<EventRequest>
Response: EventRequest

PUT http://localhost:3001/api/events/:id
Body: Partial<EventRequest>
Response: EventRequest

DELETE http://localhost:3001/api/events/:id
Response: { message: "Deletado" }
```

### Usuários

```http
GET http://localhost:3001/api/users
Response: User[]

POST http://localhost:3001/api/users
Body: Partial<User>
Response: User

PUT http://localhost:3001/api/users/:id
Body: Partial<User>
Response: User

DELETE http://localhost:3001/api/users/:id
Response: { message: "Deletado" }
```

### Sincronização

```http
GET http://localhost:3001/api/sync
Response: {
  users: User[],
  events: EventRequest[]
}

GET http://localhost:3001/api/health
Response: {
  status: "ok",
  timestamp: "2026-01-16T10:30:00Z"
}
```

---

## Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Digita email e senha
   ↓
3. onClick handler chama login()
   ↓
4. login() em AuthContext busca usuário em DataContext.users
   ↓
5. Compara senha (simples - em produção use hash!)
   ↓
6. Se sucesso:
   a) Salva em contexto AuthContext
   b) Redireciona para /
   c) <ProtectedRoute> deixa passar
   ↓
7. Se falha:
   a) Mostra toast de erro
   b) Fica em /login
```

---

## Variáveis de Ambiente

### .env.local (Não é necessário para funcionamento básico)

```env
# Se precisar usar variáveis diferentes
VITE_API_PORT=3001
VITE_APP_PORT=3000
```

### Sem .env

O sistema usa valores hardcoded:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

---

## Performance

### Otimizações Implementadas

1. **Cache de dados em localStorage**
   - Reduz requisições ao servidor
   - Funciona offline

2. **Lazy loading com React Router**
   - Componentes carregam sob demanda
   - Reduz bundle inicial

3. **Memoization com useMemo**
   - Filtragem de eventos otimizada
   - Calendário não renderiza desnecessariamente

4. **Event delegation**
   - Modal e backdrop usam event bubbling eficientemente

5. **CSS otimizado**
   - Tailwind CSS purga classes não usadas
   - Vite minifica automaticamente

---

## Segurança (Notas)

⚠️ **Versão Demo - Não é Production-Ready**

### Falta implementar em produção:

1. ❌ Hash de senhas (usa texto plano agora)
2. ❌ JWT/Sessions (sem autenticação real)
3. ❌ HTTPS (usa HTTP)
4. ❌ Validação de dados no servidor
5. ❌ Rate limiting
6. ❌ CSRF protection
7. ❌ SQL Injection (n/a - JSON, mas validar)
8. ❌ XSS prevention (Tailwind + React já mitiga)

### Para produção:

```bash
npm install bcryptjs jsonwebtoken helmet express-validator
```

---

## Desenvolvimento

### Adicionar Novo Componente

1. Crie arquivo em `src/components/NomeComponente.tsx`
2. Exporte como função React
3. Importe e use em outra página
4. Vite detecta mudança automaticamente (HMR)

### Adicionar Nova Página

1. Crie em `src/pages/NomePagina.tsx`
2. Adicione rota em `App.tsx`
3. Adicione link no `Layout.tsx`

### Adicionar Novo Context

1. Crie em `src/context/NomeContext.tsx`
2. Exporte Provider e hook (useNome)
3. Envolva <App> com o provider

### Adicionar Novo Endpoint no Servidor

1. Abra `server.ts`
2. Adicione função em `app.get()`, `app.post()`, etc.
3. Reinicie: `npm run server`

---

## Build & Deploy

### Build para Produção

```bash
npm run build
```

Gera pasta `dist/` com:
- HTML minificado
- JS/CSS otimizado
- Ready para deploy

### Servir Build Localmente

```bash
npm run preview
```

### Deploy Sugerido

Para hospedar:
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Render, Railway, Heroku, AWS

---

## Troubleshooting Técnico

### Hot Module Replacement (HMR) não funciona

```bash
# Reinicie Vite
npm run dev

# Ou modifique vite.config.ts:
// Adicione ao defineConfig:
server: {
  hmr: {
    host: 'localhost',
    port: 5173
  }
}
```

### TypeScript errors

```bash
# Verifique o tsconfig.json
# Rode verificação:
npx tsc --noEmit
```

### Tipos não reconhecidos

```bash
# Instale tipos das dependências:
npm install --save-dev @types/react @types/node
```

---

## Próximas Melhorias Sugeridas

- [ ] Autenticação com JWT
- [ ] Hash de senhas com bcrypt
- [ ] Banco de dados relacional (PostgreSQL)
- [ ] API mais robusta (GraphQL)
- [ ] Notificações em tempo real (WebSockets)
- [ ] Testes automatizados (Jest, Vitest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Dark mode/Theme switcher
- [ ] Integração com Google Calendar
- [ ] Exportação de eventos (PDF, ICS)
- [ ] Comentários nos eventos
- [ ] Sistema de permissões granular

---

## Referências

- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org
- Vite Docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Express.js: https://expressjs.com
- date-fns: https://date-fns.org

---

**EventFlow © 2024** - Documentação Técnica Completa

Última atualização: 16/01/2026

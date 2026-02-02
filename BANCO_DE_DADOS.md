# 🗄️ Banco de Dados - EventFlow Agenda

## Estrutura do Banco de Dados

O sistema EventFlow agora possui um **banco de dados persistente baseado em arquivos JSON**. Todos os dados são armazenados em pasta `data/` do projeto.

### Arquivos de Dados

```
/data/
├── events.json    # Todos os eventos/compromissos agendados
└── users.json     # Usuários do sistema (admin, comum, visualizador)
```

---

## Características de Persistência

### ✅ Dupla Camada de Armazenamento

1. **localStorage (Navegador)**
   - Armazena dados localmente no navegador
   - Carregamento instantâneo ao reabrir a página
   - Funciona offline

2. **Servidor JSON (Node.js)**
   - Armazena dados em arquivos permanentes (`data/events.json` e `data/users.json`)
   - Sincronização automática entre dispositivos
   - Backup de dados

### 🔄 Sincronização Automática

- Dados são salvos localmente **PRIMEIRO** para responsividade imediata
- Sincronização com servidor ocorre em **background**
- Se o servidor não estiver disponível, os dados são mantidos localmente
- Quando o servidor volta online, sincronização ocorre automaticamente

---

## Como Usar

### 1️⃣ Iniciar o Sistema

**Opção A: Arquivo .bat (Recomendado)**
```bash
# Simplesmente clique duas vezes em:
iniciar.bat
```

**Opção B: Linha de Comando**
```bash
npm run dev:all    # Inicia Vite + Servidor Node.js
```

**Opção C: Separado**
```bash
# Terminal 1: Aplicação Frontend
npm run dev

# Terminal 2: Servidor de Dados
npm run server
```

### 2️⃣ Acessar o Sistema

- **Aplicação Web:** http://localhost:3000/
- **Servidor de Dados:** http://localhost:3001/

### 3️⃣ Dados Persistem Após Fechar

Ao fechar o navegador e reabrir:
- ✅ Todos os eventos aparecem (localStorage)
- ✅ Todos os usuários estão salvos
- ✅ Sincronização ocorre automaticamente

---

## Estrutura dos Dados

### 📅 Evento (events.json)

```json
{
  "id": "uuid-unico",
  "title": "Reunião de Vendas",
  "description": "Discussão sobre metas Q1",
  "date": "2026-01-20",
  "requesterId": "2",
  "requesterName": "João Silva",
  "status": "PENDING"  // PENDING | APPROVED | REJECTED
}
```

### 👤 Usuário (users.json)

```json
{
  "id": "1",
  "name": "Administrador (Local)",
  "email": "admin@demo.com",
  "password": "123",
  "role": "ADMIN",  // ADMIN | COMMON | VIEWER
  "active": true
}
```

---

## API REST do Servidor

O servidor oferece as seguintes endpoints:

### Eventos

```bash
GET    http://localhost:3001/api/events       # Listar todos
POST   http://localhost:3001/api/events       # Criar novo
PUT    http://localhost:3001/api/events/:id   # Atualizar
DELETE http://localhost:3001/api/events/:id   # Deletar
```

### Usuários

```bash
GET    http://localhost:3001/api/users        # Listar todos
POST   http://localhost:3001/api/users        # Criar novo
PUT    http://localhost:3001/api/users/:id    # Atualizar
DELETE http://localhost:3001/api/users/:id    # Deletar
```

### Sincronização

```bash
GET    http://localhost:3001/api/sync         # Sincronizar tudo
GET    http://localhost:3001/api/health       # Verificar status
```

---

## Backup e Restauração

### 📦 Fazer Backup

Os dados estão em:
```
seu_projeto/data/events.json
seu_projeto/data/users.json
```

Copie esses arquivos para um local seguro.

### 🔄 Restaurar Backup

1. Feche o servidor (`Ctrl+C`)
2. Copie os arquivos de backup para pasta `data/`
3. Reinicie: `iniciar.bat`

### 🗑️ Limpar Dados

Delete os arquivos em `data/` para voltar aos valores iniciais. Serão recriados com dados padrão ao reiniciar.

---

## Solução de Problemas

### ❌ Erro: "Servidor indisponível"

**Causa:** Servidor Node.js não está rodando
**Solução:** Verifique se `npm run server` está ativo (Terminal mostrará a porta 3001)

### ❌ Dados desaparecem após fechar

**Causa:** localStorage foi limpo ou não sincronizou
**Solução:** 
- Verifique se `npm run server` está rodando
- Limpe o cache do navegador e reabra
- Verifique se há erros no console (`F12`)

### ❌ Erro ao instalar dependências

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Reinstalar
npm install
```

---

## Estrutura de Pastas

```
Agenda Julio/
├── data/                    # 📂 BANCO DE DADOS
│   ├── events.json         # Eventos salvos
│   └── users.json          # Usuários salvos
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
├── server.ts               # 🖥️ Servidor Node.js
├── iniciar.bat             # 🚀 Iniciar sistema
├── package.json            # Dependências
└── vite.config.ts          # Config Vite
```

---

## 🎯 Resumo

| Recurso | Antes | Agora |
|---------|-------|-------|
| **Persistência de Dados** | ❌ Apenas localStorage | ✅ localStorage + Servidor JSON |
| **Dados após fechar** | ❌ Apagados | ✅ Salvos permanentemente |
| **Backup** | ❌ Manual | ✅ Automático em JSON |
| **Sincronização** | ❌ Nenhuma | ✅ Automática entre abas |
| **Inicialização** | ❌ npm run dev | ✅ iniciar.bat (tudo em um) |

---

## 📞 Suporte

Para mais informações sobre a arquitetura:
- **Frontend:** React + Vite + TypeScript
- **Backend:** Express.js + Node.js
- **Database:** JSON Files (sem dependências externas)
- **Persistência:** Dual-layer (localStorage + Server)

---

**EventFlow © 2024 - Sistema Completo de Agenda Corporativa**

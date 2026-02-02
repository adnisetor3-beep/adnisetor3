# 🎓 Guia Visual de Uso - EventFlow

## Passo 1: Iniciar o Sistema

### 🖱️ Método Mais Fácil (Recomendado)

1. Abra a pasta do projeto: `Agenda Julio`
2. Procure pelo arquivo `iniciar.bat`
3. **Clique duas vezes** nele

```
Agenda Julio/
│
├── 🚀 iniciar.bat          ← CLIQUE AQUI!
├── iniciar-frontend.bat
├── iniciar-servidor.bat
└── ...outros arquivos...
```

### ⏱️ Aguarde a inicialização

Você verá uma janela preta (Terminal) com mensagens como:
```
✅ Instalando dependências...
✅ Criando banco de dados...
✅ Iniciando servidor...
✅ Servidor iniciado com sucesso!

Servidor de Dados: http://localhost:3001/
Aplicação Web: http://localhost:3000/
```

---

## Passo 2: Acessar a Aplicação

### 🌐 Abrir no Navegador

Após ver a mensagem "Iniciado com sucesso!", abra seu navegador favorito e acesse:

```
http://localhost:3000/
```

Você verá a tela de login:

```
┌─────────────────────────────────┐
│                                 │
│   📅 Bem-vindo                  │
│   Insira suas credenciais       │
│                                 │
│   Email: admin@demo.com         │
│   Senha: ••••••••               │
│                                 │
│   [✓ Acessar Sistema →]        │
│                                 │
│   ACESSO RÁPIDO (DEMO)         │
│   [Admin] [Comum] [Viewer]     │
│                                 │
└─────────────────────────────────┘
```

---

## Passo 3: Fazer Login

### 👤 Escolha um Usuário

Clique em um dos botões "Acesso Rápido":

| Botão | Email | Função |
|-------|-------|--------|
| **Admin** | admin@demo.com | Gerenciar tudo |
| **Comum** | user@demo.com | Criar eventos |
| **Viewer** | viewer@demo.com | Apenas visualizar |

Ou digite manualmente:

```
Email: admin@demo.com
Senha: 123
```

---

## Passo 4: Usar a Aplicação

### 📅 Dashboard (Agenda)

Você verá um calendário com os meses:

```
┌──────────────────────────────────────┐
│  EventFlow                           │
│                                      │
│  ← Janeiro 2026 →                   │
│                                      │
│  DOM SEG TER QUA QUI SEX SÁB        │
│  28  29  30  31   1   2   3         │
│   4   5   6   7   8   9  10         │
│  11  12  13  14  15  16  17         │
│  18  19  20  21  22  23  24         │
│  25  26  27  28  29  30  31         │
│                                      │
│  📍 Hoje: Dia 16 (azul)             │
│                                      │
│  💡 Clique 2x em um dia para criar  │
│     um novo evento                   │
│                                      │
└──────────────────────────────────────┘
```

### ➕ Criar um Evento

1. **Clique 2 vezes** em um dia no calendário
2. Digite o **título** (ex: "Reunião de Vendas")
3. Digite a **descrição** (ex: "Discutir metas Q1")
4. Clique em **"Solicitar Evento"**

```
┌─────────────────────┐
│ Solicitar Novo      │
│ Evento              │
│                     │
│ Data: 20/01/2026    │
│ Título:             │
│ [________________]  │
│                     │
│ Descrição:          │
│ [________________]  │
│ [________________]  │
│ [________________]  │
│                     │
│ [Cancelar] [Enviar]│
└─────────────────────┘
```

✅ O evento aparecerá no calendário!

### ✅ Aprovar Eventos (Admin)

Se você é **Admin**, vá para **"Painel Administrativo"** no menu:

```
┌──────────────────────┐
│ MENU PRINCIPAL       │
│                      │
│ ✓ Minha Agenda       │
│ ◆ Painel Adm.        │
│                      │
└──────────────────────┘
```

No painel, você verá:

```
┌────────────────────────────────┐
│ Painel Administrativo           │
│                                │
│ Total: 3 | Pendentes: 1        │
│ Aprovados: 0 | Total: 0        │
│                                │
│ [Aprovações] [Usuários]        │
│                                │
│ SOLICITAÇÕES PENDENTES         │
│ ┌──────────────────────────┐   │
│ │ Reunião de Vendas        │   │
│ │ João Silva - 20/01/2026  │   │
│ │ Descrição...             │   │
│ │ [✓ Aprovar] [✗ Rejeitar] │   │
│ └──────────────────────────┘   │
│                                │
└────────────────────────────────┘
```

---

## 💾 Seus Dados São Salvos!

### 📁 Onde Ficam?

```
Agenda Julio/
│
└── 📁 data/              ← Seus dados aqui!
    ├── events.json       ← Eventos/Compromissos
    └── users.json        ← Usuários
```

### ✅ O que é Salvo Automaticamente?

- ✅ Todos os eventos que você cria
- ✅ Aprovações/Rejeições
- ✅ Alterações de usuários
- ✅ Tudo persiste após fechar o navegador!

### 🔄 Sincronização

```
Você cria evento
        ↓
Salva no navegador IMEDIATAMENTE
        ↓
Envia para servidor (background)
        ↓
Salva em data/events.json
        ↓
✅ Pronto! Vai ficar aí para sempre
```

---

## ⚠️ Problemas Comuns

### ❌ "Página em branco"

**Solução:**
1. Abra Console (`F12`)
2. Recarregue (`Ctrl+R`)
3. Procure por erros em vermelho
4. Se houver erro de conexão, reinicie o servidor

### ❌ "Dados desaparecem"

**Verificação:**
1. Abra pasta `data/`
2. Procure por `events.json` e `users.json`
3. Se não existem, reinicie o servidor

### ❌ "Porta em uso"

**Significa:** Outro programa está usando a porta 3000 ou 3001

**Solução:**
1. Feche outros servidores
2. Se mesmo assim não funcionar, modifique em `vite.config.ts` (linha: `port: 3000`)

---

## 🎯 Checklist de Funcionalidades

- ✅ Calendário mensal interativo
- ✅ Criar eventos por data
- ✅ Aprovar/Rejeitar eventos (admin)
- ✅ Gerenciar usuários (admin)
- ✅ 3 níveis de acesso (Admin, Comum, Viewer)
- ✅ Dados persistem permanentemente
- ✅ Responsivo (mobile/tablet/desktop)
- ✅ Interface moderna e colorida

---

## 📞 Precisa de Ajuda?

### 🔍 Verificar Status

No Terminal, você verá informações importantes:

```
VITE v6.4.1 ready in 423 ms
Local: http://localhost:3000/
Servidor: http://localhost:3001/
```

### 🧹 Limpar Dados (Reiniciar)

Para voltar aos dados padrão:

1. Feche o servidor (`Ctrl+C` no terminal)
2. Abra pasta `data/` e **delete** `events.json` e `users.json`
3. Reinicie: `iniciar.bat`

---

## 🚀 Pronto!

Você está pronto para usar EventFlow! 

**Divirta-se organizando seus eventos!** 🎉

---

### Dicas Extras

- 📌 Clique em um evento já criado para editar/deletar
- 🔄 Mudança de usuários: Clique em "Encerrar Sessão"
- 📱 Testa no celular: Acesse de outro dispositivo usando `http://seu-ip:3000/`
- 💾 Faz backup: Copie a pasta `data/` regularmente

---

**EventFlow © 2024** - Desenvolvido para facilitar sua vida! ❤️

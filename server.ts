import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = 3001;

// Usa db.json em desenvolvimento, caso contrário usa data/
const USE_DB_JSON = true; // Mudado para true para usar db.json
const DB_FILE = path.join(__dirname, 'db.json');
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Inicializa diretório de dados
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Dados iniciais padrão
const defaultUsers = [
  {
    id: '1',
    name: 'Administrador (Local)',
    email: 'admin@demo.com',
    password: '123',
    role: 'ADMIN',
    active: true,
  },
  {
    id: '2',
    name: 'Usuário Comum (Local)',
    email: 'user@demo.com',
    password: '123',
    role: 'COMMON',
    active: true,
  },
  {
    id: '3',
    name: 'Visualizador (Local)',
    email: 'viewer@demo.com',
    password: '123',
    role: 'VIEWER',
    active: true,
  },
];

// Funções auxiliares para arquivo
const ensureDataFiles = () => {
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
};

const readEvents = () => {
  try {
    if (USE_DB_JSON && fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.events || [];
    }
    const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const readUsers = () => {
  try {
    if (USE_DB_JSON && fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.users || [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultUsers;
  }
};

const writeEvents = (events: any) => {
  if (USE_DB_JSON) {
    const dbPath = DB_FILE;
    let data: any = {};
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
    data.events = events;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  }
};

const writeUsers = (users: any) => {
  if (USE_DB_JSON) {
    const dbPath = DB_FILE;
    let data: any = {};
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
    data.users = users;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
};

// Rotas de Eventos
app.get('/api/events', (req: Request, res: Response) => {
  ensureDataFiles();
  const events = readEvents();
  res.json(events);
});

app.post('/api/events', (req: Request, res: Response) => {
  ensureDataFiles();
  const events = readEvents();
  const newEvent = {
    ...req.body,
    id: req.body.id || crypto.randomUUID(),
  };
  events.push(newEvent);
  writeEvents(events);
  res.status(201).json(newEvent);
});

// Rota para sincronizar TODOS os eventos (usado pelo DataContext)
app.put('/api/events', (req: Request, res: Response) => {
  ensureDataFiles();
  const events = req.body;
  
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Corpo deve ser um array de eventos' });
  }
  
  writeEvents(events);
  res.json({ success: true, message: 'Eventos sincronizados' });
});

app.put('/api/events/:id', (req: Request, res: Response) => {
  ensureDataFiles();
  const events = readEvents();
  const index = events.findIndex((e: any) => e.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }
  
  events[index] = { ...events[index], ...req.body };
  writeEvents(events);
  res.json(events[index]);
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  ensureDataFiles();
  const events = readEvents();
  const filteredEvents = events.filter((e: any) => e.id !== req.params.id);
  
  if (filteredEvents.length === events.length) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }
  
  writeEvents(filteredEvents);
  res.json({ message: 'Evento deletado com sucesso' });
});

// Rotas de Usuários
app.get('/api/users', (req: Request, res: Response) => {
  ensureDataFiles();
  const users = readUsers();
  res.json(users);
});

app.post('/api/users', (req: Request, res: Response) => {
  ensureDataFiles();
  const users = readUsers();
  const newUser = {
    ...req.body,
    id: req.body.id || crypto.randomUUID(),
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// Rota para sincronizar TODOS os usuários (usado pelo DataContext)
app.put('/api/users', (req: Request, res: Response) => {
  ensureDataFiles();
  const users = req.body;
  
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Corpo deve ser um array de usuários' });
  }
  
  writeUsers(users);
  res.json({ success: true, message: 'Usuários sincronizados' });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  ensureDataFiles();
  const users = readUsers();
  const index = users.findIndex((u: any) => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  users[index] = { ...users[index], ...req.body };
  writeUsers(users);
  res.json(users[index]);
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  ensureDataFiles();
  const users = readUsers();
  const filteredUsers = users.filter((u: any) => u.id !== req.params.id);
  
  if (filteredUsers.length === users.length) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  writeUsers(filteredUsers);
  res.json({ message: 'Usuário deletado com sucesso' });
});

// Rota de sincronização (retorna tudo)
app.get('/api/sync', (req: Request, res: Response) => {
  ensureDataFiles();
  res.json({
    users: readUsers(),
    events: readEvents(),
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicializa servidor
if (!USE_DB_JSON) {
  ensureDataFiles();
}

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                                                            ║`);
  console.log(`║     Servidor de Dados ADNI Itaipu iniciado               ║`);
  console.log(`║     Porta: ${PORT}                                                  ║`);
  console.log(`║     URL: http://localhost:${PORT}                                  ║`);
  console.log(`║     Banco de dados: ${USE_DB_JSON ? 'db.json' : 'data/'}                             ║`);
  console.log(`║                                                            ║`);
  if (!USE_DB_JSON) {
    console.log(`║     Arquivos:                                             ║`);
    console.log(`║     - ${path.relative(process.cwd(), USERS_FILE)}                      ║`);
    console.log(`║     - ${path.relative(process.cwd(), EVENTS_FILE)}                     ║`);
  } else {
    console.log(`║     ${path.relative(process.cwd(), DB_FILE)}                                 ║`);
  }
  console.log(`║                                                            ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});

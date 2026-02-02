import { EventRequest, User, UserRole } from '../types';

// Apenas para desenvolvimento - Firebase é apenas para produção
let database: any = null;
let ref: any = null;
let get: any = null;
let set: any = null;
let update: any = null;
let onValue: any = null;

const USE_FIREBASE = false; // Desabilitar Firebase em desenvolvimento
const API_BASE = 'http://localhost:3001/api';

export type Unsubscribe = () => void;

// --- FALLBACK PARA DADOS LOCAIS ---
const LOCAL_USERS_KEY = 'eventflow_users';
const LOCAL_EVENTS_KEY = 'eventflow_events';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@demo.com',
    password: '123',
    role: UserRole.ADMIN,
    active: true,
  },
  {
    id: '2',
    name: 'Usuário Comum',
    email: 'user@demo.com',
    password: '123',
    role: UserRole.COMMON,
    active: true,
  },
  {
    id: '3',
    name: 'Visualizador',
    email: 'viewer@demo.com',
    password: '123',
    role: UserRole.VIEWER,
    active: true,
  },
];

// --- FUNÇÕES DE CACHE LOCAL (FALLBACK) ---
export const getLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Erro ao ler users do localStorage", e);
    return [];
  }
};

export const getLocalEvents = (): EventRequest[] => {
  try {
    const stored = localStorage.getItem(LOCAL_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Erro ao ler events do localStorage", e);
    return [];
  }
};

export const saveLocalUsers = (users: User[]) => {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Erro ao salvar users no localStorage", e);
  }
};

export const saveLocalEvents = (events: EventRequest[]) => {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn("Erro ao salvar events no localStorage", e);
  }
};


// --- FUNÇÕES DO FIREBASE (SÍNCRONAS EM TEMPO REAL) ---

/**
 * Carrega dados iniciais do servidor Express
 * Fallback para dados locais se o servidor não estiver disponível
 */
export const fetchInitialData = (): Promise<{ users: User[]; events: EventRequest[] }> => {
  return new Promise(async (resolve) => {
    try {
      // Usa um timeout curto para não travar
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const [usersResponse, eventsResponse] = await Promise.all([
        fetch(`${API_BASE}/users`, { signal: controller.signal }).catch(() => null),
        fetch(`${API_BASE}/events`, { signal: controller.signal }).catch(() => null)
      ]);
      
      clearTimeout(timeoutId);

      // Se conseguiu carregar do servidor
      if (usersResponse?.ok && eventsResponse?.ok) {
        const users = await usersResponse.json();
        const events = await eventsResponse.json();

        if (Array.isArray(users) && Array.isArray(events)) {
          saveLocalUsers(users);
          saveLocalEvents(events);
          console.log('✅ Dados carregados do servidor:', { users: users.length, events: events.length });
          resolve({ users, events });
          return;
        }
      }
    } catch (error) {
      console.warn('⚠️ Servidor não disponível, usando dados locais');
    }

    // Fallback para dados locais
    const localUsers = getLocalUsers();
    const localEvents = getLocalEvents();
    
    // Se não houver nada no localStorage, use os dados padrão
    const users = localUsers.length > 0 ? localUsers : initialUsers;
    const events = localEvents;

    if (localUsers.length === 0) {
      saveLocalUsers(users);
    }

    console.log('✅ Usando dados locais:', { users: users.length, events: events.length });
    resolve({ users, events });
  });
};

/**
 * Monitora atualizações em tempo real dos usuários
 */
export const subscribeToUsers = (callback: (users: User[]) => void): Unsubscribe => {
  // Placeholder - em produção com Firebase seria real-time
  // Em desenvolvimento, não fazemos polling para evitar overhead
  return () => {};
};

/**
 * Monitora atualizações em tempo real dos eventos
 */
export const subscribeToEvents = (callback: (events: EventRequest[]) => void): Unsubscribe => {
  // Placeholder - em produção com Firebase seria real-time
  // Em desenvolvimento, não fazemos polling para evitar overhead
  return () => {};
};

/**
 * Persiste usuários no servidor Express
 */
export const persistUsers = (users: User[]): Promise<boolean> => {
  // Sempre salva localmente primeiro
  saveLocalUsers(users);

  return new Promise((resolve) => {
    // Tenta salvar no servidor
    fetch(`${API_BASE}/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    })
      .then(response => {
        if (response.ok) {
          console.log('✅ Usuários salvos no servidor');
        } else {
          console.warn('⚠️ Erro ao salvar usuários no servidor');
        }
        resolve(true);
      })
      .catch((err) => {
        console.warn('⚠️ Servidor não disponível, dados salvos localmente');
        resolve(true);
      });
  });
};

/**
 * Persiste eventos no servidor Express
 */
export const persistEvents = (events: EventRequest[]): Promise<boolean> => {
  // Sempre salva localmente primeiro
  saveLocalEvents(events);

  return new Promise((resolve) => {
    // Tenta salvar no servidor
    fetch(`${API_BASE}/events`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    })
      .then(response => {
        if (response.ok) {
          console.log('✅ Eventos salvos no servidor');
        } else {
          console.warn('⚠️ Erro ao salvar eventos no servidor');
        }
        resolve(true);
      })
      .catch((err) => {
        console.warn('⚠️ Servidor não disponível, dados salvos localmente');
        resolve(true);
      });
  });
};

/**
 * Atualiza um evento específico
 */
export const updateEvent = (eventId: string, updates: Partial<EventRequest>): Promise<boolean> => {
  return new Promise((resolve) => {
    fetch(`${API_BASE}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(() => {
        console.log('✅ Evento atualizado no servidor');
        resolve(true);
      })
      .catch(() => {
        console.warn('⚠️ Erro ao atualizar evento');
        resolve(true);
      });
  });
};

/**
 * Atualiza um usuário específico
 */
export const updateUser = (userId: string, updates: Partial<User>): Promise<boolean> => {
  return new Promise((resolve) => {
    fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(() => {
        console.log('✅ Usuário atualizado no servidor');
        resolve(true);
      })
      .catch(() => {
        console.warn('⚠️ Erro ao atualizar usuário');
        resolve(true);
      });
  });
};
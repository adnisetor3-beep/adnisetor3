// ESTE CÓDIGO DEVE SER COPIADO PARA O ARQUIVO .gs NO APPS SCRIPT

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('EventFlow Agenda')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// --- PERSISTÊNCIA DE DADOS (USANDO SCRIPT PROPERTIES + LOCK) ---

function getBackendData() {
  var props = PropertiesService.getScriptProperties();
  var usersJson = props.getProperty('USERS');
  var eventsJson = props.getProperty('EVENTS');

  var users = usersJson ? JSON.parse(usersJson) : [];
  var events = eventsJson ? JSON.parse(eventsJson) : [];

  // Se não houver usuários (primeira execução), cria os padrões
  if (users.length === 0) {
    users = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@demo.com',
        password: '123',
        role: 'ADMIN',
        active: true,
      },
      {
        id: '2',
        name: 'Usuário Comum',
        email: 'user@demo.com',
        password: '123',
        role: 'COMMON',
        active: true,
      },
      {
        id: '3',
        name: 'Visualizador',
        email: 'viewer@demo.com',
        password: '123',
        role: 'VIEWER',
        active: true,
      }
    ];
    // Salva os defaults
    try {
      props.setProperty('USERS', JSON.stringify(users));
    } catch (e) {
      console.error('Erro ao salvar usuários padrão: ' + e);
    }
  }

  return {
    users: users,
    events: events
  };
}

function saveBackendUsers(users) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Espera até 10s pelo lock
    var props = PropertiesService.getScriptProperties();
    props.setProperty('USERS', JSON.stringify(users));
    return true;
  } catch (e) {
    console.error('Erro ao salvar usuários: ' + e);
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function saveBackendEvents(events) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Espera até 10s pelo lock
    var props = PropertiesService.getScriptProperties();
    props.setProperty('EVENTS', JSON.stringify(events));
    return true;
  } catch (e) {
    console.error('Erro ao salvar eventos: ' + e);
    throw e;
  } finally {
    lock.releaseLock();
  }
}
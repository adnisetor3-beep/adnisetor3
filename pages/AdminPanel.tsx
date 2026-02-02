import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDateBR } from '../utils/dateFormatter';
import { User, UserRole, EventStatus } from '../types';
import { Check, X, ShieldAlert, User as UserIcon, Power, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { events, users, updateEventStatus, addUser, updateUser, toggleUserStatus } = useData();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // User Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.COMMON);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
        <div className="bg-red-50 p-4 rounded-full mb-4">
            <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
        <p className="text-gray-500 mt-2 max-w-md">Esta área é exclusiva para administradores. Por favor, retorne à página principal.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          Voltar para Agenda
        </button>
      </div>
    );
  }

  const pendingEvents = events.filter(e => e.status === EventStatus.PENDING);
  const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED);

  // Stats
  const stats = [
    { title: 'Total de Usuários', value: users.length, icon: Users, color: 'bg-blue-500' },
    { title: 'Eventos Pendentes', value: pendingEvents.length, icon: AlertCircle, color: 'bg-amber-500' },
    { title: 'Eventos Aprovados', value: approvedEvents.length, icon: Check, color: 'bg-green-500' },
    { title: 'Total de Eventos', value: events.length, icon: Calendar, color: 'bg-indigo-500' },
  ];

  const resetUserForm = () => {
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserRole(UserRole.COMMON);
    setEditingUserId(null);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingUserId) {
            const existingUser = users.find(u => u.id === editingUserId);
            if (existingUser) {
                updateUser({
                ...existingUser,
                name: userName,
                email: userEmail,
                password: userPassword ? userPassword : existingUser.password, 
                role: userRole
                });
                addToast('Usuário atualizado com sucesso!', 'success');
            }
        } else {
            addUser({
                name: userName,
                email: userEmail,
                password: userPassword || '123456', 
                role: userRole,
                active: true
            });
            addToast('Usuário criado com sucesso!', 'success');
        }
        setIsUserModalOpen(false);
        resetUserForm();
    } catch (error) {
        addToast('Erro ao salvar usuário.', 'error');
    }
  };

  const openEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserPassword(''); // Don't show password
    setIsUserModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="text-gray-500">Gerencie usuários e aprovações do sistema.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md`}>
                    <stat.icon size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'events' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <AlertCircle size={18} />
          Aprovações <span className="bg-white/20 px-1.5 rounded-md text-xs">{pendingEvents.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Users size={18} />
          Gerenciar Usuários
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
        {activeTab === 'events' ? (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                Solicitações Pendentes
            </h2>
            {pendingEvents.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-3">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-medium">Tudo limpo!</p>
                <p className="text-sm mt-1">Nenhuma solicitação pendente no momento.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingEvents.map(event => (
                  <div key={event.id} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {formatDateBR(event.date)} às {event.time}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">ID: {event.id.slice(0,8)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <UserIcon size={14} />
                                Solicitado por <span className="font-semibold text-gray-700">{event.requesterName}</span>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[140px]">
                            <button 
                                onClick={() => { updateEventStatus(event.id, EventStatus.APPROVED); addToast('Aprovado!', 'success'); }}
                                className="flex-1 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 hover:text-green-800 transition flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Aprovar
                            </button>
                            <button 
                                onClick={() => { updateEventStatus(event.id, EventStatus.REJECTED); addToast('Rejeitado.', 'info'); }}
                                className="flex-1 px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 hover:text-red-800 transition flex items-center justify-center gap-2"
                            >
                                <X size={18} /> Rejeitar
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-0">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Base de Usuários</h2>
                    <p className="text-sm text-gray-500">Gerencie o acesso e permissões.</p>
                </div>
                <button 
                    onClick={() => { resetUserForm(); setIsUserModalOpen(true); }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Users size={18} /> Novo Usuário
                </button>
             </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Função</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                  {user.name.charAt(0)}
                              </div>
                              <div>
                                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                          </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            user.role === UserRole.COMMON ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             user.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                         }`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                             {user.active ? 'Ativo' : 'Inativo'}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { toggleUserStatus(user.id); addToast('Status alterado.', 'info'); }} 
                                className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition" 
                                title={user.active ? "Desativar" : "Ativar"}>
                             <Power size={16} />
                           </button>
                           <button onClick={() => openEditUser(user)} 
                                className="p-2 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg transition">
                             <UserIcon size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{editingUserId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <p className="text-sm text-gray-500 mb-6">Preencha os dados abaixo para salvar.</p>
            
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Endereço de Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="Ex: joao@empresa.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Senha <span className="normal-case font-normal text-gray-400 ml-1">{editingUserId && '(opcional)'}</span>
                </label>
                <input
                  type="password"
                  required={!editingUserId}
                  value={userPassword}
                  onChange={e => setUserPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nível de Acesso</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none bg-white"
                >
                  <option value={UserRole.COMMON}>Usuário Comum</option>
                  <option value={UserRole.VIEWER}>Visualizador</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition"
                >
                  Salvar Dados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
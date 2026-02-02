import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Calendar, Lock, Mail, ArrowRight, Clock, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatDateBR } from '../utils/dateFormatter';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const { events } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        addToast('Login realizado com sucesso!', 'success');
        navigate('/');
      } else {
        addToast('Credenciais inválidas ou usuário inativo', 'error');
      }
    } catch (err) {
      addToast('Erro de conexão', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-orange-500 to-orange-400 transform -skew-y-6 -translate-y-24 z-0 opacity-90"></div>
      
      {/* Header com Logo */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/10 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-medium">
            <Calendar size={24} className="text-orange-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">ADNI SETOR 3</h1>
            <p className="text-xs text-white/80">Gestão de Agenda de Eventos</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="px-5 py-2.5 bg-white text-orange-600 font-display font-bold rounded-lg hover:shadow-lg transition-all shadow-medium text-sm"
            >
              {showLoginForm ? 'Voltar' : 'Fazer Login'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!showLoginForm ? (
        /* Public Events View */
        <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 wave-background">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3">Agenda de Eventos</h2>
              <p className="text-gray-700 text-lg font-body">Confira todos os eventos e reuniões agendadas</p>
            </div>

            {/* Events List */}
            <div className="space-y-3 mb-12">
              {events.length > 0 ? (
                events
                  .filter(e => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const eventDate = new Date(e.date);
                    return eventDate >= today;
                  })
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all p-5 md:p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} className="text-adni-laranja" />
                              <span>{formatDateBR(event.date)}</span>
                            </div>

                            {event.time && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={16} className="text-adni-ouro" />
                                <span>{event.time}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-gray-600">
                              <User size={16} className="text-adni-laranja" />
                              <span>{event.requesterName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma atividade agendada para os próximos dias</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Login Form View */
        <div className="relative z-10 flex-1 flex items-center justify-center p-4 wave-background">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-gray-200">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-4">
                <Calendar size={28} />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Bem-vindo</h2>
              <p className="text-gray-600 font-body">Insira suas credenciais para acessar o sistema.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-display font-semibold text-gray-700">Email Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 transition outline-none bg-transparent placeholder-gray-400"
                    placeholder="Preencha seu Email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-display font-semibold text-gray-700">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 transition outline-none bg-transparent placeholder-gray-400"
                    placeholder="Preencha sua Senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 bg-adni-gradient text-white font-display font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processando...' : 'Acessar Sistema'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}

      <p className="relative z-10 text-xs text-gray-500 text-center py-4 border-t border-gray-200">
        © 2024 ADNI SETOR 3. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Login;
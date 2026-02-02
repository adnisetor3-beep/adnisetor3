import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDateBR } from '../utils/dateFormatter';
import { EventStatus, EventRequest } from '../types';
import EventModal from '../components/EventModal';
import { ChevronLeft, ChevronRight, Plus, ChevronDown, Trash2, CalendarDays, Grid3x3, List } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { events, addEvent, updateEventStatus, deleteEvent, updateEventDetails } = useData();
  const { currentUser, isCommon, isAdmin } = useAuth();
  const { addToast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // New: view mode state
  const [tableFilterDate, setTableFilterDate] = useState<string | undefined>(undefined); // Filter by date in table

  // Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  // Swipe State - melhorado com rastreamento de Y e tempo
  const [touchStart, setTouchStart] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Double Tap State
  const [lastTapTime, setLastTapTime] = useState(0);
  const [lastTapTarget, setLastTapTarget] = useState<string>('');
  
  // Animation State
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Show all events to all users
  const filteredEvents = useMemo(() => {
    return events;
  }, [events]);

  const getDayEvents = (day: Date) => {
    // Corrigir comparação de data com timezone local
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const date = String(day.getDate()).padStart(2, '0');
    const dayString = `${year}-${month}-${date}`;
    
    return filteredEvents.filter(event => event.date === dayString);
  };

  const handleDayDoubleClick = (day: Date) => {
    if (isCommon || isAdmin) {
      // Corrigir para usar a data em timezone local (não UTC)
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const date = String(day.getDate()).padStart(2, '0');
      setSelectedDay(`${year}-${month}-${date}`);
      setSelectedEvent(null);
      setModalOpen(true);
    }
  };

  const handleTableRowDoubleTap = (dateStr: string) => {
    if (isCommon || isAdmin) {
      setSelectedDay(dateStr);
      setSelectedEvent(null);
      setModalOpen(true);
    }
  };

  const handleTableRowTap = (dateStr: string, e: React.TouchEvent) => {
    e.stopPropagation();
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime;
    
    // Se o último toque foi dentro de 300ms no mesmo elemento, é um duplo-toque
    if (timeSinceLastTap < 300 && lastTapTarget === dateStr) {
      handleTableRowDoubleTap(dateStr);
      setLastTapTime(0); // Reset para evitar triple-tap
    } else {
      setLastTapTime(currentTime);
      setLastTapTarget(dateStr);
    }
  };

  const handleEventClick = (e: React.MouseEvent, event: EventRequest) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDay(undefined);
    setModalOpen(true);
  };

  const handleCreateEvent = (title: string, description: string, date?: string, time?: string) => {
    const eventDate = date || selectedDay;
    const eventTime = time || '09:00';
    if (eventDate && currentUser) {
      addEvent({
        title,
        description,
        date: eventDate,
        time: eventTime,
        requesterId: currentUser.id,
        requesterName: currentUser.name
      });
      addToast('Evento solicitado com sucesso!', 'success');
      setSelectedDay(undefined); // Limpar a data selecionada
    }
  };

  const handleEditEvent = (id: string, title: string, description: string) => {
    updateEventDetails(id, title, description);
    addToast('Evento atualizado com sucesso!', 'success');
  };

  const handleApprove = (id: string) => {
    updateEventStatus(id, EventStatus.APPROVED);
    setModalOpen(false);
    addToast('Evento aprovado!', 'success');
  };

  const handleReject = (id: string) => {
    updateEventStatus(id, EventStatus.REJECTED);
    setModalOpen(false);
    addToast('Evento rejeitado.', 'info');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      deleteEvent(id);
      setModalOpen(false);
      addToast('Evento excluído.', 'info');
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(pickerYear);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setIsDatePickerOpen(false);
  };

  const toggleDatePicker = () => {
    if (!isDatePickerOpen) {
      setPickerYear(currentDate.getFullYear());
    }
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  // Swipe handlers - mais rigoroso para distinguir clique de swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTouchStartTime(Date.now());
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe(e);
    setIsSwiping(false);
  };

  const handleSwipe = (e: React.TouchEvent) => {
    const distanceX = touchStart - touchEnd;
    const distanceY = Math.abs(e.changedTouches[0].clientY - touchStartY);
    const timeDiff = Date.now() - touchStartTime;
    
    // Parâmetros otimizados para celulares reais
    const MIN_SWIPE_DISTANCE = 40; // Reduzido para 40px (mais realista em celulares)
    const MAX_VERTICAL_DISTANCE = 60; // Aumentado para 60px (mais tolerante)
    const MIN_TIME_FOR_SWIPE = 100; // Reduzido para 100ms (mais responsivo)
    
    // Validações otimizadas:
    // 1. Movimento horizontal deve ser significativo
    if (Math.abs(distanceX) < MIN_SWIPE_DISTANCE) {
      return; // Ignora se não teve movimento horizontal suficiente
    }
    
    // 2. Não pode ter tido muito movimento vertical (é scroll, não swipe)
    if (distanceY > MAX_VERTICAL_DISTANCE) {
      return; // Ignora se teve muito movimento vertical
    }
    
    // 3. Deve ter levado um tempo mínimo (não é clique rápido)
    if (timeDiff < MIN_TIME_FOR_SWIPE) {
      return; // Ignora cliques/toques muito rápidos
    }

    const isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe) {
      e.preventDefault();
      setSwipeDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        nextMonth();
        setTimeout(() => setIsAnimating(false), 300);
      }, 150);
    }
    if (isRightSwipe) {
      e.preventDefault();
      setSwipeDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        prevMonth();
        setTimeout(() => setIsAnimating(false), 300);
      }, 150);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 wave-background">
      {/* Welcome & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-display font-bold text-gray-800">Olá, {currentUser?.name.split(' ')[0]} 👋</h2>
           <p className="text-gray-600 font-body">Aqui está a visão geral da agenda.</p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-soft border border-gray-200 relative z-20">
        <div className="relative">
          <button 
            onClick={toggleDatePicker}
            className="flex items-center gap-3 group hover:bg-orange-50 px-3 py-2 -ml-2 rounded-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <CalendarDays size={20} />
            </div>
            <h1 className="text-xl font-display font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
            </h1>
            <ChevronDown 
              size={18} 
              className={`text-gray-400 group-hover:text-orange-600 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isDatePickerOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 w-80 animate-in fade-in zoom-in-95 duration-200 origin-top-left ring-1 ring-black ring-opacity-5">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setPickerYear(y => y - 1); }} 
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-display font-bold text-lg text-gray-800">{pickerYear}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setPickerYear(y => y + 1); }} 
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, idx) => (
                  <button
                    key={month}
                    onClick={(e) => { e.stopPropagation(); handleMonthSelect(idx); }}
                    className={`
                      py-2 text-sm rounded-lg transition font-medium
                      ${currentDate.getMonth() === idx && currentDate.getFullYear() === pickerYear 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}
                    `}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200/50">
          <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition">
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200/50">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-gray-600 hover:bg-white'
            }`}
            title="Vista em Grade"
          >
            <Grid3x3 size={20} />
            <span className="text-sm font-medium hidden md:inline">Grade</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-gray-600 hover:bg-white'
            }`}
            title="Vista em Tabela"
          >
            <List size={20} />
            <span className="text-sm font-medium hidden md:inline">Tabela</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid or Table */}
      {viewMode === 'grid' ? (
      <div 
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
          isAnimating 
            ? swipeDirection === 'left' 
              ? 'opacity-0 translate-x-full' 
              : 'opacity-0 -translate-x-full'
            : 'opacity-100 translate-x-0'
        }`}
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px border-gray-100">
          {calendarDays.map((day, idx) => {
            const dayEvents = getDayEvents(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onDoubleClick={() => handleDayDoubleClick(day)}
                className={`
                  min-h-[140px] p-2 transition-all relative group flex flex-col gap-1
                  ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                  ${(isCommon || isAdmin) && isCurrentMonth ? 'hover:bg-gray-50 cursor-pointer' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`
                    text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center transition-all
                    ${isToday 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                        : isCurrentMonth ? 'text-gray-700 group-hover:bg-gray-200/50' : 'text-gray-300'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  {(isCommon || isAdmin) && (
                    <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         handleDayDoubleClick(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:bg-indigo-50 p-1.5 rounded-full transition-all md:hidden" 
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(e, event)}
                      className={`
                        group/card flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border shadow-sm hover:shadow-md
                        ${event.status === EventStatus.APPROVED 
                            ? 'bg-green-50 text-green-700 border-green-100 hover:border-green-300' 
                            : event.status === EventStatus.REJECTED 
                                ? 'bg-red-50 text-red-700 border-red-100 line-through opacity-60' 
                                : 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300'
                        }
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          event.status === EventStatus.APPROVED ? 'bg-green-500' : 
                          event.status === EventStatus.REJECTED ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">{event.title}</p>
                          <p className="text-[10px] opacity-80 truncate leading-tight mt-0.5">{event.description}</p>
                      </div>
                      
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(event.id);
                          }}
                          className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-white rounded-md text-current transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      ) : (
      // Table View - All days of the month
      <div className="space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-2">
            {(isCommon || isAdmin) && (
              <button
                onClick={() => {
                  const year = currentDate.getFullYear();
                  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                  const date = String(currentDate.getDate()).padStart(2, '0');
                  setSelectedDay(`${year}-${month}-${date}`);
                  setSelectedEvent(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                <Plus size={18} />
                <span>Novo Evento</span>
              </button>
            )}
          </div>
        </div>

        {/* Table - Show all days of the month */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitante</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  const rows: React.ReactNode[] = [];
                  
                  calendarDays.forEach((day) => {
                    const dayEvents = getDayEvents(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                    
                    // If no events, show a row for the day
                    if (dayEvents.length === 0) {
                      rows.push(
                        <tr 
                          key={`${dateStr}-empty`} 
                          onDoubleClick={() => {
                            if (isCommon || isAdmin) {
                              setSelectedDay(dateStr);
                              setSelectedEvent(null);
                              setModalOpen(true);
                            }
                          }}
                          onTouchStart={(e) => handleTableRowTap(dateStr, e)}
                          className={`${!isCurrentMonth ? 'bg-gray-50/50' : ''} hover:bg-gray-50/50 transition-colors ${(isCommon || isAdmin) && isCurrentMonth ? 'cursor-pointer' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}>
                              {formatDateBR(dateStr)}
                            </span>
                          </td>
                          <td colSpan={6} className="px-6 py-4">
                            <span className="text-sm text-gray-400 italic">
                              {(isCommon || isAdmin) ? 'Sem eventos agendados' : 'Nenhum evento'}
                            </span>
                          </td>
                        </tr>
                      );
                    } else {
                      // Show all events for this day
                      dayEvents.forEach((event, idx) => {
                        rows.push(
                          <tr 
                            key={event.id} 
                            onDoubleClick={() => {
                              if ((isCommon || isAdmin) && idx === 0) {
                                setSelectedDay(dateStr);
                                setSelectedEvent(null);
                                setModalOpen(true);
                              }
                            }}
                            onTouchStart={(e) => {
                              if (idx === 0) {
                                handleTableRowTap(dateStr, e);
                              }
                            }}
                            className={`${!isCurrentMonth ? 'bg-gray-50/50' : ''} hover:bg-gray-50/50 transition-colors group/row cursor-pointer ${(isCommon || isAdmin) && idx === 0 ? 'cursor-pointer' : ''}`}
                          >
                            {idx === 0 && (
                              <td rowSpan={dayEvents.length} className="px-6 py-4 whitespace-nowrap align-top">
                                <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}>
                                  {formatDateBR(dateStr)}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">{event.time}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 line-clamp-2">{event.description}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{event.requesterName}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                                event.status === EventStatus.APPROVED 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : event.status === EventStatus.REJECTED 
                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  event.status === EventStatus.APPROVED ? 'bg-green-500' : 
                                  event.status === EventStatus.REJECTED ? 'bg-red-500' : 'bg-amber-500'
                                }`} />
                                {event.status === EventStatus.APPROVED ? 'Aprovado' : event.status === EventStatus.REJECTED ? 'Rejeitado' : 'Pendente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(e, event);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
                                >
                                  Detalhes
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDelete(event.id);
                                    }}
                                    className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
                                  >
                                    Deletar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    }
                  });
                  
                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      <div className="flex gap-6 text-sm text-gray-500 px-4 bg-white py-3 rounded-xl border border-gray-100 shadow-sm w-fit">
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div> Pendente</div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div> Aprovado</div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div> Rejeitado</div>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDay}
        existingEvent={selectedEvent}
        allEvents={filteredEvents}
        onSubmit={handleCreateEvent}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onEdit={handleEditEvent}
      />
    </div>
  );
};

export default Dashboard;
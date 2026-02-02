import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateBR } from '../utils/dateFormatter';
import { EventStatus, EventRequest } from '../types';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, XCircle, ArrowRight } from 'lucide-react';

interface PublicEventsViewerProps {
  events: EventRequest[];
}

const PublicEventsViewer: React.FC<PublicEventsViewerProps> = ({ events }) => {
  const navigate = useNavigate();
  // Filtrar apenas eventos futuros
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5); // Mostrar apenas os 5 próximos eventos
  }, [events]);

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
        return <CheckCircle2 size={14} className="text-green-600" />;
      case EventStatus.REJECTED:
        return <XCircle size={14} className="text-red-600" />;
      case EventStatus.PENDING:
        return <AlertCircle size={14} className="text-amber-600" />;
    }
  };

  const getStatusLabel = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
        return 'Aprovado';
      case EventStatus.REJECTED:
        return 'Rejeitado';
      case EventStatus.PENDING:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
        return 'bg-green-50 text-green-700 border-green-200';
      case EventStatus.REJECTED:
        return 'bg-red-50 text-red-700 border-red-200';
      case EventStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500">Nenhum evento agendado para os próximos dias</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white/50 backdrop-blur-sm rounded-lg border border-white/60 hover:bg-white/70 transition-all p-4"
        >
          <div className="flex items-start gap-3 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm flex-1">{event.title}</h4>
          </div>

          <p className="text-gray-600 text-xs mb-3 line-clamp-1">{event.description}</p>

          <div className="flex flex-wrap gap-3 text-[11px] text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-indigo-500" />
              <span>{formatDateBR(event.date)}</span>
            </div>

            {event.time && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-indigo-500" />
                <span>{event.time}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <User size={12} className="text-indigo-500" />
              <span>{event.requesterName}</span>
            </div>
          </div>
        </div>
      ))}

      {events.length > 5 && upcomingEvents.length === 5 && (
        <button
          onClick={() => navigate('/eventos-publicos')}
          className="w-full mt-4 px-4 py-2.5 bg-white/30 hover:bg-white/50 border border-white/60 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group"
        >
          Veja todos os eventos agendados
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default PublicEventsViewer;

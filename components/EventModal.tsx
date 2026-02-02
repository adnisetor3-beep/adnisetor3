import React, { useState, useEffect } from 'react';
import { EventRequest, EventStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDateBR, validateEventConflict } from '../utils/dateFormatter';
import { X, Check, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  existingEvent?: EventRequest | null;
  allEvents?: EventRequest[];
  onSubmit: (title: string, description: string, date?: string, time?: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, title: string, description: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  existingEvent,
  allEvents = [],
  onSubmit,
  onApprove,
  onReject,
  onDelete,
  onEdit
}) => {
  const { isAdmin, currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [chosenDate, setChosenDate] = useState<string | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState('');
  const [chosenTime, setChosenTime] = useState<string>('09:00');
  const [conflictError, setConflictError] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as DD/MM/YYYY while typing
    if (value.length <= 2) {
      setDateInputValue(value);
    } else if (value.length <= 4) {
      setDateInputValue(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else if (value.length <= 8) {
      setDateInputValue(`${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`);
    }
    
    // If we have a complete date, convert to ISO format
    if (value.length === 8) {
      const day = value.slice(0, 2);
      const month = value.slice(2, 4);
      const year = value.slice(4, 8);
      const isoDate = `${year}-${month}-${day}`;
      
      // Validate date
      const dateObj = new Date(isoDate + 'T00:00:00');
      if (!isNaN(dateObj.getTime())) {
        setChosenDate(isoDate);
      }
    }
  };

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setIsEditing(false);
      setChosenDate(undefined);
      setDateInputValue('');
      setChosenTime(existingEvent.time || '09:00');
      setConflictError('');
    } else {
      setTitle('');
      setDescription('');
      setIsEditing(true); // New event is always "editing" mode
      setChosenDate(selectedDate); // Set initial date from prop
      setDateInputValue(selectedDate ? formatDateBR(selectedDate) : '');
      setChosenTime('09:00'); // Default time
      setConflictError('');
    }
  }, [existingEvent, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingEvent && isEditing && onEdit) {
      onEdit(existingEvent.id, title, description);
      setIsEditing(false);
    } else if (!existingEvent) {
      // Validar conflito de horário para novo evento
      if (chosenDate) {
        const validation = validateEventConflict(chosenDate, chosenTime, allEvents);
        
        if (!validation.valid) {
          setConflictError(validation.message || 'Conflito de horário detectado');
          return;
        }
      }
      
      setConflictError(''); // Limpar erro se passou na validação
      // Para novos eventos, passa a data e hora escolhidas
      onSubmit(title, description, chosenDate, chosenTime);
      onClose();
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch(status) {
      case EventStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
      case EventStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const translateStatus = (status: EventStatus) => {
    switch(status) {
      case EventStatus.APPROVED: return 'Aprovado';
      case EventStatus.REJECTED: return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  // Determine if the current user can edit this event
  const canEdit = isAdmin || (existingEvent?.status === EventStatus.PENDING && existingEvent?.requesterId === currentUser?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">
            {existingEvent ? 'Detalhes do Evento' : 'Solicitar Novo Evento'}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {existingEvent && !isEditing && (
            <div className={`mb-4 px-3 py-1.5 rounded-md border text-sm font-medium inline-block ${getStatusColor(existingEvent.status)}`}>
              Status: {translateStatus(existingEvent.status)}
            </div>
          )}

          {!existingEvent || isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data do Evento</label>
                {!existingEvent ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="DD/MM/YYYY"
                      value={dateInputValue}
                      onChange={handleDateChange}
                      maxLength="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-mono text-lg tracking-widest"
                    />
                    {chosenDate && (
                      <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                        ✓ Data selecionada: <span className="font-semibold">{formatDateBR(chosenDate)}</span>
                      </div>
                    )}
                    {!chosenDate && dateInputValue && (
                      <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                        ✗ Data inválida. Use formato DD/MM/YYYY
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-900 font-semibold bg-gray-50 px-3 py-2 rounded-md">
                    {formatDateBR(existingEvent?.date)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário do Evento</label>
                {!existingEvent ? (
                  <input
                    type="time"
                    required
                    value={chosenTime}
                    onChange={(e) => setChosenTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="text-gray-900 font-semibold bg-gray-50 px-3 py-2 rounded-md">
                    {existingEvent.time}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Reunião de Obreiros"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Detalhes sobre o evento..."
                />
              </div>

              {conflictError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Conflito de Horário</p>
                    <p className="text-sm text-red-700 mt-1">{conflictError}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                 {existingEvent && isAdmin && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onDelete) onDelete(existingEvent.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition"
                    >
                        <Trash2 size={16} /> Excluir
                    </button>
                 )}
                 <div className="flex ml-auto">
                    <button
                    type="button"
                    onClick={() => {
                        if(existingEvent) setIsEditing(false);
                        else onClose();
                    }}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition"
                    >
                    {existingEvent ? 'Salvar Alterações' : 'Enviar Solicitação'}
                    </button>
                 </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {existingEvent && (
                  <>
                    <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium text-gray-900">{formatDateBR(existingEvent.date)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium text-gray-900">{existingEvent.time}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Título</p>
                        <p className="text-lg font-bold text-gray-900">{existingEvent.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Descrição</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{existingEvent.description}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Solicitante</p>
                        <p className="text-gray-700">{existingEvent.requesterName}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
                        {/* Admin Actions for Pending */}
                        {isAdmin && existingEvent.status === EventStatus.PENDING && (
                        <>
                            <button 
                            type="button"
                            onClick={() => onApprove && onApprove(existingEvent.id)}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                            <Check size={16} /> Aprovar
                            </button>
                            <button 
                            type="button"
                            onClick={() => onReject && onReject(existingEvent.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                            <X size={16} /> Rejeitar
                            </button>
                        </>
                        )}

                        {/* Edit Action */}
                        {canEdit && (
                            <button 
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <Edit2 size={16} /> Editar
                            </button>
                        )}

                        {/* Admin Explicit Delete Action (Any Status) */}
                        {isAdmin ? (
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onDelete) onDelete(existingEvent.id);
                                }}
                                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Excluir
                            </button>
                        ) : (
                            // Common User Cancel Action (Only Pending & Own)
                            existingEvent.status === EventStatus.PENDING && existingEvent.requesterId === currentUser?.id && (
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onDelete) onDelete(existingEvent.id);
                                    }}
                                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Cancelar
                                </button>
                            )
                        )}
                    </div>
                  </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
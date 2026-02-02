/**
 * Utilitário para formatação padronizada de datas
 * Formato padrão: DD/MM/YYYY
 */

import { EventRequest } from '../types';

/**
 * Formata uma data string (YYYY-MM-DD) para DD/MM/YYYY
 * @param dateString Data em formato YYYY-MM-DD (ISO)
 * @returns Data formatada em DD/MM/YYYY
 */
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  // Se já está em formato DD/MM/YYYY, retorna como está
  if (dateString.includes('/')) {
    return dateString;
  }
  // Converte YYYY-MM-DD para DD/MM/YYYY
  return dateString.split('-').reverse().join('/');
};

/**
 * Converte DD/MM/YYYY para YYYY-MM-DD
 * @param dateBR Data em formato DD/MM/YYYY
 * @returns Data em formato YYYY-MM-DD
 */
export const convertBRToISO = (dateBR: string): string => {
  if (!dateBR) return '';
  // Se já está em formato YYYY-MM-DD, retorna como está
  if (dateBR.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateBR;
  }
  // Converte DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = dateBR.split('/');
  return `${year}-${month}-${day}`;
};

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns Data atual em formato YYYY-MM-DD
 */
export const getTodayISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtém a data atual no formato DD/MM/YYYY
 * @returns Data atual em formato DD/MM/YYYY
 */
export const getTodayBR = (): string => {
  return formatDateBR(getTodayISO());
};

/**
 * Converte tempo HH:MM para minutos
 * @param time Tempo em formato HH:MM
 * @returns Minutos desde meia-noite
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Verifica se há conflito de horário entre dois eventos
 * @param existingTime Horário do evento existente (HH:MM)
 * @param newTime Horário do novo evento (HH:MM)
 * @param minGapHours Espaço mínimo em horas entre eventos (default: 2)
 * @returns true se há conflito, false caso contrário
 */
export const hasTimeConflict = (
  existingTime: string,
  newTime: string,
  minGapHours: number = 2
): boolean => {
  const existingMinutes = timeToMinutes(existingTime);
  const newMinutes = timeToMinutes(newTime);
  const minGapMinutes = minGapHours * 60;

  // Verifica se o novo evento começa dentro do gap de 2 horas ANTES do evento existente
  // ou dentro do gap de 2 horas DEPOIS do evento existente
  const diff = Math.abs(existingMinutes - newMinutes);
  
  return diff < minGapMinutes;
};

/**
 * Valida se pode criar um novo evento em determinada data/hora
 * @param newDate Data do novo evento (YYYY-MM-DD)
 * @param newTime Hora do novo evento (HH:MM)
 * @param allEvents Lista de todos os eventos existentes
 * @returns Objeto com { valid: boolean, conflictingEvent?: EventRequest, message?: string }
 */
export const validateEventConflict = (
  newDate: string,
  newTime: string,
  allEvents: EventRequest[]
): { valid: boolean; conflictingEvent?: EventRequest; message?: string } => {
  // Procura eventos no mesmo dia
  const eventsOnSameDay = allEvents.filter(event => event.date === newDate);

  if (eventsOnSameDay.length === 0) {
    return { valid: true };
  }

  // Verifica conflito de horário
  for (const event of eventsOnSameDay) {
    if (hasTimeConflict(event.time, newTime)) {
      return {
        valid: false,
        conflictingEvent: event,
        message: `Já existe um evento cadastrado para ${event.time} (${event.title}). Precisa ter pelo menos 2 horas de espaço entre eventos.`
      };
    }
  }

  return { valid: true };
};

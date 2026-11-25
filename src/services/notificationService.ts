import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NovoLembreteInput } from '../types/reminder';

export const CATEGORIA_LEMBRETE = 'LEMBRETE_ACTIONS';
export const ACTION_CONCLUIR = 'CONCLUIR';
export const ACTION_ADIAR_10_MIN = 'ADIAR_10_MIN';

// Configura o handler global (conforme Slide 22)
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Passo 02 (Slide 22): Pede permissão e registra os botões interativos da notificação (Slide 27)
export async function requestPermissionsAndSetupCategories(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await Notifications.setNotificationCategoryAsync(CATEGORIA_LEMBRETE, [
    {
      identifier: ACTION_CONCLUIR,
      buttonTitle: 'Concluir',
      options: { opensAppToForeground: false },
    },
    {
      identifier: ACTION_ADIAR_10_MIN,
      buttonTitle: 'Adiar 10 min',
      options: { opensAppToForeground: false },
    },
  ]);

  return true;
}

// Passo 03 (Slide 23): Agenda notificação única ou diária
export async function scheduleReminderNotification(
  input: NovoLembreteInput
): Promise<string> {
  const [horaStr, minutoStr] = input.horario.split(':');
  const hora = parseInt(horaStr, 10);
  const minuto = parseInt(minutoStr, 10);

  if (input.recorrencia === 'diaria') {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: input.titulo,
        body: input.descricao || 'Lembrete diário agendado!',
        categoryIdentifier: CATEGORIA_LEMBRETE,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hora,
        minute: minuto,
      },
    });
  }

  const agora = new Date();
  const horarioAlvo = new Date();
  horarioAlvo.setHours(hora, minuto, 0, 0);

  if (horarioAlvo <= agora) {
    horarioAlvo.setDate(horarioAlvo.getDate() + 1);
  }

  const segundosRestantes = Math.max(
    5,
    Math.floor((horarioAlvo.getTime() - agora.getTime()) / 1000)
  );

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: input.titulo,
      body: input.descricao || 'Lembrete único agendado!',
      categoryIdentifier: CATEGORIA_LEMBRETE,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundosRestantes,
    },
  });
}

// Agenda notificação rápida de 5 segundos (como no exemplo do Slide 23)
export async function scheduleQuickTestNotification(
  titulo: string,
  descricao: string
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: descricao,
      categoryIdentifier: CATEGORIA_LEMBRETE,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
}

// Adia uma notificação por 10 minutos (600 segundos)
export async function snoozeNotificationFor10Minutes(
  titulo: string,
  descricao: string
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `${titulo} (Adiado)`,
      body: descricao || 'Já se passaram 10 minutos desde o adiamento!',
      categoryIdentifier: CATEGORIA_LEMBRETE,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 600,
    },
  });
}

// Cancela uma notificação específica
export async function cancelSingleNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Cancela todas as notificações agendadas
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

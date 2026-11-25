import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Lembrete, NovoLembreteInput } from '../types/reminder';
import {
  ACTION_ADIAR_10_MIN,
  ACTION_CONCLUIR,
  cancelAllNotifications,
  cancelSingleNotification,
  configureNotificationHandler,
  requestPermissionsAndSetupCategories,
  scheduleQuickTestNotification,
  scheduleReminderNotification,
  snoozeNotificationFor10Minutes,
} from '../services/notificationService';

interface ReminderContextData {
  lembretes: Lembrete[];
  lembreteEmAlerta: Lembrete | null;
  adicionarLembrete: (input: NovoLembreteInput) => Promise<boolean>;
  dispararTesteEm5Segundos: (
    titulo?: string,
    descricao?: string
  ) => Promise<void>;
  concluirLembrete: (notificationId: string) => void;
  adiarLembrete: (titulo: string, descricao: string) => Promise<void>;
  cancelarLembreteIndividual: (id: string, notificationId: string) => Promise<void>;
  cancelarTodosLembretes: () => Promise<void>;
}

const ReminderContext = createContext<ReminderContextData>(
  {} as ReminderContextData
);

configureNotificationHandler();

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [lembreteEmAlerta, setLembreteEmAlerta] = useState<Lembrete | null>(
    null
  );

  useEffect(() => {
     requestPermissionsAndSetupCategories().then((granted) => {
      if (!granted) {
        Alert.alert(
          'Permissão necessária',
          'Ative as notificações do aplicativo para receber seus lembretes.'
        );
      }
    });

    // Escuta notificações que chegam com o app em primeiro plano
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        const notifId = notification.request.identifier;
        const content = notification.request.content;
        setLembreteEmAlerta({
          id: notifId,
          notificationId: notifId,
          titulo: content.title || 'Lembrete',
          descricao: content.body || '',
          horario: 'Agora',
          recorrencia: 'unica',
        });
      }
    );

    // Escuta interações do usuário na notificação ou nos botões "Concluir" / "Adiar 10 min"
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const actionId = response.actionIdentifier;
        const notifId = response.notification.request.identifier;
        const content = response.notification.request.content;

        if (actionId === ACTION_CONCLUIR) {
          await Notifications.dismissNotificationAsync(notifId);
          concluirLembrete(notifId);
        } else if (actionId === ACTION_ADIAR_10_MIN) {
          await Notifications.dismissNotificationAsync(notifId);
          await adiarLembrete(
            content.title || 'Lembrete',
            content.body || ''
          );
        } else {
          setLembreteEmAlerta({
            id: notifId,
            notificationId: notifId,
            titulo: content.title || 'Lembrete',
            descricao: content.body || '',
            horario: 'Agora',
            recorrencia: 'unica',
          });
        }
      }
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  async function adicionarLembrete(input: NovoLembreteInput): Promise<boolean> {
    if (!input.titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título (nome) do lembrete.');
      return false;
    }

    const match = input.horario.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (!match) {
      Alert.alert(
        'Horário inválido',
        'Informe o horário no formato HH:MM (ex: 08:00 ou 15:30).'
      );
      return false;
    }

    try {
      const notificationId = await scheduleReminderNotification({
        titulo: input.titulo.trim(),
        descricao: input.descricao.trim(),
        horario: input.horario.trim(),
        recorrencia: input.recorrencia,
      });

      const novo: Lembrete = {
        id: String(Date.now()),
        notificationId,
        titulo: input.titulo.trim(),
        descricao: input.descricao.trim(),
        horario: input.horario.trim(),
        recorrencia: input.recorrencia,
      };

      setLembretes((prev) => [...prev, novo]);
      Alert.alert(
        'Lembrete Agendado ⏰',
        `"${novo.titulo}" foi agendado para ${novo.horario}.`
      );
      return true;
    } catch {
      Alert.alert('Erro', 'Não foi possível agendar a notificação.');
      return false;
    }
  }

  async function dispararTesteEm5Segundos(
    tituloInput?: string,
    descricaoInput?: string
  ) {
    const tituloTeste = tituloInput?.trim() || 'Beber água';
    const descTeste = descricaoInput?.trim() || 'Um copo de 300 ml';

    const notificationId = await scheduleQuickTestNotification(
      tituloTeste,
      descTeste
    );

    const novo: Lembrete = {
      id: String(Date.now()),
      notificationId,
      titulo: tituloTeste,
      descricao: descTeste,
      horario: 'Em 5s',
      recorrencia: 'unica',
    };

    setLembretes((prev) => [...prev, novo]);
    Alert.alert('Teste Agendado ⏰', 'A notificação aparecerá em 5 segundos!');
  }

  function concluirLembrete(notificationId: string) {
    setLembretes((prev) =>
      prev.filter(
        (item) =>
          item.notificationId !== notificationId ||
          item.recorrencia === 'diaria'
      )
    );
    setLembreteEmAlerta(null);
    Alert.alert('Concluído ✅', 'Lembrete marcado como concluído!');
  }

  async function adiarLembrete(titulo: string, descricao: string) {
    await snoozeNotificationFor10Minutes(titulo, descricao);
    setLembreteEmAlerta(null);
    Alert.alert(
      'Adiado ⏰',
      'O lembrete foi reagendado para daqui a 10 minutos.'
    );
  }

  async function cancelarLembreteIndividual(
    id: string,
    notificationId: string
  ) {
    await cancelSingleNotification(notificationId);
    setLembretes((prev) => prev.filter((item) => item.id !== id));
  }

  async function cancelarTodosLembretes() {
    await cancelAllNotifications();
    setLembretes([]);
    setLembreteEmAlerta(null);
    Alert.alert(
      'Cancelado',
      'Todas as notificações agendadas foram canceladas.'
    );
  }

  return (
    <ReminderContext.Provider
      value={{
        lembretes,
        lembreteEmAlerta,
        adicionarLembrete,
        dispararTesteEm5Segundos,
        concluirLembrete,
        adiarLembrete,
        cancelarLembreteIndividual,
        cancelarTodosLembretes,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  return useContext(ReminderContext);
}

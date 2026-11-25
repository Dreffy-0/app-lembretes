export type Recorrencia = 'unica' | 'diaria';

export interface Lembrete {
  id: string;
  notificationId: string;
  titulo: string;
  descricao: string;
  horario: string; // Formato HH:MM
  recorrencia: Recorrencia;
}

export interface NovoLembreteInput {
  titulo: string;
  descricao: string;
  horario: string;
  recorrencia: Recorrencia;
}

export type RootTabParamList = {
  Cadastro: undefined;
  Agendados: undefined;
};

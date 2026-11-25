import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Lembrete } from '../types/reminder';
import { colors } from '../theme/colors';

interface ReminderCardProps {
  item: Lembrete;
  onConcluir: (notificationId: string) => void;
  onAdiar: (titulo: string, descricao: string) => void;
  onCancelar: (id: string, notificationId: string) => void;
}

export function ReminderCard({
  item,
  onConcluir,
  onAdiar,
  onCancelar,
}: ReminderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>⏰</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.titulo}</Text>
        {!!item.descricao && (
          <Text style={styles.description}>{item.descricao}</Text>
        )}
        <Text style={styles.schedule}>
          {item.recorrencia === 'diaria' ? 'Todo dia' : 'Única'}, {item.horario}
        </Text>

        <View style={styles.inlineActions}>
          <Pressable onPress={() => onConcluir(item.notificationId)}>
            <Text style={styles.actionLink}>Concluir</Text>
          </Pressable>
          <Pressable onPress={() => onAdiar(item.titulo, item.descricao)}>
            <Text style={styles.actionLink}>Adiar 10 min</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={styles.cancelBtn}
        onPress={() => onCancelar(item.id, item.notificationId)}
      >
        <Text style={styles.cancelText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  schedule: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentBlue,
  },
  cancelBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelText: {
    color: colors.dangerIcon,
    fontSize: 13,
    fontWeight: '700',
  },
});

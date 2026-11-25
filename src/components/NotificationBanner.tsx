import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Lembrete } from '../types/reminder';
import { colors } from '../theme/colors';

interface NotificationBannerProps {
  lembrete: Lembrete;
  onConcluir: (notificationId: string) => void;
  onAdiar: (titulo: string, descricao: string) => void;
}

export function NotificationBanner({
  lembrete,
  onConcluir,
  onAdiar,
}: NotificationBannerProps) {
  return (
    <View style={styles.notificationBanner}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationAppLabel}>⏰ Hábitos • agora</Text>
      </View>
      <Text style={styles.notificationTitle}>{lembrete.titulo}</Text>
      {!!lembrete.descricao && (
        <Text style={styles.notificationBody}>{lembrete.descricao}</Text>
      )}
      <View style={styles.notificationActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => onConcluir(lembrete.notificationId)}
        >
          <Text style={styles.actionButtonText}>Concluir</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => onAdiar(lembrete.titulo, lembrete.descricao)}
        >
          <Text style={styles.actionButtonText}>Adiar 10 min</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationBanner: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationAppLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  actionButtonText: {
    color: colors.accentBlue,
    fontWeight: '600',
    fontSize: 13,
  },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Recorrencia } from '../types/reminder';
import { colors } from '../theme/colors';

interface RecurrenceSelectorProps {
  value: Recorrencia;
  onChange: (novaRecorrencia: Recorrencia) => void;
}

export function RecurrenceSelector({
  value,
  onChange,
}: RecurrenceSelectorProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          value === 'unica' && styles.buttonSelected,
        ]}
        onPress={() => onChange('unica')}
      >
        <Text
          style={[
            styles.buttonText,
            value === 'unica' && styles.buttonTextSelected,
          ]}
        >
          Única
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          value === 'diaria' && styles.buttonSelected,
        ]}
        onPress={() => onChange('diaria')}
      >
        <Text
          style={[
            styles.buttonText,
            value === 'diaria' && styles.buttonTextSelected,
          ]}
        >
          Diária
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  buttonSelected: {
    backgroundColor: colors.accentBlueBg,
    borderColor: colors.accentBlueBorder,
  },
  buttonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  buttonTextSelected: {
    color: colors.accentBlueText,
    fontWeight: '700',
  },
});

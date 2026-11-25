import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ReminderProvider, useReminders } from './src/context/ReminderContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationActionBanner } from './src/components/NotificationActionBanner';
import { colors } from './src/theme/colors';

function MainLayout() {
  const { lembreteEmAlerta, concluirLembrete, adiarLembrete } = useReminders();

  return (
    <SafeAreaView style={styles.safeArea}>
      <NotificationActionBanner
        lembrete={lembreteEmAlerta}
        onConcluir={concluirLembrete}
        onAdiar={adiarLembrete}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ReminderProvider>
      <MainLayout />
    </ReminderProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

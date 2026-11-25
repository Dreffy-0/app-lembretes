import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/reminder';
import { CreateReminderScreen } from '../screens/CreateReminderScreen';
import { ScheduledRemindersScreen } from '../screens/ScheduledRemindersScreen';
import { useReminders } from '../context/ReminderContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  const { lembretes } = useReminders();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Cadastro"
        component={CreateReminderScreen}
        options={{
          title: '1. Cadastro',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 16, color }}>➕</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Agendados"
        component={ScheduledRemindersScreen}
        options={{
          title: `2. Agendados (${lembretes.length})`,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 16, color }}>📋</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

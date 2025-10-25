import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons as Icon } from '@expo/vector-icons';

import OverviewScreen from './screens/OverviewScreen';
import ExpensesListScreen from './screens/ExpensesListScreen';
import ExpenseFormScreen from './screens/ExpenseFormScreen';
import BudgetsScreen from './screens/BudgetsScreen';
import PlannerScreen from './screens/PlannerScreen';
import IncomesScreen from './screens/IncomesScreen';
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import InventoryListScreen from './screens/InventoryListScreen';
import InventoryDetailScreen from './screens/InventoryDetailScreen';
import InventoryPurchaseFormScreen from './screens/InventoryPurchaseFormScreen';
import {
  ExpensesStackParamList,
  InventoryStackParamList,
  OverviewStackParamList,
  PlannerStackParamList,
  RootTabParamList,
} from './types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const OverviewStack = createNativeStackNavigator<OverviewStackParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();
const PlannerStack = createNativeStackNavigator<PlannerStackParamList>();
const InventoryStack = createNativeStackNavigator<InventoryStackParamList>();

function OverviewStackNavigator() {
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: 'Resumen' }}
      />
      <OverviewStack.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{ title: 'Presupuestos' }}
      />
    </OverviewStack.Navigator>
  );
}

function ExpensesStackNavigator() {
  return (
    <ExpensesStack.Navigator>
      <ExpensesStack.Screen
        name="ExpensesList"
        component={ExpensesListScreen}
        options={{ title: 'Gastos' }}
      />
      <ExpensesStack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={{ title: 'Gasto' }}
      />
    </ExpensesStack.Navigator>
  );
}

function PlannerStackNavigator() {
  return (
    <PlannerStack.Navigator>
      <PlannerStack.Screen
        name="Planner"
        component={PlannerScreen}
        options={{ title: 'Planificador' }}
      />
      <PlannerStack.Screen
        name="Incomes"
        component={IncomesScreen}
        options={{ title: 'Ingresos' }}
      />
      <PlannerStack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{ title: 'Suscripciones' }}
      />
    </PlannerStack.Navigator>
  );
}

function InventoryStackNavigator() {
  return (
    <InventoryStack.Navigator>
      <InventoryStack.Screen
        name="InventoryList"
        component={InventoryListScreen}
        options={{ title: 'Inventario' }}
      />
      <InventoryStack.Screen
        name="InventoryDetail"
        component={InventoryDetailScreen}
        options={{ title: 'Detalle' }}
      />
      <InventoryStack.Screen
        name="InventoryPurchase"
        component={InventoryPurchaseFormScreen}
        options={{ title: 'Registrar compra' }}
      />
    </InventoryStack.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Icon.glyphMap = 'home';

            switch (route.name) {
              case 'OverviewTab':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'ExpensesTab':
                iconName = focused ? 'wallet' : 'wallet-outline';
                break;
              case 'PlannerTab':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'InventoryTab':
                iconName = focused ? 'cube' : 'cube-outline';
                break;
              default:
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="OverviewTab"
          component={OverviewStackNavigator}
          options={{ title: 'Resumen' }}
        />
        <Tab.Screen
          name="ExpensesTab"
          component={ExpensesStackNavigator}
          options={{ title: 'Gastos' }}
        />
        <Tab.Screen
          name="PlannerTab"
          component={PlannerStackNavigator}
          options={{ title: 'Planificador' }}
        />
        <Tab.Screen
          name="InventoryTab"
          component={InventoryStackNavigator}
          options={{ title: 'Inventario' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

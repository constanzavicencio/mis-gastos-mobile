import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { budgetService } from '../services/api';
import { Budget } from '../types';
import { formatCurrency } from '../utils/format';

const BudgetsScreen = () => {
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadBudgets = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await budgetService.getBudgets();
      setBudgets(response.data);
    } catch (error) {
      console.error('Error cargando presupuestos', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBudgets();
    }, [loadBudgets])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Presupuestos</Text>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadBudgets} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.category?.name ?? 'General'}</Text>
            {item.subcategory?.name && (
              <Text style={styles.cardSubtitle}>Subcategoría: {item.subcategory.name}</Text>
            )}
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Monto</Text>
                <Text style={styles.value}>{formatCurrency(item.amount)}</Text>
              </View>
              <View>
                <Text style={styles.label}>Periodo</Text>
                <Text style={styles.value}>{translatePeriod(item.period)}</Text>
              </View>
            </View>
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>Aún no configuraste presupuestos.</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const translatePeriod = (period: string) => {
  switch (period) {
    case 'MONTHLY':
      return 'Mensual';
    case 'QUARTERLY':
      return 'Trimestral';
    case 'YEARLY':
      return 'Anual';
    default:
      return period;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  notes: {
    marginTop: 16,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 48,
  },
  listContent: {
    paddingBottom: 48,
  },
});

export default BudgetsScreen;

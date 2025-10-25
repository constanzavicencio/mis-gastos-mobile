import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { expenseService } from '../services/api';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { ExpensesStackParamList } from '../types/navigation';

const FILTERS = [
  { label: 'Últimos 7 días', value: 7 },
  { label: 'Últimos 30 días', value: 30 },
  { label: 'Últimos 90 días', value: 90 },
];

type ExpensesScreenNavigation = NativeStackNavigationProp<
  ExpensesStackParamList,
  'ExpensesList'
>;

const ExpensesListScreen = () => {
  const navigation = useNavigation<ExpensesScreenNavigation>();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState(FILTERS[1]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchExpenses = React.useCallback(async (days: number) => {
    try {
      setIsLoading(true);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const response = await expenseService.getExpenses({ from: fromDate.toISOString() });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error obteniendo gastos', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses(selectedFilter.value);
    }, [fetchExpenses, selectedFilter])
  );

  const handleAdd = () => {
    navigation.navigate('ExpenseForm');
  };

  const handleEdit = (expense: Expense) => {
    navigation.navigate('ExpenseForm', { expense });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gastos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+ Registrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = filter.value === selectedFilter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => {
                setSelectedFilter(filter);
                fetchExpenses(filter.value);
              }}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchExpenses(selectedFilter.value)} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.expenseRow} onPress={() => handleEdit(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseMeta}>
                {formatDate(item.occurredAt)}
                {item.category?.name ? ` · ${item.category?.name}` : ''}
                {item.subcategory?.name ? ` / ${item.subcategory?.name}` : ''}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No hay gastos registrados para este periodo.</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    color: '#111827',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
  },
  listContent: {
    paddingBottom: 32,
  },
});

export default ExpensesListScreen;

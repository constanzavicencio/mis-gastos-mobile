import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { budgetService, plannerService, expenseService } from '../services/api';
import { BudgetSummaryItem, PlannerEvent, Expense } from '../types';
import { formatCurrency, formatDate, getCurrentMonth } from '../utils/format';

const OverviewScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [budgetSummary, setBudgetSummary] = React.useState<BudgetSummaryItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<PlannerEvent[]>([]);
  const [recentExpenses, setRecentExpenses] = React.useState<Expense[]>([]);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [summaryResponse, plannerResponse, expensesResponse] = await Promise.all([
        budgetService.getSummary(getCurrentMonth()),
        plannerService.getUpcoming(30),
        expenseService.getExpenses({ from: getPastDateISO(14) }),
      ]);

      setBudgetSummary(summaryResponse.data);
      setUpcomingEvents(plannerResponse.data);
      setRecentExpenses(expensesResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error cargando overview', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recentExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>Resumen general</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Presupuestos del mes</Text>
              {budgetSummary.length === 0 ? (
                <Text style={styles.emptyText}>Aún no tienes presupuestos configurados.</Text>
              ) : (
                budgetSummary.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.cardRow}>
                      <View>
                        <Text style={styles.cardLabel}>Presupuesto</Text>
                        <Text style={styles.cardValue}>{formatCurrency(item.budgeted)}</Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>Gastado</Text>
                        <Text style={styles.cardValue}>{formatCurrency(item.actual)}</Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>Variación</Text>
                        <Text
                          style={[
                            styles.cardValue,
                            item.variance < 0 ? styles.negative : styles.positive,
                          ]}
                        >
                          {formatCurrency(item.variance)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Próximos eventos</Text>
              {upcomingEvents.length === 0 ? (
                <Text style={styles.emptyText}>Sin eventos próximos en los próximos 30 días.</Text>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => (
                  <View key={event.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    <Text style={styles.cardSubtitle}>{formatDate(event.scheduledFor)}</Text>
                    {event.amount !== undefined && (
                      <Text style={styles.cardValue}>{formatCurrency(event.amount)}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gastos recientes</Text>
              {recentExpenses.length === 0 && (
                <Text style={styles.emptyText}>Registra tu primer gasto para ver información aquí.</Text>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseMeta}>
                {formatDate(item.occurredAt)}
                {item.category?.name ? ` · ${item.category?.name}` : ''}
                {item.subcategory?.name ? ` / ${item.subcategory?.name}` : ''}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No hay gastos registrados en los últimos días.</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const getPastDateISO = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cardLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  positive: {
    color: '#059669',
  },
  negative: {
    color: '#dc2626',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseMeta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  listContent: {
    paddingBottom: 32,
  },
});

export default OverviewScreen;

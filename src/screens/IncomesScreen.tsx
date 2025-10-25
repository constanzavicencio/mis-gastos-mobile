import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { incomeService } from '../services/api';
import { Income } from '../types';
import { formatCurrency, formatSchedule } from '../utils/format';

const IncomesScreen = () => {
  const [incomes, setIncomes] = React.useState<Income[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadIncomes = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await incomeService.getIncomes();
      setIncomes(response.data);
    } catch (error) {
      console.error('Error cargando ingresos', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIncomes();
    }, [loadIncomes])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ingresos</Text>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadIncomes} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{formatSchedule(item.scheduleType, item)}</Text>
            <View style={styles.row}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Monto</Text>
                <Text style={styles.value}>{formatCurrency(item.amount, item.currency ?? 'ARS')}</Text>
              </View>
              {item.activeFromMonth && (
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Activo desde</Text>
                  <Text style={styles.value}>{item.activeFromMonth}</Text>
                </View>
              )}
              {item.activeToMonth && (
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Activo hasta</Text>
                  <Text style={styles.value}>{item.activeToMonth}</Text>
                </View>
              )}
            </View>
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No tienes ingresos configurados todavía.</Text>
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
    flexWrap: 'wrap',
  },
  infoBlock: {
    marginRight: 16,
    marginBottom: 12,
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

export default IncomesScreen;

import React from 'react';
import { View, Text, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { plannerService } from '../services/api';
import { PlannerEvent } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { PlannerStackParamList } from '../types/navigation';

const PlannerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PlannerStackParamList>>();
  const [events, setEvents] = React.useState<PlannerEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadEvents = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await plannerService.getUpcoming(60);
      setEvents(response.data);
    } catch (error) {
      console.error('Error cargando planificador', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const sections = React.useMemo(() => {
    const grouped = events.reduce<Record<string, PlannerEvent[]>>((acc, event) => {
      const key = event.scheduledFor.split('T')[0];
      acc[key] = acc[key] ? [...acc[key], event] : [event];
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => (dateA > dateB ? 1 : -1))
      .map(([date, items]) => ({
        title: formatDate(date),
        data: items,
      }));
  }, [events]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planificador</Text>
        <View style={styles.actions}>
          <Text style={styles.actionLink} onPress={() => navigation.navigate('Incomes')}>
            Ver ingresos
          </Text>
          <Text style={styles.actionLink} onPress={() => navigation.navigate('Subscriptions')}>
            Ver suscripciones
          </Text>
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadEvents} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventType}>{translateEventType(item.type)}</Text>
            </View>
            {item.amount !== undefined && (
              <Text style={styles.eventAmount}>{formatCurrency(item.amount)}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>
              No hay eventos en los próximos 60 días. Agrega ingresos, suscripciones o inventario
              para ver recordatorios.
            </Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const translateEventType = (type: PlannerEvent['type']) => {
  switch (type) {
    case 'income':
      return 'Ingreso';
    case 'subscription':
      return 'Suscripción';
    case 'inventory':
      return 'Inventario';
    default:
      return type;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionLink: {
    color: '#2563eb',
    fontWeight: '600',
    marginRight: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventType: {
    color: '#6b7280',
    marginTop: 4,
  },
  eventAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    textAlign: 'center',
    padding: 32,
    color: '#6b7280',
  },
  listContent: {
    paddingBottom: 48,
  },
});

export default PlannerScreen;

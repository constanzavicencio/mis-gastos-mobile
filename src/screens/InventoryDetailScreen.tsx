import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { inventoryService } from '../services/api';
import { InventoryItem, InventoryPurchase } from '../types';
import { InventoryStackParamList } from '../types/navigation';
import { formatCurrency, formatDate } from '../utils/format';

const InventoryDetailScreen: React.FC<
  NativeStackScreenProps<InventoryStackParamList, 'InventoryDetail'>
> = ({ route, navigation }) => {
  const { itemId, title } = route.params;
  const [item, setItem] = React.useState<InventoryItem | null>(null);
  const [purchases, setPurchases] = React.useState<InventoryPurchase[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadItem = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [itemResponse, purchasesResponse] = await Promise.all([
        inventoryService.getInventoryItem(itemId),
        inventoryService.getPurchases(itemId),
      ]);
      setItem(itemResponse.data);
      setPurchases(purchasesResponse.data);
    } catch (error) {
      console.error('Error cargando detalle de inventario', error);
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  React.useEffect(() => {
    loadItem();
  }, [loadItem]);

  return (
    <SafeAreaView style={styles.container}>
      {item && (
        <View style={styles.headerCard}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Consumo diario</Text>
              <Text style={styles.metricValue}>{item.consumptionPerDay}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Stock actual</Text>
              <Text style={styles.metricValue}>{item.stockOnHand}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Cantidad por compra</Text>
              <Text style={styles.metricValue}>{item.purchaseQuantity}</Text>
            </View>
          </View>
          <View style={styles.metricsRow}>
            {item.projectedRunOutDate && (
              <View>
                <Text style={styles.metricLabel}>Se agota</Text>
                <Text style={styles.metricValue}>{formatDate(item.projectedRunOutDate)}</Text>
              </View>
            )}
            {item.nextPurchaseDate && (
              <View>
                <Text style={styles.metricLabel}>Próxima compra</Text>
                <Text style={styles.metricValue}>{formatDate(item.nextPurchaseDate)}</Text>
              </View>
            )}
            {item.reminderLeadTimeDays !== undefined && (
              <View>
                <Text style={styles.metricLabel}>Recordatorio</Text>
                <Text style={styles.metricValue}>
                  {item.reminderLeadTimeDays} días antes
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Compras registradas</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('InventoryPurchase', { itemId, title: item?.name ?? '' })}
        >
          <Text style={styles.action}>Registrar compra</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={purchases}
        keyExtractor={(purchase) => purchase.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadItem} />}
        renderItem={({ item: purchase }) => (
          <View style={styles.purchaseRow}>
            <View>
              <Text style={styles.purchaseDate}>{formatDate(purchase.purchasedAt)}</Text>
              <Text style={styles.purchaseQuantity}>Cantidad: {purchase.quantity}</Text>
            </View>
            {purchase.cost !== undefined && (
              <Text style={styles.purchaseCost}>{formatCurrency(purchase.cost)}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>Aún no registraste compras para este item.</Text>
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
  headerCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  itemDescription: {
    color: '#4b5563',
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  action: {
    color: '#2563eb',
    fontWeight: '600',
  },
  purchaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  purchaseDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  purchaseQuantity: {
    color: '#4b5563',
    marginTop: 4,
  },
  purchaseCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 32,
  },
  listContent: {
    paddingBottom: 48,
  },
});

export default InventoryDetailScreen;

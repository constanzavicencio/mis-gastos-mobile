import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { inventoryService } from '../services/api';
import { InventoryItem } from '../types';
import { formatDate } from '../utils/format';
import { InventoryStackParamList } from '../types/navigation';

const InventoryListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<InventoryStackParamList>>();
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadInventory = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await inventoryService.getInventory();
      setItems(response.data);
    } catch (error) {
      console.error('Error cargando inventario', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadInventory();
    }, [loadInventory])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inventario y recordatorios</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadInventory} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('InventoryDetail', { itemId: item.id, title: item.name })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.description && <Text style={styles.cardSubtitle}>{item.description}</Text>}
              <Text style={styles.meta}>Consumo diario: {item.consumptionPerDay}</Text>
              <Text style={styles.meta}>Stock actual: {item.stockOnHand}</Text>
            </View>
            <View style={styles.dates}>
              {item.projectedRunOutDate && (
                <Text style={styles.dateLabel}>
                  Se agota: {formatDate(item.projectedRunOutDate)}
                </Text>
              )}
              {item.nextPurchaseDate && (
                <Text style={styles.dateLabel}>
                  Comprar: {formatDate(item.nextPurchaseDate)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>
              Agrega tus medicamentos, insumos y productos para recibir recordatorios.
            </Text>
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
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  meta: {
    color: '#4b5563',
    marginTop: 6,
  },
  dates: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateLabel: {
    color: '#2563eb',
    fontWeight: '600',
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

export default InventoryListScreen;

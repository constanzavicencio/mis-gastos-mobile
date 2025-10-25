import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { inventoryService } from '../services/api';
import { InventoryStackParamList } from '../types/navigation';
import { toISODate } from '../utils/format';

const InventoryPurchaseFormScreen: React.FC<
  NativeStackScreenProps<InventoryStackParamList, 'InventoryPurchase'>
> = ({ navigation, route }) => {
  const { itemId, title } = route.params;
  const [quantity, setQuantity] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [date, setDate] = React.useState(toISODate(new Date()));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `Registrar compra - ${title}` });
  }, [navigation, title]);

  const handleSubmit = async () => {
    if (!quantity) {
      Alert.alert('Cantidad requerida', 'Ingresa la cantidad comprada.');
      return;
    }

    try {
      setIsSubmitting(true);
      await inventoryService.addPurchase(itemId, {
        quantity: Number(quantity),
        cost: cost ? Number(cost) : undefined,
        purchasedAt: date,
      });
      Alert.alert('Compra registrada', 'Actualizamos el stock de este ítem.');
      navigation.goBack();
    } catch (error) {
      console.error('Error registrando compra', error);
      Alert.alert('Error', 'No pudimos registrar la compra, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nueva compra</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej. 3"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Costo total (opcional)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej. 12000"
          value={cost}
          onChangeText={setCost}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Fecha de compra</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
      </View>
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InventoryPurchaseFormScreen;

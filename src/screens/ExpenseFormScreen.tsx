import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { expenseService, categoryService } from '../services/api';
import { Category, Expense, ExpensePayload, Subcategory } from '../types';
import { ExpensesStackParamList } from '../types/navigation';
import { toISODate } from '../utils/format';

const initialState: ExpensePayload = {
  amount: 0,
  description: '',
  occurredAt: toISODate(new Date()),
  categoryId: undefined,
  subcategoryId: undefined,
  notes: '',
};

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseForm'>;

const ExpenseFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const editingExpense: Expense | undefined = route.params?.expense;
  const [form, setForm] = React.useState<ExpensePayload>(initialState);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | undefined>();
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<Subcategory | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = React.useState(false);

  React.useEffect(() => {
    categoryService
      .getCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error obteniendo categorías', error));
  }, []);

  React.useEffect(() => {
    if (editingExpense) {
      const categoryFromList = editingExpense.categoryId
        ? categories.find((cat) => cat.id === editingExpense.categoryId)
        : undefined;
      const subcategoryFromList = editingExpense.subcategoryId
        ? categoryFromList?.subcategories.find((sub) => sub.id === editingExpense.subcategoryId)
        : undefined;

      setForm({
        amount: editingExpense.amount,
        description: editingExpense.description,
        occurredAt: editingExpense.occurredAt.split('T')[0],
        notes: editingExpense.notes,
        categoryId: editingExpense.categoryId,
        subcategoryId: editingExpense.subcategoryId,
      });
      setSelectedCategory(categoryFromList);
      setSelectedSubcategory(subcategoryFromList);
    }
  }, [editingExpense, categories]);

  const handleChange = (key: keyof ExpensePayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount) {
      Alert.alert('Completa los campos', 'Ingresa al menos descripción y monto');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, form);
      } else {
        await expenseService.addExpense(form);
      }
      Alert.alert('Éxito', 'El gasto se guardó correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error guardando gasto', error);
      Alert.alert('Error', 'No pudimos guardar el gasto, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(undefined);
    setForm((prev) => ({ ...prev, categoryId: category.id, subcategoryId: undefined }));
    setShowCategoryModal(false);
  };

  const handleSelectSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setForm((prev) => ({ ...prev, subcategoryId: subcategory.id }));
    setShowSubcategoryModal(false);
  };

  const subcategories = selectedCategory?.subcategories ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{editingExpense ? 'Editar gasto' : 'Registrar gasto'}</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Farmacia"
          value={form.description}
          onChangeText={(value) => handleChange('description', value)}
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.formGroup, styles.rowItem, styles.rowItemLeft]}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            value={form.amount ? String(form.amount) : ''}
            onChangeText={(value) => handleChange('amount', value)}
          />
        </View>
        <View style={[styles.formGroup, styles.rowItem]}>
          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.occurredAt}
            onChangeText={(value) => handleChange('occurredAt', value)}
          />
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoría</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setShowCategoryModal(true)}>
          <Text style={styles.selectorText}>
            {selectedCategory?.name ?? 'Selecciona una categoría'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Subcategoría</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => selectedCategory && setShowSubcategoryModal(true)}
          disabled={!selectedCategory}
        >
          <Text style={styles.selectorText}>
            {selectedSubcategory?.name ??
              (!selectedCategory ? 'Primero elige una categoría' : 'Selecciona una subcategoría')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          placeholder="Detalles adicionales"
          value={form.notes ?? ''}
          onChangeText={(value) => handleChange('notes', value)}
        />
      </View>
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Guardando...' : editingExpense ? 'Actualizar' : 'Guardar'}
        </Text>
      </TouchableOpacity>

      <CategoryModal
        visible={showCategoryModal}
        categories={categories}
        onClose={() => setShowCategoryModal(false)}
        onSelect={handleSelectCategory}
      />

      <SubcategoryModal
        visible={showSubcategoryModal}
        subcategories={subcategories}
        onClose={() => setShowSubcategoryModal(false)}
        onSelect={handleSelectSubcategory}
      />
    </SafeAreaView>
  );
};

interface CategoryModalProps {
  visible: boolean;
  categories: Category[];
  onSelect: (category: Category) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, categories, onClose, onSelect }) => (
  <Modal visible={visible} animationType="slide">
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Selecciona una categoría</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalClose}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
            <Text style={styles.modalItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay categorías disponibles.</Text>}
      />
    </SafeAreaView>
  </Modal>
);

interface SubcategoryModalProps {
  visible: boolean;
  subcategories: Subcategory[];
  onSelect: (subcategory: Subcategory) => void;
  onClose: () => void;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
  visible,
  subcategories,
  onClose,
  onSelect,
}) => (
  <Modal visible={visible} animationType="slide">
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Selecciona una subcategoría</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalClose}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
            <Text style={styles.modalItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay subcategorías configuradas.</Text>}
      />
    </SafeAreaView>
  </Modal>
);

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
  },
  rowItemLeft: {
    marginRight: 12,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  selectorText: {
    fontSize: 16,
    color: '#111827',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    color: '#2563eb',
    fontWeight: '600',
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  modalItemText: {
    fontSize: 16,
  },
  emptyText: {
    padding: 24,
    textAlign: 'center',
    color: '#6b7280',
  },
});

export default ExpenseFormScreen;

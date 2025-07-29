import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
export default function HomeScreen() {
  return (
      <ScrollView style={styles.container}>
        {/* Thanh tìm kiếm */}
        <View style={styles.searchBar}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <TextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="#ccc"
              style={styles.input}
          />
          <TouchableOpacity>
            <Ionicons name="person-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Lượt mượn / trả */}
        <View style={styles.statBox}>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Lượt mượn sách</Text>
            <Text style={styles.statNumber}>0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Lượt trả sách</Text>
            <Text style={styles.statNumber}>10</Text>
          </View>
        </View>

        {/* Danh mục yêu thích */}
        <Text style={styles.sectionTitle}>Danh mục yêu thích</Text>
        <View style={styles.favoriteBox}>
          <Item icon="book" label="Sách" />
          <Item icon="account" label="Độc giả" />
          <TouchableOpacity onPress={() => router.push('/report')}>
            <Item icon="file-document" label="Báo cáo" />
          </TouchableOpacity>

          <Item icon="plus" label="Chỉnh sửa" />
        </View>

        {/* Gần đây */}
        <Text style={styles.sectionTitle}>Gần đây</Text>
        <View style={styles.favoriteBox}>
          <Item icon="book" label="Sách" />
          <Item icon="account" label="Độc giả" />
          <Item icon="file-document" label="Báo cáo" />
        </View>
      </ScrollView>
  );
}

function Item({ icon, label }: { icon: string; label: string }) {
  return (
      <View style={styles.item}>
        <MaterialCommunityIcons name={icon as any} size={28} color="#333" />
        <Text style={styles.itemText}>{label}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#2980b9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statBox: {
    backgroundColor: '#f1f1f1',
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#555',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  favoriteBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  item: {
    width: 70,
    alignItems: 'center',
  },
  itemText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
  },
});

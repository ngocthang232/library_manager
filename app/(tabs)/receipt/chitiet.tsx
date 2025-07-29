import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

type BorrowItem = {
    id: string;
    title: string;
    qty: number;
    cover: string;
};

const MOCK_ITEMS: BorrowItem[] = [
    { id: 'b1', title: 'Sách ngữ văn lớp 6 tập 2', qty: 1, cover: 'https://picsum.photos/seed/11/70/100' },
    { id: 'b2', title: 'Sách ngữ văn lớp 6 tập 2', qty: 1, cover: 'https://picsum.photos/seed/12/70/100' },
    { id: 'b3', title: 'Sách ngữ văn lớp 6 tập 2', qty: 1, cover: 'https://picsum.photos/seed/13/70/100' },
];

export default function PhieuDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [items, setItems] = useState(MOCK_ITEMS);

    const removeOne = (itemId: string) => {
        setItems(prev =>
            prev.map(it => (it.id === itemId ? { ...it, qty: Math.max(0, it.qty - 1) } : it))
                .filter(it => it.qty > 0)
        );
    };

    const renderRow = ({ item }: { item: BorrowItem }) => (
        <View style={styles.row}>
            <TouchableOpacity style={styles.minusBtn} onPress={() => removeOne(item.id)}>
                <Text style={{ color: '#111827', fontWeight: '700' }}>–</Text>
            </TouchableOpacity>

            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>Mượn: {item.qty} quyển</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* tiêu đề phiếu */}
            <View style={styles.headerLine}>
                <Ionicons name="document-text-outline" size={18} color="#f59e0b" />
                <Text style={styles.headerText}>Phiếu số {id}</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={renderRow}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
            />

            {/* nút Thêm sách */}
            <TouchableOpacity style={styles.addBtn} onPress={() => { /* TODO: mở chọn sách */ }}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addText}>Thêm sách</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    headerLine: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4,
    },
    headerText: { fontWeight: '600', color: '#111827' },

    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 1,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
    },
    minusBtn: {
        width: 24, height: 24, borderRadius: 12,
        borderWidth: 1, borderColor: '#e5e7eb',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 8,
    },
    cover: { width: 50, height: 70, borderRadius: 4, marginRight: 10 },
    title: { fontWeight: '600', color: '#111827' },
    sub: { color: '#6b7280', marginTop: 4 },

    addBtn: {
        position: 'absolute', bottom: 16, alignSelf: 'center',
        flexDirection: 'row', backgroundColor: '#3b82f6',
        paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24,
        alignItems: 'center', gap: 6,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    addText: { color: '#fff', fontWeight: '600' },
});

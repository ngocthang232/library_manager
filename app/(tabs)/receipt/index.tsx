import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ConfirmDialog from '@/components/ui/ConfirmDialog'; // nếu chưa có alias, dùng đường dẫn tương đối

type Slip = {
    id: string;
    name: string;         // "Phiếu số 1"
    booksCount: number;   // 3 quyển
};

const MOCK_SLIPS: Slip[] = [
    { id: '1', name: 'Phiếu số 1', booksCount: 3 },
    { id: '2', name: 'Phiếu số 2', booksCount: 3 },
    { id: '3', name: 'Phiếu số 3', booksCount: 3 },
];

export default function PhieuListScreen() {
    const [date, setDate] = useState('12/03/2021'); // mock; có thể thay bằng DateTimePicker
    const [slips, setSlips] = useState(MOCK_SLIPS);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const onDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            setSlips(prev => prev.filter(s => s.id !== deleteId));
        }
        setConfirmOpen(false);
        setDeleteId(null);
    };

    const renderItem = ({ item }: { item: Slip }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            // 👉 /receipt/detail?id=...
            onPress={() => router.push({ pathname: '/receipt/chitiet', params: { id: item.id } })}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>Số quyển sách: {item.booksCount} quyển</Text>
            </View>

            <TouchableOpacity
                onPress={() => onDelete(item.id)}
                style={styles.deleteBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
                <Ionicons name="close-outline" size={18} color="#111" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* hàng bộ lọc ngày + filter */}
            <View style={styles.toolbar}>
                <View style={styles.toolbarLeft}>
                    <Text style={styles.toolbarLabel}>Ngày</Text>
                    <TouchableOpacity style={styles.dateBox} onPress={() => { /* TODO: mở DateTimePicker */ }}>
                        <Ionicons name="calendar-outline" size={18} color="#111827" />
                        <Text style={{ marginLeft: 8, color: '#111827' }}>{date}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.filterBtn} onPress={() => { /* TODO: bộ lọc */ }}>
                    <Ionicons name="funnel-outline" size={18} color="#111827" />
                </TouchableOpacity>
            </View>

            <Text style={styles.countText}>{slips.length} phiếu</Text>

            <FlatList
                data={slips}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
            />

            {/* Nút thêm phiếu */}
            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => router.push('/receipt/add')}
            >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addText}>Thêm phiếu mượn sách</Text>
            </TouchableOpacity>

            {/* Popup xóa dùng chung */}
            <ConfirmDialog
                visible={confirmOpen}
                message="Bạn có chắc chắn muốn xóa không?"
                cancelText="Thoát"
                confirmText="Xóa"
                confirmDanger
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    toolbar: {
        paddingHorizontal: 12,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    toolbarLabel: { color: '#6b7280', fontWeight: '600' },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef2ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    filterBtn: { padding: 8 },

    countText: { marginTop: 6, marginLeft: 12, color: '#374151' },

    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: { fontWeight: '600', color: '#111827', marginBottom: 2 },
    cardSub: { color: '#6b7280', fontSize: 13 },
    deleteBtn: {
        width: 28, height: 28, borderRadius: 14, backgroundColor: '#f3f4f6',
        alignItems: 'center', justifyContent: 'center', marginLeft: 10,
    },

    addBtn: {
        position: 'absolute', bottom: 16, right: 16,
        flexDirection: 'row', backgroundColor: '#3b82f6',
        paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24,
        alignItems: 'center', gap: 6,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    addText: { color: '#fff', fontWeight: '600' },
});

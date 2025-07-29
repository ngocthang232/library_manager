import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

type Row = { id: string; name: string; count: number };
const MOCK: Row[] = [
    { id: '1', name: 'Tên thể loại', count: 5 },
    { id: '2', name: 'Tên thể loại', count: 5 },
    { id: '3', name: 'Tên thể loại', count: 5 },
    { id: '4', name: 'Tên thể loại', count: 5 },
];

export default function ReportDetail() {
    const { type } = useLocalSearchParams<{ type?: string }>();
    const [month] = useState('03/2021');

    const title = useMemo(() => {
        switch (type) {
            case 'by-category': return 'Thống kê mượn sách theo thể loại';
            default: return 'Thống kê mượn sách';
        }
    }, [type]);

    const total = MOCK.reduce((s, r) => s + r.count, 0);

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.monthBox}>
                    <Ionicons name="calendar-outline" size={18} color="#111827" />
                    <Text style={{ marginLeft: 8, color: '#111827' }}>{month}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="funnel-outline" size={18} color="#111827" />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    <Ionicons name="stats-chart" size={22} color="#2563eb" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSub}>Tổng số lượt mượn : {total}</Text>
                </View>
            </View>

            <FlatList
                data={MOCK}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.rowName}>{item.name}</Text>
                        <Text style={styles.rowCount}>{item.count} lượt mượn</Text>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10 },
    monthBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    filterBtn: { padding: 8 },
    card: { margin: 16, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontWeight: '600', color: '#111827' },
    cardSub: { color: '#6b7280', marginTop: 2 },
    row: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowName: { color: '#111827' },
    rowCount: { color: '#111827', fontWeight: '600' },
});

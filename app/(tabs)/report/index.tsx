import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const REPORTS = [
    { key: 'borrow', title: 'Thống kê mượn sách', subtitle: 'Thống kê tình hình mượn sách' },
    { key: 'by-category', title: 'Thống kê mượn sách', subtitle: 'Thống kê tình hình mượn sách theo thể loại' },
];

export default function ReportIndex() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.headerCard}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={styles.avatar} />
                <Text style={styles.userName}>Van Duc</Text>
            </View>

            <Text style={styles.sectionTitle}>XEM BÁO CÁO CHI TIẾT</Text>

            {REPORTS.map((it) => (
                <TouchableOpacity
                    key={it.key}
                    style={styles.item}
                    onPress={() => router.push({ pathname: '/report/detail', params: { type: it.key } })}
                >
                    <View style={styles.itemLeft}>
                        <View style={styles.itemIcon}>
                            <Ionicons name="stats-chart" size={18} color="#2563eb" />
                        </View>
                        <View>
                            <Text style={styles.itemTitle}>{it.title}</Text>
                            <Text style={styles.itemSub}>{it.subtitle}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerCard: {
        backgroundColor: '#3b82f6', margin: 16, borderRadius: 14, paddingVertical: 18,
        alignItems: 'center',
    },
    avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#fff', marginBottom: 6 },
    userName: { color: '#fff', fontWeight: '700' },
    sectionTitle: { marginHorizontal: 16, color: '#6b7280', fontWeight: '600', marginBottom: 8 },
    item: {
        backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 12,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    itemIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    itemTitle: { fontWeight: '600', color: '#111827' },
    itemSub: { color: '#6b7280', fontSize: 12 },
});

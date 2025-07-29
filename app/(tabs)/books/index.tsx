import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router, useRouter} from "expo-router";

const index = [
    { id: '1', title: 'Sách ngữ văn lớp 6 tập 2', available: 10, cover: 'https://...' },
    { id: '2', title: 'Sách ngữ văn lớp 6 tập 2', available: 10, cover: 'https://...' },
    { id: '3', title: 'Sách ngữ văn lớp 6 tập 2', available: 10, cover: 'https://...' },
];

export default function BookScreen() {
    const [activeTab, setActiveTab] = useState<'tatca' | 'theloai'>('tatca');

    const router = useRouter();
    const goToUpdate = (id: string) =>
        router.push({ pathname: '/books/update', params: { id } });


    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.bookItem} onPress={() => goToUpdate(item.id)}>
            <Image source={{ uri: item.cover }} style={styles.bookImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAvail}>
                    Có thể mượn: <Text style={{ color: '#1e90ff' }}>{item.available}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity onPress={() => setActiveTab('tatca')} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === 'tatca' && styles.tabTextActive]}>
                        Tất cả
                    </Text>
                    {activeTab === 'tatca' && <View style={styles.tabUnderline} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab('theloai')} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === 'theloai' && styles.tabTextActive]}>
                        Thể loại
                    </Text>
                    {activeTab === 'theloai' && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
            </View>

            {/* Nội dung tab */}
            <View style={{ marginTop: 20, paddingHorizontal: 16, flex: 1 }}>
                {activeTab === 'tatca' ? (
                    <>
                        <View style={styles.filterRow}>
                            <Text style={styles.productCount}>{index.length} sản phẩm</Text>
                            <Ionicons name="filter" size={20} color="#000" />
                        </View>

                        <FlatList
                            data={index}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            style={styles.bookList}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        />

                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/books/add')}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Thêm sách</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text>Hiển thị các thể loại sách ở đây.</Text>
                        {/* TODO: render danh sách thể loại */}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    tabBtn: { flex: 1, alignItems: 'center', paddingBottom: 8 },
    tabText: { color: '#666', fontSize: 15 },
    tabTextActive: { color: '#1e90ff', fontWeight: '600' },
    tabUnderline: {
        marginTop: 6,
        height: 2,
        width: 40,
        backgroundColor: '#1e90ff',
        borderRadius: 2,
    },

    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productCount: { fontSize: 14, color: '#333' },

    bookList: { flex: 1 },
    bookItem: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f9',
        padding: 10,
        borderRadius: 10,
    },
    bookImage: { width: 50, height: 70, marginRight: 10, borderRadius: 4 },
    bookTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
    bookAvail: { marginTop: 4, color: '#444' },

    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        flexDirection: 'row',
        backgroundColor: '#1e90ff',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    addButtonText: { color: '#fff', fontWeight: '600' },
});

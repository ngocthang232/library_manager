import React, { useMemo, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    FlatList, Modal, Pressable, Alert, Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

type Book = { id: string; title: string };
type Item = Book & { qty: number };

// ── Mock: danh sách sách để chọn từ modal
const MOCK_BOOKS: Book[] = [
    { id: 'b1', title: 'Ngữ văn 6 - Tập 2' },
    { id: 'b2', title: 'Toán 6' },
    { id: 'b3', title: 'Lịch sử 6' },
    { id: 'b4', title: 'Địa lí 6' },
];

export default function AddReceiptScreen() {
    // Nếu bạn đã có màn chọn độc giả riêng (select-reader),
    // nhận borrower từ query params khi quay lại:
    const params = useLocalSearchParams<{ borrowerId?: string; borrowerName?: string }>();

    // Ngày (mock – có thể thay DateTimePicker sau)
    const [date, setDate] = useState<string>(() => {
        const d = new Date();
        return d.toLocaleDateString('vi-VN'); // ví dụ: 29/07/2025
    });

    // Người mượn
    const [borrower, setBorrower] = useState('');
    useEffect(() => {
        if (params?.borrowerName) setBorrower(String(params.borrowerName));
    }, [params?.borrowerName]);

    // Danh sách sách mượn
    const [items, setItems] = useState<Item[]>([]);
    const totalQty = items.reduce((s, it) => s + it.qty, 0);

    // Modal chọn sách
    const [pickerOpen, setPickerOpen] = useState(false);
    const [search, setSearch] = useState('');
    const filteredBooks = useMemo(
        () => MOCK_BOOKS.filter(b => b.title.toLowerCase().includes(search.toLowerCase())),
        [search]
    );

    // Thao tác với danh sách mượn
    const addOrInc = (book: Book) => {
        setItems(prev => {
            const idx = prev.findIndex(it => it.id === book.id);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
                return copy;
            }
            return [...prev, { ...book, qty: 1 }];
        });
    };

    const dec = (id: string) => {
        setItems(prev =>
            prev
                .map(it => (it.id === id ? { ...it, qty: Math.max(0, it.qty - 1) } : it))
                .filter(it => it.qty > 0)
        );
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(it => it.id !== id));
    };

    // Gửi tạo phiếu (mock)
    const [submitting, setSubmitting] = useState(false);
    const handleCreate = async () => {
        if (!borrower.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập người mượn.');
            return;
        }
        if (items.length === 0) {
            Alert.alert('Thiếu sách', 'Vui lòng chọn ít nhất một sách.');
            return;
        }

        try {
            setSubmitting(true);

            // payload mẫu – thay bằng API thật của bạn
            const payload = {
                date,
                borrowerName: borrower.trim(),
                items: items.map(({ id, qty }) => ({ id, qty })),
            };

            // TODO: call API backend
            // const res = await fetch('http://<server>/api/receipts', { ... })
            // const data = await res.json();
            // const newId = data.id;

            const newId = String(Date.now()); // mock id
            router.replace({ pathname: '/receipt/detail', params: { id: newId } });
        } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Không thể tạo phiếu. Vui lòng thử lại!');
        } finally {
            setSubmitting(false);
        }
    };

    const renderRow = ({ item }: { item: Item }) => (
        <View style={styles.row}>
            <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>Mượn: {item.qty} quyển</Text>
            </View>

            <View style={styles.qtyGroup}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(item.id)}>
                    <Text style={{ fontWeight: '700' }}>–</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => addOrInc(item)}>
                    <Text style={{ fontWeight: '700' }}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delBtn} onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Khối form giống layout "Thêm sách": ô ngày + người mượn */}
            <View style={styles.formCard}>
                {/* Ô Ngày */}
                <Text style={styles.formLabel}>Ngày</Text>
                <TouchableOpacity
                    style={[styles.input, styles.inputBtn]}
                    onPress={() => {
                        // TODO: mở DateTimePicker sau
                        Alert.alert('Chọn ngày', 'Bạn có thể tích hợp DateTimePicker tại đây.');
                    }}
                >
                    <Ionicons name="calendar-outline" size={18} color="#111827" />
                    <Text style={{ marginLeft: 8 }}>{date}</Text>
                </TouchableOpacity>

                {/* Ô Người mượn */}
                <Text style={[styles.formLabel, { marginTop: 12 }]}>Người mượn *</Text>
                {/* Nếu bạn có màn chọn độc giả riêng: bọc TextInput bằng TouchableOpacity và push('/receipt/select-reader') */}
                <TextInput
                    value={borrower}
                    onChangeText={setBorrower}
                    placeholder="Nhập tên độc giả"
                    style={styles.input}
                />
            </View>

            {/* Danh sách sách mượn */}
            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={renderRow}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 140, paddingTop: 8 }}
                ListEmptyComponent={
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={{ color: '#6b7280' }}>Chưa có sách nào. Hãy bấm “Chọn sách”.</Text>
                    </View>
                }
            />

            {/* Nút Chọn sách – giống nút thêm sách (trước khi có picker riêng) */}
            <TouchableOpacity style={styles.addBtn} onPress={() => setPickerOpen(true)}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addText}>Chọn sách</Text>
            </TouchableOpacity>

            {/* Nút Tạo phiếu */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate} disabled={submitting}>
                <Text style={styles.primaryText}>
                    {submitting ? 'Đang tạo...' : `Tạo phiếu ${totalQty > 0 ? `(${totalQty} quyển)` : ''}`}
                </Text>
            </TouchableOpacity>

            {/* Modal chọn sách */}
            <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
                <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)} />
                <View style={styles.sheet}>
                    <Text style={styles.sheetTitle}>Chọn sách</Text>

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Tìm kiếm"
                        style={[styles.input, { marginHorizontal: 0, marginBottom: 10 }]}
                    />

                    <FlatList
                        data={filteredBooks}
                        keyExtractor={(b) => b.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.pickRow}
                                onPress={() => addOrInc(item)}
                            >
                                <Ionicons name="book-outline" size={18} color="#2563eb" />
                                <Text style={{ marginLeft: 10, flex: 1 }}>{item.title}</Text>
                                <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        contentContainerStyle={{ paddingBottom: 8 }}
                    />

                    <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} onPress={() => setPickerOpen(false)}>
                        <Text style={styles.primaryText}>Xong</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    formCard: {
        backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 14,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    },
    formLabel: { color: '#374151', marginBottom: 6, fontWeight: '500' },
    input: {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff',
    },
    inputBtn: {
        flexDirection: 'row', alignItems: 'center',
    },

    row: {
        backgroundColor: '#fff', borderRadius: 10, padding: 12,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 12,
    },
    rowTitle: { fontWeight: '600', color: '#111827' },
    rowSub: { color: '#6b7280', marginTop: 4 },

    qtyGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    qtyBtn: {
        width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb',
        alignItems: 'center', justifyContent: 'center',
    },
    delBtn: {
        width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#fecaca',
        alignItems: 'center', justifyContent: 'center',
    },

    addBtn: {
        position: 'absolute', bottom: 72, alignSelf: 'flex-start', left: 16,
        flexDirection: 'row', backgroundColor: '#3b82f6',
        paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24,
        alignItems: 'center', gap: 6,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    addText: { color: '#fff', fontWeight: '600' },

    primaryBtn: {
        position: 'absolute', bottom: 16, left: 16, right: 16,
        backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    },
    primaryText: { color: '#fff', fontWeight: '600' },

    // modal sheet
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
    sheet: {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: 16, maxHeight: '70%',
    },
    sheetTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
    pickRow: {
        backgroundColor: '#f9fafb', padding: 10, borderRadius: 10,
        flexDirection: 'row', alignItems: 'center',
    },
});

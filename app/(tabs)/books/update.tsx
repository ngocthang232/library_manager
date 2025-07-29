import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function UpdateBook() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(''),
          [author, setAuthor] = useState(''),
          [publisher, setPublisher] = useState(''),
          [year, setYear] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) { router.replace('/books/add'); return; }
            try {
                setLoading(true);
                // TODO: GET /api/books/:id
                // Nếu không tìm thấy thì chuyển về /books/add:
                // if (404) router.replace('/books/add');

                // mock data:
                setTitle('Sách ngữ văn lớp 6 tập 2');
                setAuthor('Bộ GD&ĐT');
                setPublisher('NXB Giáo dục');
                setYear('2023');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleUpdate = async () => {
        if (!title || !author || !publisher || !year) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường *');
            return;
        }
        // TODO: PUT /api/books/:id
        Alert.alert('Thành công', 'Đã cập nhật sách!');
        router.back();
    };

    // 👉 Hàm xoá THẬT SỰ — gọi khi bấm “Xóa” trong popup
    const handleDelete = async () => {
        try {
            setConfirmOpen(false); // đóng popup
            Alert.alert('Đã xóa!');
            router.back();         // quay lại danh sách
        } catch (e) {
            Alert.alert('Lỗi', 'Xóa không thành công!');
        }
    };

    if (loading) return <View style={{ flex: 1 }} />;

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
                <TouchableOpacity style={styles.coverBox}>
                    <Ionicons name="image-outline" size={24} color="#3b82f6" />
                </TouchableOpacity>

                <Field label="Tên sách" required value={title} onChangeText={setTitle} />
                <Field label="Tác giả" required value={author} onChangeText={setAuthor} />
                <Field label="Nhà xuất bản" required value={publisher} onChangeText={setPublisher} />
                <Field label="Năm xuất bản" required value={year} onChangeText={setYear} keyboardType="numeric" />

                <View style={{ flexDirection:'row', gap:12, marginTop:8 }}>
                    {/* MỞ POPUP thay vì xóa ngay */}
                    <TouchableOpacity style={styles.dangerBtn} onPress={() => setConfirmOpen(true)}>
                        <Text style={styles.dangerText}>Xóa sách</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.primaryBtn, { flex:1 }]} onPress={handleUpdate}>
                        <Text style={styles.primaryText}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Popup xác nhận */}
            <ConfirmDialog
                visible={confirmOpen}
                message="Bạn có chắc chắn muốn xóa không?"
                cancelText="Thoát"
                confirmText="Xóa"
                confirmDanger
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}   // XÓA thật sự ở đây
            />
        </>
    );
}

function Field({ label, required, value, onChangeText, keyboardType }: any) {
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label} {required && <Text style={{ color: 'red' }}>*</Text>}</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={`Nhập ${label.toLowerCase()}`} />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex:1, backgroundColor:'#fff', padding:16 },
    coverBox:{ width:48, height:48, borderRadius:8, borderWidth:1, borderColor:'#e5e7eb', alignItems:'center', justifyContent:'center', backgroundColor:'#f9fafb', marginBottom:16 },
    label:{ fontSize:14, color:'#374151', marginBottom:6 },
    input:{ borderWidth:1, borderColor:'#d1d5db', borderRadius:10, paddingHorizontal:12, paddingVertical:10, backgroundColor:'#fff' },
    primaryBtn:{ backgroundColor:'#3b82f6', paddingVertical:14, borderRadius:10, alignItems:'center' },
    primaryText:{ color:'#fff', fontWeight:'600' },
    dangerBtn:{ flex:1, borderWidth:1, borderColor:'#ef4444', paddingVertical:14, borderRadius:10, alignItems:'center' },
    dangerText:{ color:'#ef4444', fontWeight:'600' },
});

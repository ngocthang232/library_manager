import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState('');

    const handleCreate = async () => {
        if (!title || !author || !publisher || !year) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường *');
            return;
        }
        // TODO: POST /api/books
        Alert.alert('Thành công', 'Đã tạo sách!');
        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <TouchableOpacity style={styles.coverBox}>
                <Ionicons name="image-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>

            <Field label="Tên sách" required value={title} onChangeText={setTitle} />
            <Field label="Tác giả" required value={author} onChangeText={setAuthor} />
            <Field label="Nhà xuất bản" required value={publisher} onChangeText={setPublisher} />
            <Field label="Năm xuất bản" required value={year} onChangeText={setYear} keyboardType="numeric" />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
                <Text style={styles.primaryText}>Tạo sách</Text>
            </TouchableOpacity>
        </ScrollView>
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
    primaryBtn:{ marginTop:12, backgroundColor:'#3b82f6', paddingVertical:14, borderRadius:10, alignItems:'center' },
    primaryText:{ color:'#fff', fontWeight:'600' },
});

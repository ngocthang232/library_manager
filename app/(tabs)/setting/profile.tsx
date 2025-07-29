import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [name, setName] = useState('Nguyễn Vũ Văn Đức');
    const [dob, setDob] = useState('');         // ví dụ: 2000-01-01
    const [gender, setGender] = useState('');   // Nam/Nữ/Khác
    const [email, setEmail] = useState('');

    const handleSave = async () => {
        // TODO: gọi API cập nhật thông tin
        Alert.alert('Thành công', 'Đã lưu thông tin!');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Header Avatar */}
            <View style={styles.headerCard}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={styles.bigAvatar} />
                <Text style={styles.headerName}>Van Duc</Text>
                <TouchableOpacity style={styles.editIcon} onPress={() => { /* TODO: đổi ảnh */ }}>
                    <Ionicons name="pencil" size={16} color="#111827" />
                </TouchableOpacity>
            </View>

            <Field label="Họ và tên" value={name} onChangeText={setName} />
            <Field label="Ngày sinh" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />
            <Field label="Giới tính" value={gender} onChangeText={setGender} placeholder="Nam/Nữ/Khác" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
                <Text style={styles.primaryText}>Lưu</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function Field({
                   label, value, onChangeText, placeholder, keyboardType,
               }: any) {
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },

    headerCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        alignItems: 'center',
        paddingVertical: 18,
        marginBottom: 16,
        position: 'relative',
    },
    bigAvatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 6 },
    headerName: { fontWeight: '700', color: '#111827' },
    editIcon: {
        position: 'absolute', right: 12, top: 12,
        width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    },

    label: { fontSize: 14, color: '#374151', marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff',
    },

    primaryBtn: { backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    primaryText: { color: '#fff', fontWeight: '600' },
});

import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type FormValues = {
    title: string;
    author: string;
    publisher: string;
    year: string; // để dễ kiểm tra chuỗi số; khi gửi có thể parseInt
};

const CURRENT_YEAR = new Date().getFullYear();

const schema: yup.SchemaOf<FormValues> = yup.object({
    title: yup
        .string()
        .trim()
        .required('Vui lòng nhập tên sách')
        .min(2, 'Tên sách tối thiểu 2 ký tự'),
    author: yup
        .string()
        .trim()
        .required('Vui lòng nhập tác giả'),
    publisher: yup
        .string()
        .trim()
        .required('Vui lòng nhập nhà xuất bản'),
    year: yup
        .string()
        .required('Vui lòng nhập năm xuất bản')
        .matches(/^\d+$/, 'Năm xuất bản phải là số')
        .test('range', `Năm hợp lệ từ 1900 đến ${CURRENT_YEAR + 1}`, (val) => {
            const n = Number(val);
            return n >= 1900 && n <= CURRENT_YEAR + 1;
        }),
});

export default function AddBookScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',          // validate theo từng thay đổi
        reValidateMode: 'onChange',
        defaultValues: {
            title: '',
            author: '',
            publisher: '',
            year: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // Chuyển year thành số nếu backend cần
            const payload = {
                title: values.title.trim(),
                author: values.author.trim(),
                publisher: values.publisher.trim(),
                year: Number(values.year),
            };

            // TODO: Gọi API thật để tạo sách
            // const res = await fetch('http://<server>/api/books', { ... })
            // const data = await res.json();

            Alert.alert('Thành công', 'Đã tạo sách!');
            router.back(); // quay lại danh sách
        } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Không thể tạo sách. Vui lòng thử lại!');
        }
    };

    const renderField = (
        name: keyof FormValues,
        label: string,
        placeholder: string,
        keyboardType?: 'default' | 'numeric'
    ) => (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label} <Text style={{ color: 'red' }}>*</Text></Text>

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        style={[
                            styles.input,
                            errors[name] && { borderColor: '#ef4444' }, // viền đỏ khi lỗi
                        ]}
                    />
                )}
            />

            {!!errors[name]?.message && (
                <Text style={styles.errorText}>{String(errors[name]?.message)}</Text>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Ảnh bìa (placeholder) */}
            <TouchableOpacity style={styles.coverBox} onPress={() => { /* TODO: image picker */ }}>
                <Ionicons name="image-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>

            {renderField('title', 'Tên sách', 'Nhập tên sách')}
            {renderField('author', 'Tác giả', 'Nhập tác giả')}
            {renderField('publisher', 'Nhà xuất bản', 'Nhập nhà xuất bản')}
            {renderField('year', 'Năm xuất bản', 'VD: 2024', 'numeric')}

            <TouchableOpacity
                style={[styles.primaryBtn, !isValid || isSubmitting ? { opacity: 0.6 } : null]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
            >
                <Text style={styles.primaryBtnText}>{isSubmitting ? 'Đang tạo...' : 'Tạo sách'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },

    coverBox: {
        width: 48, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', marginBottom: 16,
    },

    label: { fontSize: 14, color: '#374151', marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff',
    },
    errorText: { color: '#ef4444', marginTop: 6, fontSize: 12 },

    primaryBtn: {
        backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8,
    },
    primaryBtnText: { color: '#fff', fontWeight: '600' },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Nếu bạn đã có dialog dùng chung:
import ConfirmDialog from '@/components/ui/ConfirmDialog'; // Đổi path nếu bạn chưa cấu hình "@/"

type FormValues = {
    title: string;
    author: string;
    publisher: string;
    year: string; // giữ chuỗi để dễ nhập, khi gửi sẽ parseInt
};

const CURRENT_YEAR = new Date().getFullYear();

const schema: yup.SchemaOf<FormValues> = yup.object({
    title: yup.string().trim().required('Vui lòng nhập tên sách').min(2, 'Tên sách tối thiểu 2 ký tự'),
    author: yup.string().trim().required('Vui lòng nhập tác giả'),
    publisher: yup.string().trim().required('Vui lòng nhập nhà xuất bản'),
    year: yup
        .string()
        .required('Vui lòng nhập năm xuất bản')
        .matches(/^\d+$/, 'Năm xuất bản phải là số')
        .test('range', `Năm hợp lệ từ 1900 đến ${CURRENT_YEAR + 1}`, (val) => {
            const n = Number(val);
            return n >= 1900 && n <= CURRENT_YEAR + 1;
        }),
});

export default function UpdateBookScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting, isDirty },
        reset,
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { title: '', author: '', publisher: '', year: '' },
    });

    // Lấy chi tiết sách -> prefill form
    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) {
                router.replace('/books/add');
                return;
            }
            try {
                setLoading(true);
                // TODO: Gọi API thật: const res = await fetch(`/api/books/${id}`);
                // if (!res.ok) throw new Error('not_found');
                // const data = await res.json();

                // Mock dữ liệu:
                const data = {
                    title: 'Sách ngữ văn lớp 6 tập 2',
                    author: 'Bộ GD&ĐT',
                    publisher: 'NXB Giáo dục',
                    year: 2023,
                };

                // Reset form với dữ liệu từ server
                reset({
                    title: data.title ?? '',
                    author: data.author ?? '',
                    publisher: data.publisher ?? '',
                    year: String(data.year ?? ''),
                });
            } catch (e) {
                // Không tìm thấy -> chuyển sang thêm mới
                router.replace('/books/add');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, reset]);

    const onSubmit = async (values: FormValues) => {
        try {
            // Payload gửi lên (convert year -> number)
            const payload = {
                title: values.title.trim(),
                author: values.author.trim(),
                publisher: values.publisher.trim(),
                year: Number(values.year),
            };

            // TODO: PUT /api/books/:id
            // const res = await fetch(`/api/books/${id}`, { method: 'PUT', headers: {...}, body: JSON.stringify(payload) });
            // if (!res.ok) throw new Error(await res.text());

            Alert.alert('Thành công', 'Đã cập nhật sách!');
            router.back();
        } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Cập nhật thất bại, vui lòng thử lại!');
        }
    };

    const handleDelete = async () => {
        try {
            // TODO: DELETE /api/books/:id
            setConfirmOpen(false);
            Alert.alert('Đã xóa!');
            router.back();
        } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Xóa không thành công!');
        }
    };

    const renderField = (
        name: keyof FormValues,
        label: string,
        placeholder: string,
        keyboardType?: 'default' | 'numeric'
    ) => (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>
                {label} <Text style={{ color: 'red' }}>*</Text>
            </Text>
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
                        style={[styles.input, errors[name] && { borderColor: '#ef4444' }]}
                    />
                )}
            />
            {!!errors[name]?.message && <Text style={styles.errorText}>{String(errors[name]?.message)}</Text>}
        </View>
    );

    if (loading) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Ảnh bìa (placeholder) */}
                <TouchableOpacity style={styles.coverBox} onPress={() => { /* TODO: image picker */ }}>
                    <Ionicons name="image-outline" size={24} color="#3b82f6" />
                </TouchableOpacity>

                {renderField('title', 'Tên sách', 'Nhập tên sách')}
                {renderField('author', 'Tác giả', 'Nhập tác giả')}
                {renderField('publisher', 'Nhà xuất bản', 'Nhập nhà xuất bản')}
                {renderField('year', 'Năm xuất bản', 'VD: 2024', 'numeric')}

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                    {/* Xóa: mở popup xác nhận */}
                    <TouchableOpacity style={styles.dangerBtn} onPress={() => setConfirmOpen(true)} disabled={!id}>
                        <Text style={styles.dangerText}>Xóa sách</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryBtn, { flex: 1 }, !isValid || isSubmitting ? { opacity: 0.6 } : null]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isValid || isSubmitting}
                    >
                        <Text style={styles.primaryText}>{isSubmitting ? 'Đang lưu...' : (isDirty ? 'Cập nhật' : 'Lưu lại')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Popup xác nhận xóa (nếu bạn có ConfirmDialog) */}
            <ConfirmDialog
                visible={confirmOpen}
                message="Bạn có chắc chắn muốn xóa không?"
                cancelText="Thoát"
                confirmText="Xóa"
                confirmDanger
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </>
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
        backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    },
    primaryText: { color: '#fff', fontWeight: '600' },

    dangerBtn: {
        flex: 1, borderWidth: 1, borderColor: '#ef4444', paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    },
    dangerText: { color: '#ef4444', fontWeight: '600' },
});

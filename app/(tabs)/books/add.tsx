import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const schema = yup.object().shape({
    title: yup.string().required('Tên sách là bắt buộc'),
    author: yup.string().required('Tác giả là bắt buộc'),
    publisher: yup.string().required('Nhà xuất bản là bắt buộc'),
    year: yup
        .number()
        .typeError('Năm xuất bản phải là số')
        .min(1000, 'Năm không hợp lệ')
        .required('Năm xuất bản là bắt buộc'),
    categoryId: yup.number().required('Vui lòng chọn thể loại'),
});

export default function AddBookScreen() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<{ id: number; tenTheLoai: string }[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            author: '',
            publisher: '',
            year: '',
            categoryId: undefined,
        },
        mode: 'onTouched',
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8080/api/theloai');
                setCategories(res.data);
            } catch (e) {
                Alert.alert('Lỗi', 'Không thể tải danh sách thể loại');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Quyền bị từ chối', 'Bạn cần cho phép truy cập thư viện ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const selected = result.assets.map((asset) => asset.uri);
            setImages((prev) => [...prev, ...selected]);
        }
    };

    const onSubmit = async (data: any) => {
        if (images.length === 0) {
            Alert.alert('Thiếu ảnh', 'Vui lòng chọn ít nhất 1 ảnh');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('author', data.author);
            formData.append('publisher', data.publisher);
            formData.append('year', data.year);
            formData.append('theLoaiId', data.categoryId);

            images.forEach((uri, index) => {
                formData.append('images', {
                    uri,
                    type: 'image/jpeg',
                    name: `book_image_${index}.jpg`,
                } as any);
            });

            await axios.post('http://localhost:8080/api/book/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Thành công', 'Tạo sách thành công');
        } catch (err) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo sách');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (
        name: keyof any,
        label: string,
        placeholder: string,
        keyboardType = 'default'
    ) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                        placeholder={placeholder}
                        style={[styles.input, errors[name] && styles.inputError]}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        keyboardType={keyboardType}
                    />
                    {errors[name] && <Text style={styles.error}>{errors[name]?.message}</Text>}
                </View>
            )}
        />
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <TouchableOpacity style={styles.coverBox} onPress={pickImages}>
                <Ionicons name="image-outline" size={28} color="#3b82f6" />
                <Text style={styles.pickText}>Chọn ảnh bìa</Text>
            </TouchableOpacity>

            <ScrollView horizontal style={{ marginTop: 12, marginBottom: 20 }}>
                {images.map((uri, index) => (
                    <Image
                        key={index}
                        source={{ uri }}
                        style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
                    />
                ))}
            </ScrollView>

            {renderField('title', 'Tên sách', 'Nhập tên sách')}
            {renderField('author', 'Tác giả', 'Nhập tác giả')}
            {renderField('publisher', 'Nhà xuất bản', 'Nhập nhà xuất bản')}
            {renderField('year', 'Năm xuất bản', 'VD: 2024', 'numeric')}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Thể loại</Text>
                {loadingCategories ? (
                    <ActivityIndicator />
                ) : (
                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field: { onChange, value } }) => (
                            <View style={[styles.pickerWrapper, errors.categoryId && styles.inputError]}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(itemValue) => onChange(itemValue)}
                                >
                                    <Picker.Item label="-- Chọn thể loại --" value={undefined} />
                                    {categories.map((c) => (
                                        <Picker.Item key={c.id} label={c.tenTheLoai} value={c.id} />
                                    ))}
                                </Picker>
                            </View>
                        )}
                    />
                )}
                {errors.categoryId && <Text style={styles.error}>{errors.categoryId.message}</Text>}
            </View>

            <TouchableOpacity
                style={[styles.primaryBtn, isSubmitting ? { opacity: 0.6 } : null]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                <Text style={styles.primaryBtnText}>{isSubmitting ? 'Đang tạo...' : 'Tạo sách'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    coverBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#3b82f6',
        borderStyle: 'dashed',
        borderRadius: 8,
    },
    pickText: {
        marginTop: 6,
        color: '#3b82f6',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontWeight: '600',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        marginTop: 4,
    },
    primaryBtn: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: 'white',
        fontWeight: '600',
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingScreen() {
    const [notif, setNotif] = useState(true);
    const [autoUpdate, setAutoUpdate] = useState(false);

    return (
        <View style={styles.container}>
            {/* Card tài khoản */}
            <View style={styles.userCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.userName}>Van Duc</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/setting/profile')}>
                    <Ionicons name="enter-outline" size={22} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Nhóm: Thiết lập tài khoản */}
            <Text style={styles.sectionTitle}>Thiết lập tài khoản</Text>

            <RowItem
                icon="create-outline"
                label="Chỉnh sửa thông tin"
                onPress={() => router.push('/setting/profile')}
            />
            <RowItem
                icon="key-outline"
                label="Thay đổi mật khẩu"
                onPress={() => {/* TODO: điều hướng change-password */}}
                right={<Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
            />
            <RowItem
                icon="notifications-outline"
                label="Bật thông báo"
                right={<Switch value={notif} onValueChange={setNotif} />}
            />
            <RowItem
                icon="refresh-outline"
                label="Tự động cập nhật"
                right={<Switch value={autoUpdate} onValueChange={setAutoUpdate} />}
            />

            {/* Nhóm: Thông tin thêm */}
            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Thông tin thêm</Text>
            <RowItem
                icon="information-circle-outline"
                label="Về chúng tôi"
                onPress={() => {/* TODO */}}
                right={<Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
            />
            <RowItem
                icon="shield-checkmark-outline"
                label="Chính sách bảo mật"
                onPress={() => {/* TODO */}}
                right={<Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
            />

            {/* Đăng xuất */}
            <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/login')}>
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
}

function RowItem({
                     icon, label, onPress, right,
                 }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    right?: React.ReactNode;
}) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={icon} size={20} color="#111827" />
                <Text style={styles.rowText}>{label}</Text>
            </View>
            {right ?? <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    userCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 14,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    },
    avatar: { width: 42, height: 42, borderRadius: 21 },
    userName: { fontSize: 16, fontWeight: '600', color: '#111827' },

    sectionTitle: {
        marginHorizontal: 16,
        marginBottom: 8,
        color: '#6b7280',
        fontSize: 13,
        fontWeight: '600',
    },

    row: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowText: { fontSize: 15, color: '#111827' },

    logoutBtn: {
        borderWidth: 1, borderColor: '#fecaca',
        paddingVertical: 12, borderRadius: 10, alignItems: 'center',
        margin: 16, flexDirection: 'row', justifyContent: 'center', gap: 8,
    },
    logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 },
});

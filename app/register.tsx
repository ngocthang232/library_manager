import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {useRouter} from "expo-router";

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleRegister = () => {
        if (username && password) {
            Alert.alert('Đăng ký thành công', 'Bây giờ bạn có thể đăng nhập.', [
                { text: 'OK', onPress: () => router.push('login') }
            ]);
        } else {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Đăng ký" onPress={handleRegister} />
            <Text style={styles.link} onPress={() => router.push('login')}>
                Đã có tài khoản? Đăng nhập
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
    link: { marginTop: 15, textAlign: 'center', color: 'blue' }
});

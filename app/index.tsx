import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {useRouter} from "expo-router";

export default function WelcomeScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chào mừng bạn đến với Library Manager 📚</Text>
            <View style={styles.buttonContainer}>
                <Button title="Đăng nhập" onPress={() => router.push('/login')} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Đăng ký" onPress={() => router.push('/register')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    buttonContainer: { width: '100%', marginVertical: 10 }
});

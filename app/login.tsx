import React, { useMemo, useRef, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);
    const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
    const passRef = useRef<TextInput>(null);

    // ===== Rules =====
    const validateUsername = (value: string) => {
        const v = value.trim();
        if (!v) return "Vui lòng nhập tên đăng nhập.";
        if (v.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự.";
        return "";
    };
    const validatePassword = (value: string) => {
        if (!value) return "Vui lòng nhập mật khẩu.";
        if (value.length < 6 || value.length > 32) return "Mật khẩu 6–32 ký tự.";
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
            return "Mật khẩu phải có ít nhất 1 chữ và 1 số.";
        }
        return "";
    };

    // ===== Errors (recomputed theo state) =====
    const errors = useMemo(() => {
        return {
            username: validateUsername(username),
            password: validatePassword(password),
        };
    }, [username, password]);

    const hasErrors = !!errors.username || !!errors.password;

    const onLogin = () => {
        // đánh dấu đã chạm để hiện lỗi nếu có
        setTouched({ username: true, password: true });
        if (hasErrors) return;

        // TODO: call API
        router.replace("/books");
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                {/* Header xanh */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>QUẢN LÝ THƯ VIỆN</Text>
                </View>

                {/* Card trắng */}
                <View style={styles.card}>
                    {/* Avatar */}
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarEmoji}>👤</Text>
                        </View>
                    </View>

                    {/* Username */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <TextInput
                            placeholder="Nhập tên đăng nhập"
                            autoCapitalize="none"
                            returnKeyType="next"
                            value={username}
                            onChangeText={(t) => setUsername(t)}
                            onBlur={() => setTouched((s) => ({ ...s, username: true }))}
                            style={[
                                styles.input,
                                touched.username && errors.username ? styles.inputError : null,
                            ]}
                            onSubmitEditing={() => passRef.current?.focus()}
                        />
                        {touched.username && !!errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                    </View>

                    {/* Password */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <View>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    ref={passRef}
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={(t) => setPassword(t)}
                                    onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                                    secureTextEntry={secure}
                                    style={[
                                        styles.input,
                                        { flex: 1 },
                                        touched.password && errors.password ? styles.inputError : null,
                                    ]}
                                />
                                <TouchableOpacity
                                    onPress={() => setSecure((v) => !v)}
                                    style={styles.eyeBtn}
                                >
                                    <Text style={styles.eyeText}>{secure ? "Hiện" : "Ẩn"}</Text>
                                </TouchableOpacity>
                            </View>
                            {touched.password && !!errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                        </View>
                    </View>

                    {/* Quên mật khẩu */}
                    <TouchableOpacity style={styles.forgotBtn} onPress={() => {}}>
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Buttons */}
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            style={[styles.button, hasErrors ? styles.buttonDisabled : null]}
                            onPress={onLogin}
                            disabled={hasErrors}
                        >
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <Link href="/register" asChild>
                            <TouchableOpacity style={[styles.button, styles.signupBtn]}>
                                <Text style={styles.buttonText}>Đăng ký</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const BLUE = "#1f6feb";
const RED = "#dc2626";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BLUE },
    header: {
        height: 120,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 12,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginTop: -40,
    },
    avatarWrap: { alignItems: "center", marginTop: -40, marginBottom: 8 },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#eaf1ff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: BLUE,
    },
    avatarEmoji: { fontSize: 34 },
    field: { marginTop: 12 },
    label: { marginBottom: 6, color: "#333", fontWeight: "600" },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#d0d7de",
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: RED,
    },
    errorText: {
        marginTop: 6,
        color: RED,
        fontSize: 12.5,
    },
    passwordRow: { flexDirection: "row", alignItems: "center" },
    eyeBtn: {
        marginLeft: 8,
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#d0d7de",
        justifyContent: "center",
    },
    eyeText: { color: BLUE, fontWeight: "600" },
    forgotBtn: { alignSelf: "flex-start", marginTop: 8 },
    forgotText: { color: BLUE },
    buttonsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BLUE,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    signupBtn: { backgroundColor: "#2563eb" },
    buttonText: { color: "#fff", fontWeight: "700" },
});

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
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [touched, setTouched] = useState<{
        username?: boolean;
        password?: boolean;
        confirm?: boolean;
    }>({});

    const passRef = useRef<TextInput | null>(null);
    const confirmRef = useRef<TextInput | null>(null);

    // ===== Rules =====
    const validateUsername = (v: string) => {
        const t = v.trim();
        if (!t) return "Vui lòng nhập tên đăng nhập.";
        if (t.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự.";
        return "";
    };
    const validatePassword = (v: string) => {
        if (!v) return "Vui lòng nhập mật khẩu.";
        if (v.length < 6 || v.length > 32) return "Mật khẩu 6–32 ký tự.";
        if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v))
            return "Mật khẩu phải có ít nhất 1 chữ và 1 số.";
        return "";
    };
    const validateConfirm = (v: string, p: string) => {
        if (!v) return "Vui lòng nhập lại mật khẩu.";
        if (v !== p) return "Mật khẩu nhập lại không khớp.";
        return "";
    };

    // ===== Errors =====
    const errors = useMemo(() => {
        return {
            username: validateUsername(username),
            password: validatePassword(password),
            confirm: validateConfirm(confirm, password),
        };
    }, [username, password, confirm]);

    const hasErrors = !!errors.username || !!errors.password || !!errors.confirm;

    const onRegister = () => {
        setTouched({ username: true, password: true, confirm: true });
        if (hasErrors) return;

        // TODO: Call API tạo tài khoản
        // Demo: báo thành công => quay về màn đăng nhập
        Alert.alert("Thành công", "Tạo tài khoản thành công!", [
            { text: "OK", onPress: () => router.replace("/login") },
        ]);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>QUẢN LÝ THƯ VIỆN</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Đăng ký tài khoản</Text>

                    {/* Username */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tên đăng nhập*</Text>
                        <TextInput
                            placeholder="Nhập tên đăng nhập"
                            autoCapitalize="none"
                            returnKeyType="next"
                            value={username}
                            onChangeText={setUsername}
                            onBlur={() => setTouched((s) => ({ ...s, username: true }))}
                            onSubmitEditing={() => passRef.current?.focus()}
                            style={[
                                styles.input,
                                touched.username && errors.username ? styles.inputError : null,
                            ]}
                        />
                        {touched.username && !!errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                    </View>

                    {/* Password */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Mật khẩu*</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                ref={passRef}
                                placeholder="••••••••"
                                secureTextEntry={!showPass}
                                value={password}
                                onChangeText={setPassword}
                                onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmRef.current?.focus()}
                                style={[
                                    styles.input,
                                    { flex: 1 },
                                    touched.password && errors.password ? styles.inputError : null,
                                ]}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPass((v) => !v)}
                                style={styles.eyeBtn}
                            >
                                <Text style={styles.eyeText}>{showPass ? "Ẩn" : "Hiện"}</Text>
                            </TouchableOpacity>
                        </View>
                        {touched.password && !!errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>

                    {/* Confirm password */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Nhập lại mật khẩu*</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                ref={confirmRef}
                                placeholder="••••••••"
                                secureTextEntry={!showConfirm}
                                value={confirm}
                                onChangeText={setConfirm}
                                onBlur={() => setTouched((s) => ({ ...s, confirm: true }))}
                                style={[
                                    styles.input,
                                    { flex: 1 },
                                    touched.confirm && errors.confirm ? styles.inputError : null,
                                ]}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirm((v) => !v)}
                                style={styles.eyeBtn}
                            >
                                <Text style={styles.eyeText}>
                                    {showConfirm ? "Ẩn" : "Hiện"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {touched.confirm && !!errors.confirm && (
                            <Text style={styles.errorText}>{errors.confirm}</Text>
                        )}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            style={[styles.button, hasErrors ? styles.buttonDisabled : null]}
                            onPress={onRegister}
                            disabled={hasErrors}
                        >
                            <Text style={styles.buttonText}>Đăng ký</Text>
                        </TouchableOpacity>

                        <Link href="/login" asChild>
                            <TouchableOpacity style={[styles.button, styles.secondaryBtn]}>
                                <Text style={styles.buttonText}>Đăng nhập</Text>
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
        marginTop: -36,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
        color: "#111827",
    },
    field: { marginTop: 10 },
    label: { marginBottom: 6, color: "#374151", fontWeight: "600" },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#d0d7de",
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    inputError: { borderColor: RED },
    errorText: { marginTop: 6, color: RED, fontSize: 12.5 },
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
    buttonsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BLUE,
    },
    secondaryBtn: { backgroundColor: "#2563eb" },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: "#fff", fontWeight: "700" },
});

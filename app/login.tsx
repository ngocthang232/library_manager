import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import {useAuth} from "@/context/authContext"; // NEW

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);

    const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    const [credError, setCredError] = useState<string>("");

    // Tài khoản tạm thời
    const TEMP_USER = { user: "admin", pass: "123456" };

    const validateRequired = () => {
        const errs: typeof fieldErrors = {};
        if (!username.trim()) errs.username = "Vui lòng nhập tên đăng nhập.";
        if (!password) errs.password = "Vui lòng nhập mật khẩu.";
        setFieldErrors(errs);
        return errs;
    };

    const onLogin = async () => {
        setCredError("");
        setTouched({ username: true, password: true });

        const errs = validateRequired();
        if (errs.username || errs.password) return;

        if (username.trim() !== TEMP_USER.user || password !== TEMP_USER.pass) {
            setCredError("Tài khoản hoặc mật khẩu không đúng.");
            return;
        }

        await login({ name: "Admin", email: "admin@example.com" });
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

                    {/* Lỗi sai tài khoản/mật khẩu */}
                    {credError ? (
                        <View style={styles.credErrorBox}>
                            <Text style={styles.credErrorText}>{credError}</Text>
                        </View>
                    ) : null}

                    {/* Username */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <View
                            style={[
                                styles.inputRow, // NEW: bọc TextInput + nút xóa
                                touched.username && fieldErrors.username ? styles.inputRowError : null,
                            ]}
                        >
                            <TextInput
                                placeholder="Nhập tên đăng nhập"
                                autoCapitalize="none"
                                returnKeyType="next"
                                value={username}
                                onChangeText={(t) => {
                                    setUsername(t);
                                    if (touched.username) setFieldErrors((s) => ({ ...s, username: "" }));
                                }}
                                onBlur={() => setTouched((s) => ({ ...s, username: true }))}
                                style={styles.inputInner}
                                // iOS có sẵn nút xóa: (không ảnh hưởng Android)
                                clearButtonMode="while-editing"
                            />
                            {username.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setUsername("")}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={styles.iconBtn}
                                >
                                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {touched.username && !!fieldErrors.username && (
                            <Text style={styles.errorText}>{fieldErrors.username}</Text>
                        )}
                    </View>

                    {/* Password */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <View
                            style={[
                                styles.inputRow,
                                touched.password && fieldErrors.password ? styles.inputRowError : null,
                            ]}
                        >
                            <TextInput
                                placeholder="••••••••"
                                value={password}
                                onChangeText={(t) => {
                                    setPassword(t);
                                    if (touched.password) setFieldErrors((s) => ({ ...s, password: "" }));
                                }}
                                secureTextEntry={secure}
                                onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                                style={styles.inputInner}
                            />
                            {/* Nút xóa nhanh password */}
                            {password.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setPassword("")}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={styles.iconBtn}
                                >
                                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            )}
                            {/* Nút hiện/ẩn */}
                            <TouchableOpacity
                                onPress={() => setSecure((v) => !v)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={styles.iconBtn}
                            >
                                <Ionicons
                                    name={secure ? "eye-off" : "eye"}
                                    size={18}
                                    color="#2563eb"
                                />
                            </TouchableOpacity>
                        </View>
                        {touched.password && !!fieldErrors.password && (
                            <Text style={styles.errorText}>{fieldErrors.password}</Text>
                        )}
                    </View>

                    {/* Quên mật khẩu */}
                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => Alert.alert("Thông báo", "Tính năng sẽ bổ sung sau.")}
                    >
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Buttons (nút luôn sáng) */}
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={[styles.button]} onPress={onLogin}>
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <Link href="/register" asChild>
                            <TouchableOpacity style={[styles.button, styles.signupBtn]}>
                                <Text style={styles.buttonText}>Đăng ký</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Gợi ý test */}
                    <View style={{ marginTop: 10, opacity: 0.6 }}>
                        <Text style={{ fontSize: 12 }}>
                            * Tài khoản tạm: <Text style={{ fontWeight: "700" }}>admin</Text> / 123456
                        </Text>
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
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },

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
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: "#eaf1ff", justifyContent: "center", alignItems: "center",
        borderWidth: 2, borderColor: BLUE,
    },
    avatarEmoji: { fontSize: 34 },

    credErrorBox: {
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
        borderRadius: 10,
        padding: 8,
        marginBottom: 6,
    },
    credErrorText: { color: RED, fontWeight: "600" },

    field: { marginTop: 12 },
    label: { marginBottom: 6, color: "#333", fontWeight: "600" },

    /* NEW: ô nhập dạng hàng, để đặt icon bên phải */
    inputRow: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d0d7de",
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingLeft: 12,
        paddingRight: 6,
    },
    inputRowError: { borderColor: RED },
    inputInner: { flex: 1, paddingVertical: 10, paddingRight: 8 },
    iconBtn: {
        paddingHorizontal: 6,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },

    errorText: { marginTop: 6, color: RED, fontSize: 12.5 },

    forgotBtn: { alignSelf: "flex-start", marginTop: 8 },
    forgotText: { color: BLUE },

    buttonsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
    button: {
        flex: 1, height: 44, borderRadius: 12,
        justifyContent: "center", alignItems: "center", backgroundColor: BLUE,
    },
    signupBtn: { backgroundColor: "#2563eb" },
    buttonText: { color: "#fff", fontWeight: "700" },
});

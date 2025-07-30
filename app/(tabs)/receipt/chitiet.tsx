import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

/* ========= Kiểu dữ liệu chung ========= */
type Item = {
    bookId: string;
    title: string;
    qtyBorrowed: number;   // đã mượn
    qtyReturned: number;   // đã trả các lần trước
    price: number;         // giá bìa (dùng khi cần tính đền bù)
};

type BorrowReceipt = {
    id: string;
    readerName: string;
    createdDate: string;   // ngày lập phiếu
    dueDate: string;       // hạn trả (yyyy-mm-dd)
    items: Item[];
};

/* ========= MOCK một phiếu mượn ========= */
const MOCK_RECEIPT: BorrowReceipt = {
    id: "1",
    readerName: "Nguyễn Văn A",
    createdDate: "2021-03-12",
    dueDate: "2021-03-20",
    items: [
        { bookId: "b1", title: "Sách ngữ văn lớp 6 tập 2", qtyBorrowed: 2, qtyReturned: 1, price: 50000 },
        { bookId: "b2", title: "Toán lớp 6 tập 1",         qtyBorrowed: 1, qtyReturned: 0, price: 60000 },
        { bookId: "b3", title: "Khoa học tự nhiên cơ bản",  qtyBorrowed: 1, qtyReturned: 1, price: 80000 },
    ],
};

/* ========= VIEW CHỈ XEM: Phiếu mượn (read-only) ========= */
function BorrowDetailReadonly({ receipt }: { receipt: BorrowReceipt }) {
    const router = useRouter();

    const computed = useMemo(() => {
        const perItem = receipt.items.map((it) => {
            const outstanding = Math.max(0, it.qtyBorrowed - it.qtyReturned);
            return { ...it, outstanding };
        });
        const totalBorrowed = perItem.reduce((s, x) => s + x.qtyBorrowed, 0);
        const totalReturned = perItem.reduce((s, x) => s + x.qtyReturned, 0);
        const totalOutstanding = perItem.reduce((s, x) => s + x.outstanding, 0);
        const status =
            totalOutstanding === 0 ? "Đã trả đủ" : `Còn thiếu ${totalOutstanding}`;
        return { perItem, totalBorrowed, totalReturned, totalOutstanding, status };
    }, [receipt]);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết phiếu mượn</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* Info box */}
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Phiếu số {receipt.id}</Text>
                <Text>
                    Độc giả: <Text style={{ fontWeight: "700" }}>{receipt.readerName}</Text>
                </Text>
                <Text>
                    Ngày lập: {receipt.createdDate.split("-").reverse().join("/")}
                </Text>
                <Text>
                    Hạn trả: {receipt.dueDate.split("-").reverse().join("/")}
                </Text>
                <View style={[styles.badge, computed.totalOutstanding === 0 ? styles.badgeSuccess : styles.badgeWarn]}>
                    <Text style={[styles.badgeText, { color: computed.totalOutstanding === 0 ? "#065f46" : "#92400e" }]}>
                        {computed.status}
                    </Text>
                </View>
            </View>

            {/* Danh sách sách */}
            <FlatList
                data={computed.perItem}
                keyExtractor={(it) => it.bookId}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemSub}>
                                Mượn: {item.qtyBorrowed} • Đã trả: {item.qtyReturned} • Còn:{" "}
                                <Text style={{ fontWeight: "700", color: item.outstanding ? "#ef4444" : "#16a34a" }}>
                                    {item.outstanding}
                                </Text>
                            </Text>
                        </View>
                        {/* nhãn trạng thái từng sách */}
                        <View
                            style={[
                                styles.smallBadge,
                                item.outstanding ? styles.smallBadgeWarn : styles.smallBadgeSuccess,
                            ]}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    fontWeight: "700",
                                    color: item.outstanding ? "#92400e" : "#065f46",
                                }}
                            >
                                {item.outstanding ? "Còn thiếu" : "Đủ"}
                            </Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryTitle}>Tổng kết</Text>
                        <Text>Tổng đã mượn: {computed.totalBorrowed} quyển</Text>
                        <Text>Đã trả: {computed.totalReturned} quyển</Text>
                        <Text>
                            Còn thiếu:{" "}
                            <Text
                                style={{
                                    color: computed.totalOutstanding ? "#ef4444" : "#16a34a",
                                    fontWeight: "700",
                                }}
                            >
                                {computed.totalOutstanding} quyển
                            </Text>
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

/* ========= VIEW XỬ LÝ TRẢ (giữ như trước – rút gọn nhẹ) ========= */
function ReturnDetailInteractive({ receipt }: { receipt: BorrowReceipt }) {
    const router = useRouter();
    type ShortageAction = "supplement" | "compensate";
    const [returnMap, setReturnMap] = useState<Record<string, number>>(() => {
        const m: Record<string, number> = {};
        receipt.items.forEach((it) => {
            const outstanding = it.qtyBorrowed - it.qtyReturned;
            m[it.bookId] = Math.max(0, outstanding);
        });
        return m;
    });
    const [sheetVisible, setSheetVisible] = useState(false);
    const [action, setAction] = useState<ShortageAction>("supplement");
    const [note, setNote] = useState("");

    const computed = useMemo(() => {
        let shortageAmount = 0;
        const perItem = receipt.items.map((it) => {
            const outstanding = Math.max(0, it.qtyBorrowed - it.qtyReturned);
            const retNow = Math.max(0, Math.min(outstanding, returnMap[it.bookId] ?? 0));
            const afterOutstanding = outstanding - retNow;
            shortageAmount += afterOutstanding * it.price;
            return { ...it, outstanding, retNow, afterOutstanding };
        });
        const canConfirmFull = perItem.every((x) => x.afterOutstanding === 0);
        const hasShortage = perItem.some((x) => x.afterOutstanding > 0);
        const totalReturnNow = perItem.reduce((s, x) => s + x.retNow, 0);
        const totalShortage = perItem.reduce((s, x) => s + x.afterOutstanding, 0);
        return { perItem, shortageAmount, canConfirmFull, hasShortage, totalReturnNow, totalShortage };
    }, [receipt.items, returnMap]);

    const inc = (id: string, max: number) =>
        setReturnMap((s) => ({ ...s, [id]: Math.min((s[id] ?? 0) + 1, max) }));
    const dec = (id: string) => setReturnMap((s) => ({ ...s, [id]: Math.max((s[id] ?? 0) - 1, 0) }));

    const onConfirmFull = () => {
        Alert.alert("Thành công", "Đã xác nhận trả đủ.", [{ text: "OK", onPress: () => router.back() }]);
    };
    const onHandleShortage = () => {
        const msg =
            action === "supplement"
                ? "Đã ghi nhận trả thiếu, sẽ bổ sung sau."
                : `Đã ghi nhận đền bù: ${computed.shortageAmount.toLocaleString()}đ.`;
        Alert.alert("Đã lưu", msg, [{ text: "OK", onPress: () => router.back() }]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết phiếu trả</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Phiếu số {receipt.id}</Text>
                <Text>Độc giả: <Text style={{ fontWeight: "600" }}>{receipt.readerName}</Text></Text>
                <Text>Hạn trả: {receipt.dueDate.split("-").reverse().join("/")}</Text>
            </View>

            {/* Danh sách + stepper */}
            <FlatList
                data={computed.perItem}
                keyExtractor={(it) => it.bookId}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => {
                    const max = item.outstanding;
                    return (
                        <View style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSub}>
                                    Mượn: {item.qtyBorrowed} • Đã trả: {item.qtyReturned} •
                                    Còn thiếu: <Text style={{ color: "#ef4444" }}>{item.outstanding}</Text>
                                </Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => dec(item.bookId)} style={styles.stepBtn}>
                                    <Ionicons name="remove" size={16} />
                                </TouchableOpacity>
                                <Text style={styles.stepValue}>{item.retNow}</Text>
                                <TouchableOpacity onPress={() => inc(item.bookId, max)} style={styles.stepBtn}>
                                    <Ionicons name="add" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                ListFooterComponent={
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryTitle}>Tổng kết</Text>
                        <Text>Trả lần này: {computed.totalReturnNow} quyển</Text>
                        <Text>
                            Thiếu sau khi trả:{" "}
                            <Text style={{ color: computed.totalShortage ? "#ef4444" : "#16a34a", fontWeight: "700" }}>
                                {computed.totalShortage} quyển
                            </Text>
                        </Text>
                        {computed.totalShortage > 0 && (
                            <Text>
                                Dự tính đền bù:{" "}
                                <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                                    {computed.shortageAmount.toLocaleString()} đ
                                </Text>
                            </Text>
                        )}
                    </View>
                }
            />

            {/* Actions */}
            <View style={styles.actionBar}>
                <TouchableOpacity
                    style={[styles.actionBtn, !computed.canConfirmFull && styles.btnDisabled]}
                    disabled={!computed.canConfirmFull}
                    onPress={onConfirmFull}
                >
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.actionText}>Trả đủ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtnOutline, !computed.hasShortage && styles.btnDisabledOutline]}
                    disabled={!computed.hasShortage}
                    onPress={() => setSheetVisible(true)}
                >
                    <Ionicons name="alert-circle" size={18} />
                    <Text style={styles.actionTextOutline}>Thiếu / Xử lý</Text>
                </TouchableOpacity>
            </View>

            {/* Sheet thiếu */}
            <Modal transparent animationType="slide" visible={sheetVisible} onRequestClose={() => setSheetVisible(false)}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setSheetVisible(false)} />
                <View style={styles.sheet}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Xử lý trả thiếu</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hình thức</Text>
                        <TouchableOpacity style={styles.radioRow} onPress={() => setAction("supplement")}>
                            <View style={[styles.radioOuter, action === "supplement" && styles.radioOuterActive]}>
                                {action === "supplement" && <View style={styles.radioInner} />}
                            </View>
                            <Text>Bổ sung sau</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.radioRow} onPress={() => setAction("compensate")}>
                            <View style={[styles.radioOuter, action === "compensate" && styles.radioOuterActive]}>
                                {action === "compensate" && <View style={styles.radioInner} />}
                            </View>
                            <Text>Đền bù (ước tính {computed.shortageAmount.toLocaleString()} đ)</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ghi chú</Text>
                        <TextInput
                            placeholder="Ghi chú lý do, hẹn ngày bổ sung…"
                            value={note}
                            onChangeText={setNote}
                            style={styles.noteInput}
                            multiline
                        />
                    </View>

                    <View style={styles.sheetButtons}>
                        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setSheetVisible(false)}>
                            <Text style={[styles.btnText, { color: "#1e90ff" }]}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onHandleShortage}>
                            <Text style={[styles.btnText, { color: "#fff" }]}>Lưu xử lý</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ========= ENTRY: render theo type ========= */
export default function ReceiptDetailScreen() {
    const { type } = useLocalSearchParams<{ type: "borrow" | "return" }>();
    const receipt = MOCK_RECEIPT; // TODO: fetch theo id khi có API

    if (type === "return") {
        return <ReturnDetailInteractive receipt={receipt} />;
    }
    return <BorrowDetailReadonly receipt={receipt} />;
}

/* ================= STYLES ================ */
const BLUE = "#1e90ff";

const styles = StyleSheet.create({
    header: {
        height: 56,
        backgroundColor: BLUE,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: { color: "#fff", fontWeight: "700" },

    infoBox: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
    infoTitle: { fontWeight: "700", marginBottom: 6, color: "#111827" },

    badge: { marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeSuccess: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#d1fae5" },
    badgeWarn: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a" },
    badgeText: { fontWeight: "700" },

    itemRow: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 12,
    },
    itemTitle: { fontWeight: "700", color: "#111827" },
    itemSub: { marginTop: 4, color: "#374151" },

    smallBadge: { alignSelf: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    smallBadgeSuccess: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#d1fae5" },
    smallBadgeWarn: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a" },

    summaryBox: { marginTop: 12, backgroundColor: "#f3f4f6", borderRadius: 12, padding: 12 },
    summaryTitle: { fontWeight: "700", marginBottom: 4 },

    // Các style dùng cho màn "trả"
    stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
    stepBtn: {
        width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb",
        alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
    },
    stepValue: { width: 28, textAlign: "center", fontWeight: "700" },

    actionBar: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        flexDirection: "row", gap: 12, padding: 16, backgroundColor: "#fff",
        borderTopWidth: 1, borderTopColor: "#eee",
    },
    actionBtn: {
        flex: 1, height: 44, borderRadius: 12, backgroundColor: BLUE,
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    },
    actionText: { color: "#fff", fontWeight: "700" },
    btnDisabled: { opacity: 0.5 },

    actionBtnOutline: {
        flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#111827",
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#fff",
    },
    actionTextOutline: { fontWeight: "700", color: "#111827" },
    btnDisabledOutline: { opacity: 0.4 },

    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
    sheet: {
        position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff",
        borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16,
    },
    sheetHandle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: "#e5e7eb", marginBottom: 8 },
    sheetTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
    section: { marginTop: 10 },
    sectionTitle: { fontWeight: "700", marginBottom: 8, color: "#111827" },
    radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
    radioOuter: {
        width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#cbd5e1",
        alignItems: "center", justifyContent: "center",
    },
    radioOuterActive: { borderColor: BLUE },
    radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: BLUE },
    noteInput: {
        minHeight: 70, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 8, textAlignVertical: "top",
    },
    sheetButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
    btn: { flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    btnPrimary: { backgroundColor: BLUE },
    btnOutline: { borderWidth: 1, borderColor: BLUE, backgroundColor: "#fff" },
    btnText: { fontWeight: "700" },
});

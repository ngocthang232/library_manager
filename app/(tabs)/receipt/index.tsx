import React, { useMemo, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    Switch,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

/** --------- MOCK DATA --------- */
type ReceiptBase = { id: string; name: string; booksCount: number; date: string };
const BORROW: ReceiptBase[] = [
    { id: "1", name: "Phiếu số 1", booksCount: 3, date: "2021-03-12" },
    { id: "2", name: "Phiếu số 2", booksCount: 2, date: "2021-03-12" },
    { id: "3", name: "Phiếu số 3", booksCount: 3, date: "2021-03-13" },
    { id: "4", name: "Phiếu số 4", booksCount: 1, date: "2021-03-13" },
];
const RETURN_: ReceiptBase[] = [
    { id: "r1", name: "Phiếu số 1", booksCount: 1, date: "2021-03-12" },
    { id: "r2", name: "Phiếu số 2", booksCount: 2, date: "2021-03-12" },
    { id: "r3", name: "Phiếu số 3", booksCount: 1, date: "2021-03-13" },
];

type TypeKey = "borrow" | "return";

/* ================== Helper format ngày ================== */
const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
const formatDMY = (ymd: string) => ymd.split("-").reverse().join("/");

/* ================== FILTER SHEET CHO PHIẾU MƯỢN ================== */
type SortKey =
    | "date-desc"
    | "date-asc"
    | "name-asc"
    | "name-desc"
    | "count-asc"
    | "count-desc";

type BorrowFilters = {
    q: string; // keyword
    includeAllDates: boolean;
    minBooks?: number | "";
    maxBooks?: number | "";
    sortBy: SortKey;
};

const DEFAULT_BORROW_FILTERS: BorrowFilters = {
    q: "",
    includeAllDates: false,
    minBooks: "",
    maxBooks: "",
    sortBy: "date-desc",
};

function BorrowFilterSheet({
                               visible,
                               filters,
                               onClose,
                               onApply,
                               onReset,
                           }: {
    visible: boolean;
    filters: BorrowFilters;
    onClose: () => void;
    onApply: (f: BorrowFilters) => void;
    onReset: () => void;
}) {
    const [local, setLocal] = useState<BorrowFilters>(filters);
    useEffect(() => setLocal(filters), [filters, visible]);

    const Radio = ({ value, label }: { value: SortKey; label: string }) => {
        const active = local.sortBy === value;
        return (
            <TouchableOpacity
                onPress={() => setLocal((s) => ({ ...s, sortBy: value }))}
                style={styles.radioRow}
            >
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                    {active && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Bộ lọc phiếu mượn</Text>

                {/* Tìm kiếm */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tìm kiếm</Text>
                    <View style={styles.searchRow}>
                        <Ionicons name="search" size={18} />
                        <TextInput
                            placeholder="Nhập tên phiếu..."
                            value={local.q}
                            onChangeText={(t) => setLocal((s) => ({ ...s, q: t }))}
                            style={styles.searchInput}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                {/* Số quyển */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Số quyển</Text>
                    <View style={styles.rangeRow}>
                        <View style={styles.rangeBox}>
                            <Text style={styles.rangeLabel}>Tối thiểu</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={String(local.minBooks ?? "")}
                                onChangeText={(t) =>
                                    setLocal((s) => ({ ...s, minBooks: t === "" ? "" : Number(t) }))
                                }
                                placeholder="VD: 1"
                                style={styles.rangeInput}
                            />
                        </View>
                        <View style={styles.rangeBox}>
                            <Text style={styles.rangeLabel}>Tối đa</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={String(local.maxBooks ?? "")}
                                onChangeText={(t) =>
                                    setLocal((s) => ({ ...s, maxBooks: t === "" ? "" : Number(t) }))
                                }
                                placeholder="VD: 5"
                                style={styles.rangeInput}
                            />
                        </View>
                    </View>
                </View>

                {/* Ngày */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngày</Text>
                    <View style={styles.switchRow}>
                        <Text>Bao gồm tất cả ngày (bỏ lọc theo ngày đang chọn)</Text>
                        <Switch
                            value={local.includeAllDates}
                            onValueChange={(v) => setLocal((s) => ({ ...s, includeAllDates: v }))}
                        />
                    </View>
                </View>

                {/* Sắp xếp */}
                <View>
                    <Text style={styles.sectionTitle}>Sắp xếp</Text>
                    <Radio value="date-desc" label="Ngày (mới → cũ)" />
                    <Radio value="date-asc" label="Ngày (cũ → mới)" />
                    <Radio value="name-asc" label="Tên (A → Z)" />
                    <Radio value="name-desc" label="Tên (Z → A)" />
                    <Radio value="count-asc" label="Số quyển tăng dần" />
                    <Radio value="count-desc" label="Số quyển giảm dần" />
                </View>

                {/* Buttons */}
                <View style={styles.sheetButtons}>
                    <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onReset}>
                        <Text style={[styles.btnText, { color: BLUE }]}>Đặt lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary]}
                        onPress={() => onApply(local)}
                    >
                        <Text style={[styles.btnText, { color: "#fff" }]}>Áp dụng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

/* ================== FILTER SHEET CHO PHIẾU TRẢ ================== */
type ReturnFilters = BorrowFilters; // dùng chung cấu trúc
const DEFAULT_RETURN_FILTERS: ReturnFilters = {
    q: "",
    includeAllDates: false,
    minBooks: "",
    maxBooks: "",
    sortBy: "date-desc",
};

function ReturnFilterSheet({
                               visible,
                               filters,
                               onClose,
                               onApply,
                               onReset,
                           }: {
    visible: boolean;
    filters: ReturnFilters;
    onClose: () => void;
    onApply: (f: ReturnFilters) => void;
    onReset: () => void;
}) {
    // Có thể thêm tiêu chí riêng cho “trả” (VD: trạng thái quá hạn), hiện tái dùng như mượn
    return (
        <BorrowFilterSheet
            visible={visible}
            filters={filters}
            onClose={onClose}
            onApply={onApply}
            onReset={onReset}
        />
    );
}

/* ================== MAIN SCREEN ================== */
export default function ReceiptScreen() {
    const router = useRouter();
    const [type, setType] = useState<TypeKey>("borrow");

    // Date filter bằng DatePicker
    const [date, setDate] = useState<Date>(new Date(2021, 2, 12)); // 2021-03-12
    const [showPicker, setShowPicker] = useState(false);

    // ---- FILTER STATE cho 2 tab ----
    const [borrowFilters, setBorrowFilters] = useState<BorrowFilters>(DEFAULT_BORROW_FILTERS);
    const [borrowFilterVisible, setBorrowFilterVisible] = useState(false);

    const [returnFilters, setReturnFilters] = useState<ReturnFilters>(DEFAULT_RETURN_FILTERS);
    const [returnFilterVisible, setReturnFilterVisible] = useState(false);

    // Data đã lọc theo tab + filter
    const data = useMemo(() => {
        const base = type === "borrow" ? BORROW : RETURN_;
        const ymd = toYMD(date);

        // Chọn bộ lọc theo tab
        const f = type === "borrow" ? borrowFilters : returnFilters;

        let list = [...base];

        // theo ngày (trừ khi chọn includeAllDates)
        if (!f.includeAllDates) list = list.filter((x) => x.date === ymd);

        // tìm kiếm
        if (f.q.trim()) {
            const q = f.q.trim().toLowerCase();
            list = list.filter((x) => x.name.toLowerCase().includes(q));
        }

        // số quyển min/max
        if (f.minBooks !== "" && typeof f.minBooks === "number") {
            list = list.filter((x) => x.booksCount >= f.minBooks!);
        }
        if (f.maxBooks !== "" && typeof f.maxBooks === "number") {
            list = list.filter((x) => x.booksCount <= f.maxBooks!);
        }

        // sort
        const sorted = [...list];
        switch (f.sortBy) {
            case "date-desc":
                sorted.sort((a, b) => b.date.localeCompare(a.date));
                break;
            case "date-asc":
                sorted.sort((a, b) => a.date.localeCompare(b.date));
                break;
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "count-asc":
                sorted.sort((a, b) => a.booksCount - b.booksCount);
                break;
            case "count-desc":
                sorted.sort((a, b) => b.booksCount - a.booksCount);
                break;
        }
        return sorted;
    }, [type, date, borrowFilters, returnFilters]);

    const total = data.length;

    const goDetail = (id: string) =>
        router.push({ pathname: "/receipt/chitiet", params: { id, type } });

    const goAdd = () =>
        router.push({ pathname: "/receipt/add", params: { type: "borrow" } });

    const renderItem = ({ item }: { item: ReceiptBase }) => (
        <TouchableOpacity style={styles.item} onPress={() => goDetail(item.id)}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>
                    Số quyển sách:{" "}
                    <Text style={{ color: BLUE, fontWeight: "600" }}>{item.booksCount}</Text>
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
        </TouchableOpacity>
    );

    // Header button mở filter theo tab
    const openTabFilter = () => {
        if (type === "borrow") setBorrowFilterVisible(true);
        else setReturnFilterVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {type === "borrow" ? "Phiếu mượn" : "Phiếu trả"}
                </Text>
                <TouchableOpacity onPress={openTabFilter}>
                    <Ionicons name="options" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Hàng chọn ngày + tổng số phiếu */}
            <View style={styles.dateRow}>
                <Text style={{ color: "#111827" }}>{total} phiếu</Text>

                {/* Button mở DatePicker */}
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowPicker(true)}
                >
                    <Ionicons name="calendar" size={16} />
                    <Text style={{ marginLeft: 6 }}>{formatDMY(toYMD(date))}</Text>
                </TouchableOpacity>
            </View>

            {/* DatePicker */}
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selected) => {
                        // Android: chọn xong sẽ đóng; iOS: b có thể để showPicker luôn và thêm nút Done nếu muốn
                        if (selected) setDate(selected);
                        if (Platform.OS !== "ios") setShowPicker(false);
                    }}
                    maximumDate={new Date(2100, 11, 31)}
                    minimumDate={new Date(2000, 0, 1)}
                />
            )}

            {/* Segmented control */}
            <View style={styles.segment}>
                <TouchableOpacity
                    style={[styles.segmentBtn, type === "borrow" && styles.segmentActive]}
                    onPress={() => setType("borrow")}
                >
                    <Text
                        style={[styles.segmentText, type === "borrow" && styles.segmentTextActive]}
                    >
                        Phiếu mượn
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.segmentBtn, type === "return" && styles.segmentActive]}
                    onPress={() => setType("return")}
                >
                    <Text
                        style={[styles.segmentText, type === "return" && styles.segmentTextActive]}
                    >
                        Phiếu trả
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách */}
            <FlatList
                data={data}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
                ListEmptyComponent={
                    <View style={{ paddingVertical: 24, alignItems: "center" }}>
                        <Text>Không có phiếu phù hợp.</Text>
                    </View>
                }
            />

            {/* Nút thêm: chỉ hiện ở tab Phiếu mượn */}
            {type === "borrow" && (
                <TouchableOpacity style={styles.fab} onPress={goAdd}>
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.fabText}>Thêm phiếu mượn sách</Text>
                </TouchableOpacity>
            )}

            {/* Filter của từng tab */}
            <BorrowFilterSheet
                visible={borrowFilterVisible}
                filters={borrowFilters}
                onClose={() => setBorrowFilterVisible(false)}
                onApply={(f) => {
                    setBorrowFilters(f);
                    setBorrowFilterVisible(false);
                }}
                onReset={() => setBorrowFilters(DEFAULT_BORROW_FILTERS)}
            />

            <ReturnFilterSheet
                visible={returnFilterVisible}
                filters={returnFilters}
                onClose={() => setReturnFilterVisible(false)}
                onApply={(f) => {
                    setReturnFilters(f);
                    setReturnFilterVisible(false);
                }}
                onReset={() => setReturnFilters(DEFAULT_RETURN_FILTERS)}
            />
        </View>
    );
}

const BLUE = "#1e90ff";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        height: 56,
        backgroundColor: BLUE,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: { color: "#fff", fontWeight: "700" },

    dateRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dateBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        backgroundColor: "#fff",
    },

    segment: {
        marginTop: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        backgroundColor: "#f3f4f6",
        flexDirection: "row",
        padding: 4,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 8,
    },
    segmentActive: { backgroundColor: "#fff", elevation: 1 },
    segmentText: { color: "#6b7280", fontWeight: "600" },
    segmentTextActive: { color: BLUE },

    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 12,
    },
    itemTitle: { fontWeight: "700", color: "#111827" },
    itemSub: { marginTop: 4, color: "#374151" },

    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: BLUE,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        elevation: 2,
    },
    fabText: { color: "#fff", fontWeight: "700" },

    // --- Bottom sheet & controls ---
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    sheetHandle: {
        alignSelf: "center",
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#e5e7eb",
        marginBottom: 8,
    },
    sheetTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
    section: { marginTop: 10 },
    sectionTitle: { fontWeight: "700", marginBottom: 8, color: "#111827" },

    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    searchInput: { flex: 1 },

    rangeRow: { flexDirection: "row", gap: 12 },
    rangeBox: { flex: 1 },
    rangeLabel: { color: "#6b7280", marginBottom: 6 },
    rangeInput: {
        height: 42,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },

    radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#cbd5e1",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    radioOuterActive: { borderColor: BLUE },
    radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: BLUE },
    radioLabel: { color: "#111827" },

    sheetButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
    btn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    btnPrimary: { backgroundColor: BLUE },
    btnOutline: { borderWidth: 1, borderColor: BLUE, backgroundColor: "#fff" },
    btnText: { fontWeight: "700" },
});

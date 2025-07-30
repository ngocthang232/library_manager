import React, { useMemo, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    Modal,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ====================== MOCK DATA ====================== */
type Category = {
    id: string;
    name: string;
    count: number;
    color?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    parentId?: string | null;
};
type Book = {
    id: string;
    title: string;
    available: number;
    cover: string;
    categoryId: string; // map tới CHILDREN.id
};

const PARENTS: Category[] = [
    { id: "p1", name: "Sách giáo khoa", count: 120, color: "#e0f2fe", icon: "book" },
    { id: "p2", name: "Thiếu nhi", count: 54, color: "#fce7f3", icon: "happy" },
    { id: "p3", name: "Văn học", count: 85, color: "#ede9fe", icon: "library" },
    { id: "p4", name: "Khoa học", count: 40, color: "#dcfce7", icon: "flask" },
];

const CHILDREN: Category[] = [
    { id: "c1", parentId: "p1", name: "Lớp 6", count: 18, color: "#eff6ff", icon: "book" },
    { id: "c2", parentId: "p1", name: "Lớp 7", count: 10, color: "#eff6ff", icon: "book" },
    { id: "c3", parentId: "p1", name: "Lớp 8", count: 22, color: "#eff6ff", icon: "book" },
    { id: "c4", parentId: "p1", name: "Lớp 9", count: 25, color: "#eff6ff", icon: "book" },

    { id: "c5", parentId: "p2", name: "Truyện tranh", count: 30, color: "#fff1f2", icon: "color-palette" },
    { id: "c6", parentId: "p2", name: "Tập tô màu", count: 12, color: "#fff1f2", icon: "brush" },

    { id: "c7", parentId: "p3", name: "Tiểu thuyết", count: 40, color: "#f5f3ff", icon: "book-outline" },
    { id: "c8", parentId: "p3", name: "Truyện ngắn", count: 16, color: "#f5f3ff", icon: "book-outline" },

    { id: "c9", parentId: "p4", name: "Tự nhiên", count: 22, color: "#ecfdf5", icon: "leaf" },
    { id: "c10", parentId: "p4", name: "Công nghệ", count: 18, color: "#ecfdf5", icon: "hardware-chip" },
];

const BOOKS: Book[] = [
    {
        id: "b1",
        title: "Sách ngữ văn lớp 6 tập 2",
        available: 10,
        cover: "https://...",
        categoryId: "c1",
    },
    {
        id: "b2",
        title: "Sách Toán lớp 6 tập 1",
        available: 0,
        cover: "https://...",
        categoryId: "c1",
    },
    {
        id: "b3",
        title: "Sách ngữ văn lớp 7 tập 2",
        available: 5,
        cover: "https://...",
        categoryId: "c2",
    },
    {
        id: "b4",
        title: "Truyện tranh Doraemon tập 1",
        available: 3,
        cover: "https://...",
        categoryId: "c5",
    },
    {
        id: "b5",
        title: "Tiểu thuyết Tuổi trẻ đáng giá bao nhiêu",
        available: 7,
        cover: "https://...",
        categoryId: "c7",
    },
    {
        id: "b6",
        title: "Khoa học tự nhiên cơ bản",
        available: 12,
        cover: "https://...",
        categoryId: "c9",
    },
];

/* ============== FILTER SHEETS (Category & Book) ============== */
type SortKey = "name-asc" | "name-desc" | "count-asc" | "count-desc";
type CatFilters = { onlyAvailable: boolean; sortBy: SortKey };
const DEFAULT_CAT_FILTERS: CatFilters = { onlyAvailable: false, sortBy: "name-asc" };

function CategoryFilterSheet({
                                 visible,
                                 filters,
                                 onClose,
                                 onApply,
                                 onReset,
                             }: {
    visible: boolean;
    filters: CatFilters;
    onClose: () => void;
    onApply: (f: CatFilters) => void;
    onReset: () => void;
}) {
    const [local, setLocal] = useState<CatFilters>(filters);
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
                <Text style={styles.sheetTitle}>Bộ lọc thể loại</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hiển thị</Text>
                    <View style={styles.switchRow}>
                        <Text>Chỉ hiện loại có sách</Text>
                        <Switch
                            value={local.onlyAvailable}
                            onValueChange={(v) => setLocal((s) => ({ ...s, onlyAvailable: v }))}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sắp xếp</Text>
                    <Radio value="name-asc" label="Tên (A → Z)" />
                    <Radio value="name-desc" label="Tên (Z → A)" />
                    <Radio value="count-asc" label="Số lượng tăng dần" />
                    <Radio value="count-desc" label="Số lượng giảm dần" />
                </View>

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

type BookSortKey = "title-asc" | "title-desc" | "avail-asc" | "avail-desc";
type BookFilters = { onlyAvailable: boolean; sortBy: BookSortKey };
const DEFAULT_BOOK_FILTERS: BookFilters = { onlyAvailable: false, sortBy: "title-asc" };

function BookFilterSheet({
                             visible,
                             filters,
                             onClose,
                             onApply,
                             onReset,
                         }: {
    visible: boolean;
    filters: BookFilters;
    onClose: () => void;
    onApply: (f: BookFilters) => void;
    onReset: () => void;
}) {
    const [local, setLocal] = useState<BookFilters>(filters);
    useEffect(() => setLocal(filters), [filters, visible]);

    const Radio = ({ value, label }: { value: BookSortKey; label: string }) => {
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
                <Text style={styles.sheetTitle}>Bộ lọc sách</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hiển thị</Text>
                    <View style={styles.switchRow}>
                        <Text>Chỉ hiện sách còn có thể mượn</Text>
                        <Switch
                            value={local.onlyAvailable}
                            onValueChange={(v) => setLocal((s) => ({ ...s, onlyAvailable: v }))}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sắp xếp</Text>
                    <Radio value="title-asc" label="Tên (A → Z)" />
                    <Radio value="title-desc" label="Tên (Z → A)" />
                    <Radio value="avail-asc" label="Số lượng tăng dần" />
                    <Radio value="avail-desc" label="Số lượng giảm dần" />
                </View>

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

/* ====================== MAIN SCREEN ====================== */
export default function BookScreen() {
    const [activeTab, setActiveTab] = useState<"tatca" | "theloai">("tatca");

    // ---- THỂ LOẠI ----
    const [searchCat, setSearchCat] = useState("");
    const [activeParent, setActiveParent] = useState<string | null>(PARENTS[0].id);
    const [catFilters, setCatFilters] = useState<CatFilters>(DEFAULT_CAT_FILTERS);
    const [catFilterVisible, setCatFilterVisible] = useState(false);
    // thể loại đang chọn để lọc tab Tất cả
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // ---- TẤT CẢ ----
    const [searchBook, setSearchBook] = useState("");
    const [bookFilters, setBookFilters] = useState<BookFilters>(DEFAULT_BOOK_FILTERS);
    const [bookFilterVisible, setBookFilterVisible] = useState(false);

    const router = useRouter();
    const goToUpdate = (id: string) =>
        router.push({ pathname: "/books/update", params: { id } });

    /* ---------- Data hiển thị THỂ LOẠI ---------- */
    const visibleChildren = useMemo(() => {
        let list = CHILDREN.filter((c) => c.parentId === activeParent);
        if (searchCat.trim()) {
            const q = searchCat.trim().toLowerCase();
            list = list.filter((c) => c.name.toLowerCase().includes(q));
        }
        if (catFilters.onlyAvailable) list = list.filter((c) => c.count > 0);

        const sorted = [...list];
        switch (catFilters.sortBy) {
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "count-asc":
                sorted.sort((a, b) => a.count - b.count);
                break;
            case "count-desc":
                sorted.sort((a, b) => b.count - a.count);
                break;
        }
        return sorted;
    }, [activeParent, searchCat, catFilters]);

    const onPickCategory = (cat: Category) => {
        setSelectedCategory(cat);
        setActiveTab("tatca");
    };

    /* ---------- Data hiển thị TẤT CẢ ---------- */
    const visibleBooks = useMemo(() => {
        let list = BOOKS;

        // lọc theo thể loại nếu có
        if (selectedCategory) {
            list = list.filter((b) => b.categoryId === selectedCategory.id);
        }

        // tìm kiếm theo tiêu đề
        if (searchBook.trim()) {
            const q = searchBook.trim().toLowerCase();
            list = list.filter((b) => b.title.toLowerCase().includes(q));
        }

        // chỉ hiện sách còn available
        if (bookFilters.onlyAvailable) {
            list = list.filter((b) => b.available > 0);
        }

        // sắp xếp
        const sorted = [...list];
        switch (bookFilters.sortBy) {
            case "title-asc":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "title-desc":
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "avail-asc":
                sorted.sort((a, b) => a.available - b.available);
                break;
            case "avail-desc":
                sorted.sort((a, b) => b.available - a.available);
                break;
        }
        return sorted;
    }, [selectedCategory, searchBook, bookFilters]);

    /* ---------------------- RENDER ---------------------- */
    const renderBookItem = ({ item }: { item: Book }) => (
        <TouchableOpacity style={styles.bookItem} onPress={() => goToUpdate(item.id)}>
            <Image source={{ uri: item.cover }} style={styles.bookImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAvail}>
                    Có thể mượn: <Text style={{ color: BLUE }}>{item.available}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity onPress={() => setActiveTab("tatca")} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === "tatca" && styles.tabTextActive]}>
                        Tất cả
                    </Text>
                    {activeTab === "tatca" && <View style={styles.tabUnderline} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab("theloai")} style={styles.tabBtn}>
                    <Text style={[styles.tabText, activeTab === "theloai" && styles.tabTextActive]}>
                        Thể loại
                    </Text>
                    {activeTab === "theloai" && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
            </View>

            {/* Nội dung tab */}
            <View style={{ marginTop: 20, paddingHorizontal: 16, flex: 1 }}>
                {activeTab === "tatca" ? (
                    <>
                        {/* Tìm kiếm + mở filter */}
                        <View style={styles.searchRow}>
                            <Ionicons name="search" size={18} />
                            <TextInput
                                value={searchBook}
                                onChangeText={setSearchBook}
                                placeholder="Tìm sách..."
                                style={styles.searchInput}
                                returnKeyType="search"
                            />
                            <TouchableOpacity onPress={() => setBookFilterVisible(true)}>
                                <Ionicons name="options" size={18} />
                            </TouchableOpacity>
                        </View>

                        {/* Chip thể loại nếu đang lọc */}
                        {selectedCategory && (
                            <View style={styles.activeFilterRow}>
                                <View style={styles.activeFilterChip}>
                                    <Ionicons name="pricetag" size={14} />
                                    <Text style={{ marginLeft: 6 }}>{selectedCategory.name}</Text>
                                    <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                                        <Ionicons name="close" size={14} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Count */}
                        <View style={styles.filterRow}>
                            <Text style={styles.productCount}>{visibleBooks.length} sản phẩm</Text>
                            <Ionicons name="filter" size={20} color="#000" />
                        </View>

                        {/* Danh sách sách */}
                        <FlatList
                            data={visibleBooks}
                            keyExtractor={(item) => item.id}
                            renderItem={renderBookItem}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            style={styles.bookList}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                            ListEmptyComponent={
                                <View style={{ paddingVertical: 24, alignItems: "center" }}>
                                    <Text>Không có sách phù hợp.</Text>
                                </View>
                            }
                        />

                        {/* Nút thêm sách */}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/books/add")}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Thêm sách</Text>
                        </TouchableOpacity>

                        {/* Sheet lọc sách */}
                        <BookFilterSheet
                            visible={bookFilterVisible}
                            filters={bookFilters}
                            onClose={() => setBookFilterVisible(false)}
                            onApply={(f) => {
                                setBookFilters(f);
                                setBookFilterVisible(false);
                            }}
                            onReset={() => setBookFilters(DEFAULT_BOOK_FILTERS)}
                        />
                    </>
                ) : (
                    // ---------- TAB THỂ LOẠI ----------
                    <View style={{ flex: 1 }}>
                        {/* Tìm kiếm + mở sheet lọc */}
                        <View style={styles.searchRow}>
                            <Ionicons name="search" size={18} />
                            <TextInput
                                value={searchCat}
                                onChangeText={setSearchCat}
                                placeholder="Tìm thể loại..."
                                style={styles.searchInput}
                                returnKeyType="search"
                            />
                            <TouchableOpacity onPress={() => setCatFilterVisible(true)}>
                                <Ionicons name="options" size={18} />
                            </TouchableOpacity>
                        </View>

                        {/* Parent chips */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                        >
                            {PARENTS.map((p) => {
                                const active = p.id === activeParent;
                                return (
                                    <TouchableOpacity
                                        key={p.id}
                                        onPress={() => setActiveParent(p.id)}
                                        style={[styles.parentChip, active && styles.parentChipActive]}
                                    >
                                        <Ionicons name={p.icon || "albums"} size={14} />
                                        <Text
                                            style={[
                                                styles.parentChipText,
                                                active && styles.parentChipTextActive,
                                            ]}
                                        >
                                            {p.name}
                                        </Text>
                                        <View style={styles.parentChipBadge}>
                                            <Text style={styles.parentChipBadgeText}>{p.count}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Lưới thể loại con */}
                        <FlatList
                            data={visibleChildren}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 12 }}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.catCard} onPress={() => onPickCategory(item)}>
                                    <View
                                        style={[
                                            styles.catIconWrap,
                                            { backgroundColor: item.color || "#eef2ff" },
                                        ]}
                                    >
                                        <Ionicons name={item.icon || "book"} size={20} />
                                    </View>
                                    <Text style={styles.catName} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    <View style={styles.catCountBadge}>
                                        <Text style={styles.catCountText}>{item.count}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Sheet lọc thể loại */}
                        <CategoryFilterSheet
                            visible={catFilterVisible}
                            filters={catFilters}
                            onClose={() => setCatFilterVisible(false)}
                            onApply={(f) => {
                                setCatFilters(f);
                                setCatFilterVisible(false);
                            }}
                            onReset={() => setCatFilters(DEFAULT_CAT_FILTERS)}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

/* ====================== STYLES ====================== */
const BLUE = "#1e90ff";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    tabRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    tabBtn: { flex: 1, alignItems: "center", paddingBottom: 8 },
    tabText: { color: "#666", fontSize: 15 },
    tabTextActive: { color: BLUE, fontWeight: "600" },
    tabUnderline: {
        marginTop: 6,
        height: 2,
        width: 40,
        backgroundColor: BLUE,
        borderRadius: 2,
    },

    // Search box dùng chung
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

    // Tất cả
    activeFilterRow: { marginTop: 8, marginBottom: 8 },
    activeFilterChip: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#e8f0fe",
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        marginTop: 6,
    },
    productCount: { fontSize: 14, color: "#333" },
    bookList: { flex: 1 },
    bookItem: {
        flexDirection: "row",
        backgroundColor: "#f7f7f9",
        padding: 10,
        borderRadius: 10,
    },
    bookImage: { width: 50, height: 70, marginRight: 10, borderRadius: 4 },
    bookTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
    bookAvail: { marginTop: 4, color: "#444" },

    addButton: {
        position: "absolute",
        bottom: 16,
        right: 16,
        flexDirection: "row",
        backgroundColor: BLUE,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    addButtonText: { color: "#fff", fontWeight: "600" },

    // Thể loại
    parentChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginRight: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
    },
    parentChipActive: {
        backgroundColor: "#e0f2fe",
        borderWidth: 1,
        borderColor: BLUE,
    },
    parentChipText: { fontSize: 13, color: "#111827" },
    parentChipTextActive: { fontWeight: "700", color: "#0c4a6e" },
    parentChipBadge: {
        marginLeft: 4,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#dbeafe",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    parentChipBadgeText: { fontSize: 11 },

    catCard: {
        flex: 1,
        minHeight: 110,
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 14,
        justifyContent: "space-between",
    },
    catIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    catName: { marginTop: 8, fontWeight: "600", color: "#111827" },
    catCountBadge: {
        alignSelf: "flex-start",
        marginTop: 8,
        backgroundColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    catCountText: { fontSize: 12, color: "#374151" },

    // Common bottom sheet
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

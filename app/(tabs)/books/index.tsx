import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- Demo data sách (giữ của bạn) ---
const index = [
    { id: "1", title: "Sách ngữ văn lớp 6 tập 2", available: 10, cover: "https://..." },
    { id: "2", title: "Sách ngữ văn lớp 6 tập 2", available: 10, cover: "https://..." },
    { id: "3", title: "Sách ngữ văn lớp 6 tập 2", available: 10, cover: "https://..." },
];

// --- Demo data thể loại (cha -> con) ---
type Category = {
    id: string;
    name: string;
    count: number;
    color?: string; // nền nhạt cho icon
    icon?: keyof typeof Ionicons.glyphMap;
    parentId?: string | null;
};
const PARENTS: Category[] = [
    { id: "p1", name: "Sách giáo khoa", count: 120, color: "#e0f2fe", icon: "book" },
    { id: "p2", name: "Thiếu nhi", count: 54, color: "#fce7f3", icon: "happy" },
    { id: "p3", name: "Văn học", count: 85, color: "#ede9fe", icon: "library" },
    { id: "p4", name: "Khoa học", count: 40, color: "#dcfce7", icon: "flask" },
];

const CHILDREN: Category[] = [
    { id: "c1", parentId: "p1", name: "Lớp 6", count: 18, color: "#eff6ff", icon: "book" },
    { id: "c2", parentId: "p1", name: "Lớp 7", count: 20, color: "#eff6ff", icon: "book" },
    { id: "c3", parentId: "p1", name: "Lớp 8", count: 22, color: "#eff6ff", icon: "book" },
    { id: "c4", parentId: "p1", name: "Lớp 9", count: 25, color: "#eff6ff", icon: "book" },

    { id: "c5", parentId: "p2", name: "Truyện tranh", count: 30, color: "#fff1f2", icon: "color-palette" },
    { id: "c6", parentId: "p2", name: "Tập tô màu", count: 12, color: "#fff1f2", icon: "brush" },

    { id: "c7", parentId: "p3", name: "Tiểu thuyết", count: 40, color: "#f5f3ff", icon: "book-outline" },
    { id: "c8", parentId: "p3", name: "Truyện ngắn", count: 16, color: "#f5f3ff", icon: "book-outline" },

    { id: "c9", parentId: "p4", name: "Tự nhiên", count: 22, color: "#ecfdf5", icon: "leaf" },
    { id: "c10", parentId: "p4", name: "Công nghệ", count: 18, color: "#ecfdf5", icon: "hardware-chip" },
];

export default function BookScreen() {
    const [activeTab, setActiveTab] = useState<"tatca" | "theloai">("tatca");
    const [searchCat, setSearchCat] = useState("");
    const [activeParent, setActiveParent] = useState<string | null>(PARENTS[0].id);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // để chuyển qua tab Tất cả kèm lọc
    const router = useRouter();

    const goToUpdate = (id: string) =>
        router.push({ pathname: "/books/update", params: { id } });

    // ----- render item sách (tab Tất cả) -----
    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.bookItem} onPress={() => goToUpdate(item.id)}>
            <Image source={{ uri: item.cover }} style={styles.bookImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAvail}>
                    Có thể mượn: <Text style={{ color: "#1e90ff" }}>{item.available}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    // ----- dữ liệu thể loại con theo parent đang chọn + từ khóa -----
    const visibleChildren = useMemo(() => {
        const list = CHILDREN.filter((c) => c.parentId === activeParent);
        if (!searchCat.trim()) return list;
        const q = searchCat.trim().toLowerCase();
        return list.filter((c) => c.name.toLowerCase().includes(q));
    }, [activeParent, searchCat]);

    // ----- chọn 1 thể loại con -----
    const onPickCategory = (cat: Category) => {
        setSelectedCategory(cat);
        // Ý tưởng A: chuyển sang tab Tất cả và áp lọc (ở đây demo: chỉ đổi tab)
        setActiveTab("tatca");
        // TODO: khi có dữ liệu thật: filter list theo cat.id
        // Hoặc Ý tưởng B: router.push({ pathname: '/books', params: { categoryId: cat.id }})
    };

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
                        {/* Nếu có category đang chọn, hiển thị chip lọc (demo) */}
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

                        <View style={styles.filterRow}>
                            <Text style={styles.productCount}>{index.length} sản phẩm</Text>
                            <Ionicons name="filter" size={20} color="#000" />
                        </View>

                        <FlatList
                            data={index /* TODO: lọc theo selectedCategory */}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            style={styles.bookList}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/books/add")}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Thêm sách</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // ---------- TAB THỂ LOẠI ----------
                    <View style={{ flex: 1 }}>
                        {/* Tìm kiếm thể loại */}
                        <View style={styles.searchRow}>
                            <Ionicons name="search" size={18} />
                            <TextInput
                                value={searchCat}
                                onChangeText={setSearchCat}
                                placeholder="Tìm thể loại..."
                                style={styles.searchInput}
                                returnKeyType="search"
                            />
                            <TouchableOpacity>
                                <Ionicons name="options" size={18} />
                            </TouchableOpacity>
                        </View>

                        {/* Chip parent categories */}
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
                                <TouchableOpacity
                                    style={styles.catCard}
                                    onPress={() => onPickCategory(item)}
                                >
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
                    </View>
                )}
            </View>
        </View>
    );
}

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

    // --- Tất cả ---
    activeFilterRow: { marginBottom: 8 },
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

    // --- Thể loại ---
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
});

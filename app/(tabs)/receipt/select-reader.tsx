import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const MOCK_READERS = [
    { id: 'u1', name: 'Nguyễn Văn A' },
    { id: 'u2', name: 'Trần Thị B' },
    { id: 'u3', name: 'Phạm Văn C' },
];

export default function SelectReaderScreen() {
    const [q, setQ] = useState('');
    const data = useMemo(
        () => MOCK_READERS.filter(r => r.name.toLowerCase().includes(q.toLowerCase())),
        [q]
    );

    const pick = (reader: { id: string; name: string }) => {
        // Trả kết quả về /receipt/add qua query params
        router.replace({ pathname: '/receipt/add', params: { borrowerId: reader.id, borrowerName: reader.name } });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <TextInput
                placeholder="Tìm độc giả..."
                value={q}
                onChangeText={setQ}
                style={styles.input}
            />
            <FlatList
                data={data}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.row} onPress={() => pick(item)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12,
    },
    row: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 10 },
});

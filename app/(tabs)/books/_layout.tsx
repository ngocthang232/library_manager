import { Stack } from 'expo-router';

export default function BooksStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Sách' }} />
            <Stack.Screen name="add" options={{ title: 'Thêm sách' }} />
            <Stack.Screen name="update" options={{ title: 'Cập nhật sách' }} />
        </Stack>
    );
}
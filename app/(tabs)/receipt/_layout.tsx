import { Stack } from 'expo-router';

export default function PhieuStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#3b82f6' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Phiếu mượn' }} />
            <Stack.Screen name="chitiet" options={{ title: 'Chi tiết phiếu mượn' }} />
            <Stack.Screen name="add" options={{ title: 'Thêm phiếu mượn' }} />
        </Stack>
    );
}

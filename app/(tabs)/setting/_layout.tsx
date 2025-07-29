import { Stack } from 'expo-router';

export default function SettingStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#3b82f6' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Cài đặt' }} />
            <Stack.Screen name="profile" options={{ title: 'Thông tin thủ thư' }} />
        </Stack>
    );
}

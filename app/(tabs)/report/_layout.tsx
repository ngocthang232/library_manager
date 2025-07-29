import { Stack } from 'expo-router';

export default function ReportStack() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#3b82f6' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
            }}
        >
            <Stack.Screen name="index"  options={{ title: 'Báo cáo' }} />
            <Stack.Screen name="detail" options={{ title: 'Chi tiết báo cáo' }} />
        </Stack>
    );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="books"
                options={{
                    title: 'Sách',
                    tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="receipt"
                options={{
                    title: 'Phiếu',
                    tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: 'Cài đặt',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    href: null,                 // ẩn khỏi “linking list”
                }}
            />
        </Tabs>
    );
}

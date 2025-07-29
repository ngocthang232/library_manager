import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableWithoutFeedback,
} from 'react-native';

type Props = {
    visible: boolean;
    message?: string;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmDanger?: boolean; // tô màu đỏ cho nút Xóa
};

export default function ConfirmDialog({
                                          visible,
                                          message = 'Bạn có chắc chắn muốn xóa không?',
                                          cancelText = 'Thoát',
                                          confirmText = 'Xóa',
                                          onCancel,
                                          onConfirm,
                                          confirmDanger = true,
                                      }: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            {/* Nền mờ */}
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            {/* Hộp thoại */}
            <View style={styles.centerWrap} pointerEvents="box-none">
                <View style={styles.card}>
                    <Text style={styles.message}>{message}</Text>

                    {/* gạch ngang */}
                    <View style={styles.hDivider} />

                    {/* 2 nút dưới */}
                    <View style={styles.row}>
                        <Pressable
                            style={styles.btn}
                            android_ripple={{ color: '#e5e7eb' }}
                            onPress={onCancel}
                        >
                            <Text style={[styles.btnText, { color: '#2563eb' }]}>{cancelText}</Text>
                        </Pressable>

                        {/* gạch dọc */}
                        <View style={styles.vDivider} />

                        <Pressable
                            style={styles.btn}
                            android_ripple={{ color: '#e5e7eb' }}
                            onPress={onConfirm}
                        >
                            <Text
                                style={[
                                    styles.btnText,
                                    { color: confirmDanger ? '#ef4444' : '#2563eb' },
                                ]}
                            >
                                {confirmText}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    centerWrap: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    message: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        textAlign: 'center',
        fontSize: 16,
        color: '#111827',
    },
    hDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 44,
    },
    vDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
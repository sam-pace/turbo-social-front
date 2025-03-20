import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { useRef, useMemo, useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {  YStack, XStack, Button } from "tamagui";
import { LogOut } from "@tamagui/lucide-icons";
import ToggleThemeButton from "components/ToggleThemeButton";

export const UserPanel = ({ open, setModalOpen }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["24%"], []);
    const { backgroundColor } = useTheme();
    const { logoutUser } = useAuth()

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    if (!open) return null;

    return (
        <BottomSheet
            enablePanDownToClose
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            handleIndicatorStyle={{ backgroundColor: "gray" }}
            backgroundStyle={{ backgroundColor }}
            style={{ backgroundColor, shadowColor: "black", shadowOpacity: 0.1, shadowRadius: 2, borderRadius: 20  }}
            onChange={(index) => setModalOpen(index !== -1)}
        >
            <BottomSheetView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 0}
                >
                    <YStack padding={16} gap={40} width="100%" justifyContent="space-between" alignItems="center">
                        <ToggleThemeButton/>
                        <Button width={140} iconAfter={LogOut} fontSize={16} onPress={logoutUser} backgroundColor={"$red10"} color={"whitesmoke"}>
                            Sair
                        </Button>

                    </YStack>
                </KeyboardAvoidingView>
            </BottomSheetView>
        </BottomSheet>
    );
};

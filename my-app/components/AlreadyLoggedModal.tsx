import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, YStack, Button } from "tamagui";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "context/ThemeContext";

const AlreadyLoggedModal = ({ open, setModalOpen }) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const { backgroundColor } = useTheme();

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [open]);

  const handleClosePress = useCallback(() => {
    setModalOpen(false);
    bottomSheetRef.current?.close();
  }, [setModalOpen]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor }}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      style={{ shadowColor: "black", shadowOpacity: 0.1, shadowRadius: 10 }}
    >
      <BottomSheetView>
        <YStack padding={20} justifyContent="center" alignItems="center">
          <YStack gap={20} width={200}>
            <Text fontSize={18} fontWeight="bold">
              Sua sessão está ativa!
            </Text>
            <Text>
              Deseja ir para página inicial ou fazer login com outra conta?
            </Text>

            <Button
              bg="$green10"
              onPress={() => {
                router.push("/(tabs)/home");
                handleClosePress();
              }}
            >
              Ir para Página inicial
            </Button>
            <Button
              bg="$red10"
              onPress={() => {
                handleClosePress();
              }}
            >
              Entrar com outra conta
            </Button>
          </YStack>
        </YStack>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AlreadyLoggedModal;

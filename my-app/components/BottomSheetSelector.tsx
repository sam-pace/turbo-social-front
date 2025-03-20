import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { YStack, Button, Text } from "tamagui";
import { useTheme } from "context/ThemeContext";

interface BottomSheetSelectorProps {
  open: boolean;
  setModalOpen: (open: boolean) => void;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
}

const BottomSheetSelector = ({ open, setModalOpen, title, options, onSelect }: BottomSheetSelectorProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const { backgroundColor } = useTheme();

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
      backgroundStyle={{ backgroundColor }}
      onChange={(index) => setModalOpen(index !== -1)}
    >
      <BottomSheetView>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <YStack p={16} gap={20} width="100%" items="center">
            <Text fontSize={18} fontWeight="bold">{title}</Text>
            {options.map((option) => (
              <Button
                key={option}
                width="90%"
                onPress={() => {
                  onSelect(option);
                  setModalOpen(false);
                }}
              >
                {option}
              </Button>
            ))}
          </YStack>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetSelector;

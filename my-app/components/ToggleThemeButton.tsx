import { useTheme } from "context/ThemeContext";
import { Button, XStack, Text } from "tamagui";
import { Sun, Moon } from "@tamagui/lucide-icons";
import { mainColor } from "theme";

export default function ToggleThemeButton() {
    const { toggleTheme, theme } = useTheme()
    return (
        <Button borderColor={mainColor} chromeless fontSize={16} onPress={toggleTheme} iconAfter={theme == "dark" ? Sun : Moon}>Alterar tema</Button>
    )
}
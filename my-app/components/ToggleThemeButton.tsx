import { useTheme } from "context/ThemeContext";
import { Button } from "tamagui";
import { Sun, Moon } from "@tamagui/lucide-icons";

export default function ToggleThemeButton() {
    const { toggleTheme, theme } = useTheme()
    return (
        <Button width={30} onPress={toggleTheme} icon={theme == "dark" ? Sun : Moon}></Button>
    )
}
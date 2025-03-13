import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createFont } from "tamagui";


const oxanium = createFont({
  family: "Oxanium",
  size: { 4: 12, 6: 18, 8: 24, 10: 32 },
  weight: { 4: "400", 7: "700" },
});

const kanit = createFont({
  family: "Kanit",
  size: { 4: 12, 6: 16, 8: 20, 10: 28 },
  weight: { 4: "400", 7: "700" },
});

export const config = createTamagui({
  ...defaultConfig,
  fonts: {
    heading: oxanium,
    body: kanit,
  },
});

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

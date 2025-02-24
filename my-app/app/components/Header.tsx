import { Image, View } from "tamagui";
import { themes } from "theme";

interface HeaderProps {
  logoType: "fuelhub" | "turbomarket";
}

const logos = {
  fuelhub: {
    image: require("assets/images/fuelhub.png"),
    height: 20,
    width: 120,
  },
  turbomarket: {
    image: require("assets/images/turbo-market.png"),
    height: 26,
    width: 110,
  },
};

export default function CustomHeader({ logoType }: HeaderProps) {
  const logo = logos[logoType];

  return (
    <View width={"100%"} bg={themes.dark.gray1} pl={8} height={"20%"} justify={"center"}>
      <View marginTop={80} marginBottom={10}>
        <Image
          source={{
            width: logo.width,
            height: logo.height,
            uri: logo.image,
          }}
        />
      </View>
    </View>
  );
}

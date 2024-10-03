import React from "react";
import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";

type ImageButtonProps = {
  source: ImageSourcePropType;
  width?: number;
  height?: number;
  style?: Object;
  resizeMode?: "center" | "contain" | "cover" | "repeat" | "stretch";
  onPress?: () => void;
};

export function ImageButton({
  source,
  width,
  height,
  style,
  resizeMode,
  onPress,
}: ImageButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={source}
        style={[{ width: width, height: height }, style]}
        resizeMode={resizeMode}
      />
    </TouchableOpacity>
  );
}

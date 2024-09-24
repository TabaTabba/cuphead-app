import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  style?: Object;
  onPress: () => void;
}

export function IconButton({
  name,
  size,
  color,
  style,
  onPress,
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

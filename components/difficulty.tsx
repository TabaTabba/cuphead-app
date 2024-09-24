import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DifficultyProps {
  difficulty: number;
}

export default function Difficulty({ difficulty }: DifficultyProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(difficulty);
    const halfStar = difficulty % 1 !== 0;
    const emptyStars = 5 - Math.ceil(difficulty);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={56} color="white" />
      );
    }

    if (halfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={56} color="white" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={56}
          color="white"
        />
      );
    }

    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
}

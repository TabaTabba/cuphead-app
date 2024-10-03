import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DifficultyProps = {
  difficulty: number;
};

export default function Difficulty({ difficulty }: DifficultyProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(difficulty);
    const halfStar = difficulty % 1 !== 0;
    const emptyStars = 5 - Math.ceil(difficulty);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={64} color="white" />
      );
    }

    if (halfStar) {
      stars.push(
        <View key="half-star">
          <Ionicons
            key="full"
            name="star"
            size={64}
            color="rgba(255, 255, 255, 0.2)"
            style={{ position: "absolute" }}
          />
          <Ionicons key="half" name="star-half" size={64} color="white" />
        </View>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star"
          size={64}
          color="rgba(255, 255, 255, 0.2)"
        />
      );
    }

    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
}

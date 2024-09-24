import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarRatingProps {
  onRatingPress?: (rating: number) => void;
}

export default function StarRating({ onRatingPress }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const starWidthRef = useRef<number>(0);

  const handleStarPress = (index: number, event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const isHalf = locationX < starWidthRef.current / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;

    if (newRating === rating) {
      setRating(0);
      if (onRatingPress) {
        onRatingPress(0);
      }
    } else {
      setRating(newRating);
      if (onRatingPress) {
        onRatingPress(newRating);
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPressIn={(event) => handleStarPress(index, event)}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            starWidthRef.current = width;
          }}
        >
          <Ionicons
            name={
              rating >= index + 1
                ? "star"
                : rating >= index + 0.5
                ? "star-half"
                : "star-outline"
            }
            size={48}
            color="white"
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 4,
  },
});

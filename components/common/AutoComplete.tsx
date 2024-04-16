import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Pressable,
  ScrollView,
  VStack,
  CloseIcon,
} from "@gluestack-ui/themed";
import { colors } from "../../lib/theme";

const suggestionsData = [
  "very light",
  "Rabit",
  "Monkey",
  "Bubble",
  "BubbleDown",
  "Banana",
  "BubbleUp",
  "Food",
  "FoodDown",
  "FoodUp",
  "Clothes",
  "Armor",
  "ArmorDown",
];

interface AutoCompleteProps {
  zIndex: number;
  placeholder: string;
  onFocus: (focus: boolean) => void;
}

const AutoComplete = ({ placeholder, zIndex, onFocus }: AutoCompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>(suggestionsData);
  const [suggestionValue, setSuggestionValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    canShowClear();
    canShowSuggestion();
  }, [suggestionValue]);

  const canShowSuggestion = () => {
    if (suggestionValue.length > 1) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  };

  const canShowClear = () => {
    if (suggestionValue.length > 0) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  };

  const updateSuggestions = (text: string, showSuggestionPopUp: boolean) => {
    const newSuggestions = suggestionsData.filter((suggestion) =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(newSuggestions);

    setSuggestionValue(text);
    setShowSuggestion(showSuggestionPopUp);
  };

  const handleChange = (text: string) => {
    updateSuggestions(text, true);
  };

  const handlePress = (text: string) => {
    updateSuggestions(text, false);
  };

  const handleBlur = () => {
    setShowSuggestion(false);
    setShowClear(false);
    onFocus(false);
  };

  const handleFocus = () => {
    canShowSuggestion();
    canShowClear();
    onFocus(true);
  };

  const handleReset = () => {
    updateSuggestions("", true);
  };

  return (
    <Box zIndex={zIndex} p={0}>
      <VStack position="relative" w="$full">
        <Input size="sm" w="$full" style={styles.inputStyle}>
          <InputField
            style={styles.inputFieldStyle}
            value={suggestionValue}
            onChangeText={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            blurOnSubmit
            placeholder={placeholder}
            keyboardAppearance="dark"
          />
          <InputSlot pr="$3">
            <View style={styles.iconContainer}>
              {showClear && (
                <Pressable onPress={handleReset} mr={5}>
                  <InputIcon size="md" as={CloseIcon} color="$trueGray400" />
                </Pressable>
              )}
            </View>
          </InputSlot>
        </Input>

        {showSuggestion && suggestions.length > 0 && (
          <Box style={styles.suggestionContainer} zIndex={2}>
            <ScrollView
              maxHeight={205}
              w="100%"
              keyboardShouldPersistTaps="always"
            >
              {suggestions.map((val, idx) => (
                <Pressable key={idx} onPress={() => handlePress(val)}>
                  <Box style={styles.suggestionItemContainer}>
                    <Text style={styles.suggestionItemText}>{val}</Text>
                  </Box>
                </Pressable>
              ))}
            </ScrollView>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  inputStyle: { height: 44, zIndex: 1, borderWidth: 0, padding: 0 },
  inputFieldStyle: { fontSize: 17, paddingLeft: 0 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  suggestionContainer: {
    position: "absolute",
    flex: 1,
    top: 41,
    left: -20,
    right: 0,
    borderRadius: 3,
    borderStyle: "solid",
    borderWidth: 0.3,
    borderColor: colors.gray,
    backgroundColor: colors.dark,
  },
  suggestionItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  suggestionItemText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 19,
  },
});

export default AutoComplete;

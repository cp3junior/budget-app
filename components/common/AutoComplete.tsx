import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Pressable,
  ScrollView,
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  CloseIcon,
} from "@gluestack-ui/themed";
import { colors } from "../../lib/theme";
import { FormControlHelper } from "@gluestack-ui/themed";
import { FormControlHelperText } from "@gluestack-ui/themed";

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

const AutoComplete = () => {
  const [suggestions, setSuggestions] = useState<string[]>(suggestionsData);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionValue, setSuggestionValue] = useState("");

  const updateSuggestions = (text: string, showSuggestionPopUp: boolean) => {
    const newSuggestions = suggestionsData.filter((suggestion) =>
      suggestion.includes(text)
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
  };

  const handleFocus = () => {
    setShowSuggestion(true);
  };

  const handleReset = () => {
    updateSuggestions("", true);
  };

  return (
    <Box zIndex={10}>
      <FormControl isRequired size="sm">
        <FormControlLabel mb="$2">
          <FormControlLabelText>Label</FormControlLabelText>
        </FormControlLabel>
        <VStack position="relative" w="$full">
          <Input variant="outline" size="sm" w="$full" zIndex={1}>
            <InputField
              value={suggestionValue}
              onChangeText={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              blurOnSubmit
            />
            <InputSlot pr="$3">
              <View style={styles.iconContainer}>
                {suggestionValue.length > 0 && (
                  <Pressable onPress={handleReset} mr={5}>
                    <InputIcon size="sm" as={CloseIcon} color="$trueGray400" />
                  </Pressable>
                )}
                <InputIcon
                  size="lg"
                  as={showSuggestion ? ChevronUpIcon : ChevronDownIcon}
                  color="$darkBlue500"
                />
              </View>
            </InputSlot>
          </Input>
          {suggestions.length === 0 && suggestionValue.length > 1 && (
            <FormControlHelper>
              <FormControlHelperText>
                This data will be saved as a new entry
              </FormControlHelperText>
            </FormControlHelper>
          )}
          {showSuggestion && suggestions.length > 0 && (
            <Box style={styles.suggestionContainer}>
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
      </FormControl>
    </Box>
  );
};

const styles = StyleSheet.create({
  iconContainer: { flexDirection: "row", alignItems: "center" },
  suggestionContainer: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    top: 38,
    borderRadius: 3,
    borderStyle: "solid",
    borderWidth: 0.4,
    borderColor: colors.gray,
    backgroundColor: colors.dark,
  },
  suggestionItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  suggestionItemText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
  },
});

export default AutoComplete;

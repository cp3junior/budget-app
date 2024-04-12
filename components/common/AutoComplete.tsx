import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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

interface AutoCompleteProps {
  zIndex: number;
  label: string;
}

const AutoComplete = ({ label, zIndex }: AutoCompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>(suggestionsData);
  const [suggestionValue, setSuggestionValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    canShowClear();
  }, [suggestionValue]);

  const canShowClear = () => {
    if (suggestionValue.length > 0) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  };

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
    setIsFocused(false);
    setShowClear(false);
  };

  const handleFocus = () => {
    setShowSuggestion(true);
    setIsFocused(true);
    canShowClear();
  };

  const handleReset = () => {
    updateSuggestions("", true);
  };

  return (
    <Box zIndex={zIndex}>
      <FormControl
        isRequired
        size="md"
        style={{
          ...styles.formControl,
          // ...Object.assign({}, styleFormContainer),
        }}
      >
        <FormControlLabel mb="$2">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <VStack position="relative" w="$full">
          <Input
            variant="outline"
            size="md"
            w="$full"
            zIndex={1}
            $focus-borderColor={colors.purple}
          >
            <InputField
              value={suggestionValue}
              onChangeText={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              blurOnSubmit
            />
            <InputSlot pr="$3">
              <View style={styles.iconContainer}>
                {showClear && (
                  <Pressable onPress={handleReset} mr={5}>
                    <InputIcon size="sm" as={CloseIcon} color="$trueGray400" />
                  </Pressable>
                )}
                <InputIcon
                  size="lg"
                  as={isFocused ? ChevronUpIcon : ChevronDownIcon}
                  color={colors.purple}
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
      </FormControl>
    </Box>
  );
};

const styles = StyleSheet.create({
  formControl: { marginBottom: 20 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  suggestionContainer: {
    position: "absolute",
    width: "100%",
    top: 41,
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

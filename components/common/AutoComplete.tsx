import { IInputProps } from "@gluestack-ui/input/lib/types";
import {
  Box,
  Input,
  InputField,
  InputSlot,
  Pressable,
  ScrollView,
  VStack,
} from "@gluestack-ui/themed";
import React, { forwardRef, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TextInputProps, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";
import Text from "./Text";

interface AutoCompleteProps {
  zIndex: number;
  suggestions: SuggestionAutocomplete[];
  InputProps: TextInputProps & IInputProps;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

const { width } = Dimensions.get("window");

const AutoComplete = forwardRef<any, AutoCompleteProps>(
  ({ zIndex, suggestions = [], InputProps, isInvalid, isReadOnly }, ref) => {
    const [filteredSuggestions, setFilteredSuggestions] =
      useState<SuggestionAutocomplete[]>(suggestions);
    const [suggestionValue, setSuggestionValue] = useState("");
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [showClear, setShowClear] = useState(false);

    useEffect(() => {
      canShowClear();
      canShowSuggestion();
    }, [suggestionValue]);

    const canShowSuggestion = () => {
      if (suggestionValue.length <= 1) {
        setShowSuggestion(false);
      } else {
        setShowSuggestion(
          filteredSuggestions.length > 1 ||
            filteredSuggestions[0]?.name !== suggestionValue
        );
      }
    };

    const canShowClear = () => {
      if (suggestionValue.length > 0) {
        setShowClear(true);
      } else {
        setShowClear(false);
      }
    };

    const updateSuggestions = (text: string) => {
      let newSuggestions = suggestions.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(text.toLowerCase())
      );
      newSuggestions = newSuggestions.filter(
        (suggestion) => suggestion.name.toLowerCase() !== text.toLowerCase()
      );

      setFilteredSuggestions(newSuggestions);
      setSuggestionValue(text);
      if (InputProps.onChangeText) InputProps.onChangeText(text);
    };

    const handleChange = (text: string) => {
      updateSuggestions(text);
    };

    const handlePress = (text: string) => {
      updateSuggestions(text);
    };

    const handleBlur = (e: any) => {
      setShowSuggestion(false);
      setShowClear(false);
      if (InputProps.onBlur) {
        InputProps.onBlur(e);
      }
    };

    const handleFocus = () => {
      canShowSuggestion();
      canShowClear();
    };

    const handleReset = () => {
      updateSuggestions("");
    };

    return (
      <Box zIndex={zIndex} p={0}>
        <VStack position="relative" w="$full">
          <Input size="sm" w="$full" style={styles.inputStyle}>
            <InputField
              ref={ref}
              blurOnSubmit
              keyboardAppearance="dark"
              autoCapitalize="none"
              {...InputProps}
              placeholderTextColor={
                isInvalid ? colors.redVivid : colors.grayLight
              }
              value={suggestionValue}
              onChangeText={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              style={{
                ...styles.inputFieldStyle,
                ...(InputProps?.style as Object),
                ...(isInvalid ? { color: colors.redVivid } : {}),
                ...(isReadOnly ? { color: colors.grayLight } : {}),
              }}
            />
            <InputSlot pr="$3">
              <View style={styles.iconContainer}>
                {showClear && (
                  <Pressable onPress={handleReset} mr={5}>
                    <SFSymbol
                      weight="thin"
                      size={17}
                      name="x.circle.fill"
                      colors={[colors.grayLight]}
                    />
                  </Pressable>
                )}
              </View>
            </InputSlot>
          </Input>

          {showSuggestion && filteredSuggestions.length > 0 && (
            <Box style={styles.suggestionContainer} zIndex={2}>
              <ScrollView
                maxHeight={205}
                w="100%"
                keyboardShouldPersistTaps="always"
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                {filteredSuggestions.map((sugg, idx) => {
                  const showSeparator: boolean =
                    filteredSuggestions.length !== idx + 1;
                  return (
                    <View style={{ flexDirection: "row" }} key={sugg.id}>
                      <Pressable onPress={() => handlePress(sugg.name)}>
                        <Box style={styles.suggestionItemContainer}>
                          <Text style={styles.suggestionItemText}>
                            {sugg.name}
                          </Text>
                        </Box>
                      </Pressable>
                      {showSeparator && <View style={styles.separator} />}
                    </View>
                  );
                })}
              </ScrollView>
            </Box>
          )}
        </VStack>
      </Box>
    );
  }
);

const styles = StyleSheet.create({
  inputStyle: { height: 44, zIndex: 1, borderWidth: 0, padding: 0 },
  inputFieldStyle: { fontSize: 17, paddingLeft: 0 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  suggestionContainer: {
    position: "absolute",
    flex: 1,
    top: 33,
    left: -20,
    borderRadius: 6,
    borderStyle: "solid",
    borderWidth: 0.3,
    borderColor: colors.gray,
    backgroundColor: colors.dark,
    maxWidth: width - 40,
  },
  suggestionItemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  suggestionItemText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 19,
  },
  separator: {
    backgroundColor: colors.gray,
    width: 1,
  },
});

export default AutoComplete;

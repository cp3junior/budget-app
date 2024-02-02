import { Text } from "react-native";
import React, { useState } from "react";
import {
  Box,
  Input,
  InputField,
  Pressable,
  ScrollView,
  VStack,
} from "@gluestack-ui/themed";

const items = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const AutoComplete = () => {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (text: string) => {
    setValue(text);
    if (text.length > 2) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  };

  const handlePress = (idx: number) => {
    console.log(`${idx}`);
    setValue(`${idx}`);
    setShowSuggestion(false);
  };

  const handleBlur = () => {
    // setShowSuggestion(false);
  };

  return (
    <Box zIndex={10}>
      <VStack position="relative" w="$full">
        <Input variant="outline" size="lg" w="$full" zIndex={1}>
          <InputField
            placeholder="Enter Text here"
            value={value}
            onChangeText={handleChange}
            onBlur={handleBlur}
          />
        </Input>
        {showSuggestion && (
          <Box
            zIndex={2}
            bg="white"
            sx={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "$primary700",
            }}
            position="absolute"
            w="100%"
            top="$10"
            borderRadius="$lg"
          >
            <ScrollView
              maxHeight={200}
              w="100%"
              keyboardShouldPersistTaps="always"
            >
              {Array(value.length)
                .fill(0)
                .map((_, idx) => (
                  //   <Pressable key={idx} onPress={() => handlePress(idx)}>
                  <Box key={idx} h="$8">
                    <Text>{idx}</Text>
                  </Box>
                  //   </Pressable>
                ))}
            </ScrollView>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AutoComplete;

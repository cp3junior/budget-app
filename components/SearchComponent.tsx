import { Input, InputField, InputSlot, Pressable } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../lib/theme";

interface SearchComponentProps {
  onSearch: (text: string) => void;
  searchText: string;
}

const SearchComponent = ({ onSearch, searchText }: SearchComponentProps) => {
  const [showClear, setShowClear] = useState(true);

  useEffect(() => {
    if (searchText?.length > 0) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [searchText]);

  const handleReset = () => {
    setShowClear(false);
    onSearch("");
  };

  return (
    <View style={styles.container}>
      <Input w="$full" style={styles.inptStyle}>
        <InputSlot>
          <View style={styles.searchIc}>
            <SFSymbol
              weight="thin"
              size={15}
              name="magnifyingglass"
              colors={[colors.grayLight]}
            />
          </View>
        </InputSlot>
        <InputField
          style={styles.textInputStyle}
          placeholder="Search"
          autoCapitalize="none"
          keyboardAppearance="dark"
          value={searchText}
          onChangeText={(text) => onSearch(text)}
          type="text"
          returnKeyType="search"
        />
        <InputSlot>
          <View>
            {showClear && (
              <Pressable onPress={handleReset} mr={10}>
                <SFSymbol
                  weight="thin"
                  size={15}
                  name="x.circle.fill"
                  colors={[colors.grayLight]}
                />
              </Pressable>
            )}
          </View>
        </InputSlot>
      </Input>
    </View>
  );
};

const styles = StyleSheet.create({
  inptStyle: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    height: 32,
    borderWidth: 0,
  },
  textInputStyle: {
    fontSize: 14,
  },
  container: { marginVertical: 10 },
  searchIc: {
    marginLeft: 10,
  },
});

export default SearchComponent;

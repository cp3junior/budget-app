import { ChevronsUpDownIcon } from "@gluestack-ui/themed";
import { StyleSheet, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { SystemName } from "sweet-sfsymbols/src/SweetSFSymbols.types";
import * as DropdownMenu from "zeego/dropdown-menu";
import Text from "../Text";

export interface DropdownItem {
  id: number;
  label: string;
  items?: DropdownItem[];
  icon?: SystemName;
}

interface DropDownMenuProps {
  id: string;
  label: string;
  data: DropdownItem[];
  value: DropdownItem;
  onChange: (value: DropdownItem) => void;
}

const DropDownMenu = ({
  data,
  value,
  onChange,
  label,
  id,
}: DropDownMenuProps) => {
  return (
    <>
      <Text fontWeight="800" style={styles.flex}>
        {label}
      </Text>
      <View>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <View style={styles.labelContainer}>
              {value?.icon && (
                <SFSymbol size={18} colors={["white"]} name={value.icon} />
              )}
              <Text style={styles.labelTxt}>{value.label}</Text>
              <ChevronsUpDownIcon />
            </View>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {data.map((dataItem) => {
              const {
                id: idItem,
                label: labelItem,
                items,
                icon: iconItem,
              } = dataItem;
              if (items && items.length > 0) {
                return (
                  <DropdownMenu.Sub key={`${id}-sub-trigger-${idItem}`}>
                    <DropdownMenu.SubTrigger
                      key={`${id}-sub-trigger-${idItem}`}
                    >
                      {labelItem}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                      {items.map((item) => {
                        const {
                          icon,
                          id: idSubItem,
                          label: labelSubItem,
                        } = item;
                        return (
                          <DropdownMenu.CheckboxItem
                            key={`${id}-sub-${idSubItem}`}
                            value={labelSubItem === value.label}
                            onValueChange={() => {
                              onChange(item);
                            }}
                          >
                            <DropdownMenu.ItemIndicator />
                            <DropdownMenu.ItemTitle>
                              {labelSubItem}
                            </DropdownMenu.ItemTitle>
                            {icon && (
                              <DropdownMenu.ItemIcon
                                ios={{
                                  name: icon,
                                }}
                              />
                            )}
                          </DropdownMenu.CheckboxItem>
                        );
                      })}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                );
              } else {
                return (
                  <DropdownMenu.CheckboxItem
                    key={`${id}-item-${idItem}`}
                    value={labelItem === value.label}
                    onValueChange={() => {
                      onChange(dataItem);
                    }}
                  >
                    <DropdownMenu.ItemIndicator />
                    <DropdownMenu.ItemTitle>{labelItem}</DropdownMenu.ItemTitle>
                    {iconItem && (
                      <DropdownMenu.ItemIcon
                        ios={{
                          name: iconItem,
                        }}
                      />
                    )}
                  </DropdownMenu.CheckboxItem>
                );
              }
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    padding: 0,
    marginBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  btnStyle: { fontSize: 18 },
  flex: { flex: 1 },
  datePickerContent: { flexDirection: "row" },
  labelContainer: { flexDirection: "row", alignItems: "center" },
  labelTxt: { marginRight: 10, marginLeft: 8 },
});

export default DropDownMenu;

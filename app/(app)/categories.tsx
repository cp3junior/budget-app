import { StyleSheet, View } from "react-native";
import Text from "../../components/common/Text";
import SafeContainer from "../../components/common/SafeContainer";
import { categories } from "../../lib/constant";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import { colors } from "../../lib/theme";
import SFSymbol from "sweet-sfsymbols";
import { Fragment } from "react";
import FormListItemList from "../../components/common/FormList/FormListItemList";

const CategoriesScreen = () => {
  return (
    <SafeContainer hasHeader>
      <View style={styles.container}>
        {categories.map((category) => {
          const { id, icon, label, items = [] } = category;
          return (
            <View key={id}>
              <View style={styles.labelContainer}>
                {icon && (
                  <SFSymbol size={13} name={icon} colors={[colors.grayLight]} />
                )}
                <Text style={styles.txtInfo}>{label}</Text>
              </View>
              <FormListContainer style={styles.containerStyle}>
                {items.map((item, index) => {
                  const { id: idItem, label: labelItem, icon: iconItem } = item;

                  const canShow: boolean = items.length !== index + 1;

                  return (
                    <Fragment key={idItem}>
                      <FormListItemList>
                        <View style={styles.itemContainer}>
                          <Text style={styles.txtLabelItem} fontWeight="600">
                            {labelItem}
                          </Text>
                          {iconItem && (
                            <SFSymbol
                              size={15}
                              name={iconItem}
                              colors={[colors.grayLight]}
                            />
                          )}
                        </View>
                      </FormListItemList>
                      {canShow && <FormListSeparator />}
                    </Fragment>
                  );
                })}
              </FormListContainer>
            </View>
          );
        })}
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 60 },
  containerStyle: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  txtInfo: {
    textTransform: "uppercase",
    fontSize: 17,
    fontWeight: "500",
    color: colors.grayLight,
    marginLeft: 8,
  },
  labelContainer: {
    paddingLeft: 20,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtLabelItem: {
    marginLeft: 8,
  },
});

export default CategoriesScreen;

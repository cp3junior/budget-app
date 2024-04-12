import React from "react";
import { ButtonGroup, ButtonText } from "@gluestack-ui/themed";
import { Button } from "@gluestack-ui/themed";

const ToggleButton = () => {
  return (
    <ButtonGroup isAttached flex={1}>
      <Button
        variant="solid"
        size="xs"
        borderColor="$backgroundLight300"
        borderRightWidth="$0"
        $dark-borderColor="$backgroundDark700"
        flex={1}
      >
        <ButtonText color="$textLight900" $dark-color="$textDark300">
          Export
        </ButtonText>
      </Button>
      <Button
        variant="outline"
        size="xs"
        borderColor="$backgroundLight300"
        $dark-borderColor="$backgroundDark700"
        flex={1}
      >
        <ButtonText color="$textLight900" $dark-color="$textDark300">
          Save
        </ButtonText>
      </Button>
    </ButtonGroup>
  );
};

export default ToggleButton;

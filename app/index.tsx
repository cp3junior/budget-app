import { Text, Box, Button, ButtonText } from "@gluestack-ui/themed";
import AutoComplete from "../components/AutoComplete/AutoComplete";
import Layout from "../layout/Layout";

export default function Page() {
  return (
    <Layout>
      <Box width="100%" justifyContent="center" alignItems="center">
        <Text>Open up App.tsx to start working on your app!</Text>
        <AutoComplete />

        <Text>test under</Text>
        <Button>
          <ButtonText>tes</ButtonText>
        </Button>
      </Box>
    </Layout>
  );
}

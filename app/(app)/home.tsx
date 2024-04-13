import { Link } from "expo-router";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import { View } from "react-native";
import { Image } from "@gluestack-ui/themed";

const Home = () => {
  return (
    <View>
      <View>
        <View>
          <Text>Welcome back Andrew</Text>
        </View>
        <View>
          <Image
            source={require("../../assets/images/user.png")}
            alt="user profile"
          />
        </View>
      </View>
      <Text style={{ color: "red" }}>Home Page???</Text>
      <Link href="/sign-in">
        <Text>Login</Text>
      </Link>
      <Link href="/test" style={{ marginTop: 40 }}>
        <Text>Test</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 140 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>About</Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni iste id
          consectetur aliquam possimus aut odio at perspiciatis quisquam
          dolorem, aliquid vel ipsam cumque illum quod officia eius impedit.
          Sapiente!
        </Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni iste id
          consectetur aliquam possimus aut odio at perspiciatis quisquam
          dolorem, aliquid vel ipsam cumque illum quod officia eius impedit.
          Sapiente!
        </Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni iste id
          consectetur aliquam possimus aut odio at perspiciatis quisquam
          dolorem, aliquid vel ipsam cumque illum quod officia eius impedit.
          Sapiente!
        </Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni iste id
          consectetur aliquam possimus aut odio at perspiciatis quisquam
          dolorem, aliquid vel ipsam cumque illum quod officia eius impedit.
          Sapiente!
        </Text>
      </Link>
      <Link href="/about" style={{ marginTop: 40 }}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni iste id
          consectetur aliquam possimus aut odio at perspiciatis quisquam
          dolorem, aliquid vel ipsam cumque illum quod officia eius impedit.
          Sapiente!
        </Text>
      </Link>
    </View>
  );
};

const HomeScreen = withTabBar(Home);

export default HomeScreen;

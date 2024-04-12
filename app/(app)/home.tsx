import { Link } from "expo-router";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";

const Home = () => {
  return (
    <>
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
    </>
  );
};

const HomeScreen = withTabBar(Home);

export default HomeScreen;

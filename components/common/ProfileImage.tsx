import { Image } from "@gluestack-ui/themed";
import { ImageStyle, StyleProp } from "react-native";
import { useAppContext } from "../../hook/useAppContext";

interface ProfileImageProps {
  style?: StyleProp<ImageStyle>;
  externalUser?: User;
}

const ProfileImage = ({ style, externalUser }: ProfileImageProps) => {
  const { user } = useAppContext();
  if (!user) return null;

  let source = "";
  if (externalUser) {
    if (externalUser.image) {
      source = externalUser.image;
    } else {
      source = require("../../assets/images/user.png");
    }
  } else {
    if (user.image) {
      source = user.image;
    } else {
      source = require("../../assets/images/user.png");
    }
  }

  return <Image source={source} alt="user profile" style={style} />;
};

export default ProfileImage;

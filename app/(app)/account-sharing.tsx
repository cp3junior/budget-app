import React from "react";
import SharedAccount from "../../components/accountSharing/SharedAccount";
import SharingAccount from "../../components/accountSharing/SharingAccount";
import { useAppContext } from "../../hook/useAppContext";

const AccountSharing = () => {
  const { user } = useAppContext();

  if (!user) return null;

  const isAccessingOtherAccount = user.email !== user.sharedAccounId;

  return isAccessingOtherAccount ? <SharedAccount /> : <SharingAccount />;
};

export default AccountSharing;

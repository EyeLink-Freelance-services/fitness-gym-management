import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  // other metadata
};

const AccountSettingsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Account Settings" />
    
    </>
  );
};

export default AccountSettingsPage;

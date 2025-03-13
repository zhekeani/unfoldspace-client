import SettingAccountContainer from "@/components/containers/SettingAccountContainer";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { redirect } from "next/navigation";

const SettingAccountPage = async () => {
  const userRes = await fetchActiveUserOnServer();
  if (!userRes) {
    redirect("/");
  }

  const { serviceUser } = userRes;

  return <SettingAccountContainer user={serviceUser} />;
};

export default SettingAccountPage;

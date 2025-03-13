import SettingAccountContainer from "@/components/containers/SettingAccountContainer";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";

const SettingAccountPage = async () => {
  const userRes = await fetchActiveUserOnServer();
  if (!userRes) return null;

  const { serviceUser } = userRes;

  return <SettingAccountContainer user={serviceUser} />;
};

export default SettingAccountPage;

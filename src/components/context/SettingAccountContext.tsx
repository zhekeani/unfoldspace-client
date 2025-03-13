import { fetchActiveUserOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import { ServiceUser } from "@/types/database.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

type SettingAccountContextType = {
  user: ServiceUser;
  userQueryKey: string[];
  invalidateUser: () => void;
};

const SettingAccountContext = createContext<
  SettingAccountContextType | undefined
>(undefined);

type SettingAccountProviderProps = {
  initialUser: ServiceUser;
  children: ReactNode;
};

export const SettingAccountProvider = ({
  initialUser,
  children,
}: SettingAccountProviderProps) => {
  const queryClient = useQueryClient();

  const userQueryKey = ["service-user", initialUser.id];
  const { data } = useQuery({
    queryKey: userQueryKey,
    queryFn: () => fetchActiveUserOnClient(),
    initialData: { serviceUser: initialUser },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: userQueryKey });
  };

  return (
    <SettingAccountContext.Provider
      value={{
        user: data ? data.serviceUser : initialUser,
        userQueryKey,
        invalidateUser,
      }}
    >
      {children}
    </SettingAccountContext.Provider>
  );
};

export const useSettingAccount = () => {
  const context = useContext(SettingAccountContext);
  if (!context) {
    throw new Error(
      "useSettingAccount must be used within a SettingAccountProvider."
    );
  }
  return context;
};

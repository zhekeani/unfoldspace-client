"use client";

import ReadingListItem, {
  ExtendedReadingList,
} from "@/components/reading-list/ReadingListItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type UserReadingListsContainerProps = {
  readingLists: ExtendedReadingList[];
  activeUserId: string;
  username: string;
};

const InnerUserReadingListsContainer = ({
  readingLists,
  activeUserId,
  username,
}: UserReadingListsContainerProps) => {
  return (
    <div className="w-full px-6 pb-2">
      <div className="w-full flex flex-col gap-9 items-center">
        {readingLists.map((readingList) => (
          <ReadingListItem
            username={username}
            key={readingList.id}
            initialReadingList={readingList}
            isOwned={readingList.user_id === activeUserId}
          />
        ))}
      </div>
    </div>
  );
};

const UserReadingListsContainer = (props: UserReadingListsContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerUserReadingListsContainer {...props} />
    </QueryClientProvider>
  );
};

export default UserReadingListsContainer;

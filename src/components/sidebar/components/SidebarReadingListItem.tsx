import { ReadingList } from "@/types/database.types";
import Link from "next/link";
import { HTMLAttributes } from "react";

type ReadingListItemProps = {
  readingList: ReadingList;
};

type CoverImageItemProps = HTMLAttributes<HTMLDivElement> & {
  coverImageUrl?: string;
  index: number;
};

const CoverImageItem = ({ coverImageUrl, index }: CoverImageItemProps) => {
  return (
    <div className="relative bg-muted-foreground/10  w-full h-full outline-none border-none">
      {coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImageUrl}
          alt="reading list item"
          className="object-cover h-full w-full"
        />
      )}
      {index !== 2 && (
        <div className="absolute h-full w-[2px] top-0 right-0 bg-white outline-none border-none" />
      )}
    </div>
  );
};

const SidebarReadingListItem = ({ readingList }: ReadingListItemProps) => {
  const recentCoversUrls = Array.isArray(readingList.recent_story_covers)
    ? (readingList.recent_story_covers as unknown as string[])
    : [];

  return (
    <Link href={"/"} className="h-12 flex gap-5">
      <div className="w-[93px] flex-shrink-0 grid grid-cols-[50%_30%_20%]">
        {recentCoversUrls.map((cover, index) => (
          <CoverImageItem key={index} index={index} coverImageUrl={cover} />
        ))}
        {Array.from({ length: 3 - recentCoversUrls.length }).map((_, index) => (
          <CoverImageItem key={index} index={recentCoversUrls.length + index} />
        ))}
      </div>
      <div className="flex flex-col">
        <h5 className="font-medium text-sm">{readingList.title}</h5>
        <p className="text-xs text-sub-text">
          {recentCoversUrls.length === 0 ? "No" : recentCoversUrls.length}{" "}
          stories
        </p>
      </div>
    </Link>
  );
};

export default SidebarReadingListItem;

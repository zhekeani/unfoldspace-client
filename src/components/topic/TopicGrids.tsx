import { ExtendedTopic } from "@/types/database.types";
import TopicTree from "./TopicTree";

type TopicGridsProps = {
  topics: ExtendedTopic[];
};

const TopicGrids = ({ topics }: TopicGridsProps) => {
  return (
    <div className="w-full mx-6 hidden desktop:block">
      <div className="mx-12 w-full grid grid-cols-3">
        {topics.map((topic) => (
          <TopicTree key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default TopicGrids;

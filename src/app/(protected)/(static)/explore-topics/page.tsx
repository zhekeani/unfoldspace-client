import { getTopicsHierarchy } from "@/actions/topic/getTopics";
import TopicAccordions from "@/components/topic/TopicAccordions";
import TopicGrids from "@/components/topic/TopicGrids";
import TopicSearch from "@/components/topic/TopicSearch";

const recommendedTopics: string[] = [
  "Web Development",
  "Kubernetes",
  "Artificial Intelligence",
];

const ExploreTopicPage = async () => {
  const response = await getTopicsHierarchy();

  if (!response.success) {
    console.error(response.error);
    return <div>You fucked</div>;
  }

  const topics = response.data.topics;

  return (
    <main className="max-w-full">
      <div className="h-[106px] w-full">{/* Popular topics carousal */}</div>
      <div className="w-full flex flex-col items-center ">
        <h2 className="text-2xl tablet:text-4xl font-medium">Explore topics</h2>
        <div className="w-full max-w-[728px]  my-6 flex justify-center">
          <div className="mx-6 w-full">
            <TopicSearch />
          </div>
        </div>
        <div className="w-full px-6">
          <div className="w-full flex tablet:justify-center ">
            <div className=" flex gap-2 text-sm ">
              <p className="text-sub-text">Recommended:</p>
              <div className="flex gap-2 text-main-text">
                {recommendedTopics.map((topic, index) => (
                  <p key={index}>{topic}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-16 mb-8 desktop:mb-16 h-[1px] bg-complement-light-gray" />

        <TopicGrids topics={topics} />
        <TopicAccordions topics={topics} />
      </div>
    </main>
  );
};

export default ExploreTopicPage;

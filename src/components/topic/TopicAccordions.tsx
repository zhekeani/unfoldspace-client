import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExtendedTopic } from "@/types/database.types";
import TopicTree from "./TopicTree";

type TopicAccordionsProps = {
  topics: ExtendedTopic[];
};

const TopicAccordions = ({ topics }: TopicAccordionsProps) => {
  return (
    <div className="desktop:hidden w-full">
      <Accordion type="single" collapsible className="w-full px-8">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id}>
            <AccordionTrigger className="font-normal text-sub-text text-xl">
              {topic.name}
            </AccordionTrigger>
            <AccordionContent>
              <TopicTree topic={topic} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TopicAccordions;

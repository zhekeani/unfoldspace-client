type BlockTypeCategoryTitleProps = {
  title: string;
};

const BlockTypeCategoryTitle = ({ title }: BlockTypeCategoryTitleProps) => {
  return (
    <div className="text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5">
      {title}
    </div>
  );
};

export default BlockTypeCategoryTitle;

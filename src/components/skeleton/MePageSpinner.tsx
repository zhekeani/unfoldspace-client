import PulseSpinner from "../loading/PulseSpinner";

const MePageSpinner = () => {
  return (
    <div className="w-full pt-[60px] flex justify-center">
      <PulseSpinner size="small" />
    </div>
  );
};

export default MePageSpinner;

import PulseSpinner from "@/components/loading/PulseSpinner";

const UserPageSpinner = () => {
  return (
    <div className="w-full pt-[60px] flex justify-center">
      <PulseSpinner size="small" />
    </div>
  );
};

export default UserPageSpinner;

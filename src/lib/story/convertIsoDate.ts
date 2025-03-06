const convertIsoDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default convertIsoDate;

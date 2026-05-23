export const getCompareList = () => {
  return JSON.parse(localStorage.getItem("compareList")) || [];
};

export const addToCompare = (property) => {
  const list = getCompareList();

  const exists = list.find((item) => item._id === property._id);
  if (exists) return list;

  if (list.length >= 3) return list;

  const updated = [...list, property];
  localStorage.setItem("compareList", JSON.stringify(updated));
  return updated;
};

export const removeFromCompare = (id) => {
  const updated = getCompareList().filter((item) => item._id !== id);
  localStorage.setItem("compareList", JSON.stringify(updated));
  return updated;
};
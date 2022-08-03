export const LoadingCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
      <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
      <div className="px-6 py-4 items-center">
        <div className="font-regular text-xl mb-2 w-20 h-4 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

export const LoadingRow = () => {
  const loadPages = [1, 2, 3, 4];
  return (
    <div className="grid gap-x-4 gap-y-5 minmd:gap-6 minmd:grid-cols-4 grid-cols-2 content-start">
      {loadPages.map(num => <LoadingCard key={num} />)}
    </div>
  );
};
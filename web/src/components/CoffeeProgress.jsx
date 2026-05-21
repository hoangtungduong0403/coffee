export default function CoffeeProgress({ progress }) {
  return (
    <div className="flex justify-center flex-wrap gap-2 my-3">
      {Array.from({ length: progress }).map((_, i) => {
        return (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-green-600 text-white
            `}
          >
            ☕
          </div>
        );
      })}
    </div>
  );
}
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="mb-10 flex justify-center">
        <div className="h-10 w-80 rounded-lg bg-gray-300/40 dark:bg-gray-700/40" />
      </div>

      <div className="rounded-xl p-8 mb-8 bg-gray-300/20 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-700/30">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 aspect-video rounded-lg bg-gray-300/40 dark:bg-gray-700/40" />
          <div className="md:w-1/2 space-y-3 pt-2">
            <div className="h-4 w-full rounded bg-gray-300/40 dark:bg-gray-700/40" />
            <div className="h-4 w-5/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
            <div className="h-4 w-4/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
            <div className="h-4 w-3/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-6 bg-gray-300/20 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-700/30 space-y-3">
          <div className="h-6 w-1/2 rounded bg-gray-300/40 dark:bg-gray-700/40" />
          <div className="h-4 w-full rounded bg-gray-300/40 dark:bg-gray-700/40" />
          <div className="h-4 w-5/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
        </div>
        <div className="rounded-xl p-6 bg-gray-300/20 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-700/30 space-y-3">
          <div className="h-6 w-1/2 rounded bg-gray-300/40 dark:bg-gray-700/40" />
          <div className="h-4 w-full rounded bg-gray-300/40 dark:bg-gray-700/40" />
          <div className="h-4 w-5/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
        </div>
      </div>

      <div className="rounded-xl p-6 bg-gray-300/20 dark:bg-gray-700/20 border border-gray-300/30 dark:border-gray-700/30 space-y-3">
        <div className="h-6 w-1/3 rounded bg-gray-300/40 dark:bg-gray-700/40" />
        <div className="h-4 w-full rounded bg-gray-300/40 dark:bg-gray-700/40" />
        <div className="h-4 w-11/12 rounded bg-gray-300/40 dark:bg-gray-700/40" />
        <div className="h-4 w-5/6 rounded bg-gray-300/40 dark:bg-gray-700/40" />
      </div>
    </div>
  );
}

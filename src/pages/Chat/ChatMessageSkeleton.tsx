/* eslint-disable @typescript-eslint/no-explicit-any */
export const ChatMessageSkeletonSelf = () => {
  // const randomString =
  return (
    <div className="flex-none flex max-w-[85%] sm:max-w-[65%] ml-auto animate-pulse select-none">
      <div className="p-2 pt-0 flex flex-col">
        <div className="whitespace-nowrap mb-1 gap-2 flex justify-end bg-base-300 text-transparent daisy-rounded">
          <span className="text-xs font-normal">"Hello"</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 text-base-content">
          <p className="p-2 bg-base-300 w-fit chat-item-border-self text-transparent">
            This is Skeleton
          </p>
        </div>
      </div>
    </div>
  );
};
export const ChatMessageSkeleton = () => {
  return (
    <div className="flex-none flex max-w-[85%] sm:max-w-[65%] animate-pulse select-none">
      <div className="daisy-avatar daisy-online flex-none w-12 h-12">
        <div className="w-full rounded-full">
          <img src="https://dummyimage.com/500x500/4166eb/fff.jpg" />
        </div>
      </div>
      <div className="p-2 pt-0">
        <div className="whitespace-nowrap mb-1 gap-2 flex bg-base-300 text-transparent daisy-rounded">
          <span className="text-xs font-medium">"Hello"</span>
          <span className="text-xs font-normal">"Hello"</span>
        </div>
        <div className="flex flex-col gap-0.5 text-base-content">
          <p className="p-2 bg-base-300 w-fit chat-item-border text-transparent">
            This is Skeleton
          </p>
        </div>
      </div>
    </div>
  );
};

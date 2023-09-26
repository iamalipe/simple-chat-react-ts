export interface ChatHeaderProps {
  title: string;
}
export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  return (
    <>
      <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
        {title}
      </h1>
    </>
  );
};

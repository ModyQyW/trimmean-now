import type { FC } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type MessageType = "error" | "info";

export interface MessageProps {
  className?: string;
  type: MessageType;
  text: string;
}

const getIconClassName = (type: MessageType) => {
  if (type === "error") return "i-ant-design-close-circle w-4 h-4 flex-none";
  if (type === "info") return "i-ant-design-info-circle w-4 h-4 flex-none";
  return "";
};

export const Message: FC<MessageProps> = ({ className, type, text }) => {
  const _className = twMerge(
    clsx(
      "rounded py-2 px-4 w-full flex justify-start items-center gap-2",
      type === "error" && "bg-red-50 text-red-500",
      type === "info" && "bg-blue-50 text-blue-500",
      className
    )
  );

  return (
    <div className={_className}>
      <span className={getIconClassName(type)} />
      <span>{text}</span>
    </div>
  );
};

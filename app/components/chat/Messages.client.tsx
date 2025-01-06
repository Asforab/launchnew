import type { Message } from 'ai';
import React from 'react';
import { cn } from '~/lib/utils';
import { Card } from '~/components/ui/card';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={cn(props.className, "space-y-4")}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <Card
                key={index}
                className={cn('flex gap-4 p-6 w-full', {
                  'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                    isStreaming && isLast,
                })}
              >
                <div className={cn("flex items-center justify-center w-[34px] h-[34px] overflow-hidden rounded-full shrink-0 self-start", {
                  'bg-white text-gray-600': isUserMessage,
                  'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': !isUserMessage
                })}>
                  <div className={cn("text-xl", {
                    'i-ph:user-fill': isUserMessage,
                    'i-bolt:stars': !isUserMessage
                  })}></div>
                </div>
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                </div>
              </Card>
            );
          })
        : null}
      {isStreaming && (
        <div className="flex justify-center items-center w-full p-4">
          <div className="i-svg-spinners:3-dots-fade text-4xl text-bolt-elements-textSecondary"></div>
        </div>
      )}
    </div>
  );
});

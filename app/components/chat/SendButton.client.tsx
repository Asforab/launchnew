import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-bolt-elements-item-backgroundAccent hover:bg-bolt-elements-item-backgroundAccentHover text-bolt-elements-item-contentAccent rounded-md w-[34px] h-[34px] transition-all duration-200"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          <div className={`text-lg ${isStreaming ? 'scale-90' : ''} transition-transform duration-200`}>
            {!isStreaming ? (
              <div className="i-ph:paper-plane-right-fill" />
            ) : (
              <div className="i-ph:stop-circle-bold" />
            )}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

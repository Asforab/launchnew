import { memo, useEffect, useState } from 'react';
import { bundledLanguages, codeToHtml, isSpecialLang, type BundledLanguage, type SpecialLanguage } from 'shiki';
import { cn } from '~/lib/utils';
import { createScopedLogger } from '~/utils/logger';

import styles from './CodeBlock.module.scss';

const logger = createScopedLogger('CodeBlock');

interface CodeBlockProps {
  className?: string;
  code: string;
  language?: BundledLanguage | SpecialLanguage;
  theme?: 'light-plus' | 'dark-plus';
  disableCopy?: boolean;
}

export const CodeBlock = memo(
  ({ className, code, language = 'plaintext', theme = 'dark-plus', disableCopy = false }: CodeBlockProps) => {
    const [html, setHTML] = useState<string | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      if (copied) {
        return;
      }

      navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    useEffect(() => {
      if (language && !isSpecialLang(language) && !(language in bundledLanguages)) {
        logger.warn(`Unsupported language '${language}'`);
      }

      logger.trace(`Language = ${language}`);

      const processCode = async () => {
        setHTML(await codeToHtml(code, { lang: language, theme }));
      };

      processCode();
    }, [code]);

    return (
      <div className={cn('relative group text-left rounded-lg overflow-hidden', className)}>
        {!disableCopy && (
          <button
            onClick={copyToClipboard}
            className={cn(
              'absolute top-2 right-2 h-8 w-8 rounded-md flex items-center justify-center',
              'bg-bolt-elements-background-depth-1/80 backdrop-blur-sm',
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColor',
              { 'opacity-100': copied }
            )}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            <div className={cn(
              'text-lg transition-transform',
              copied ? 'i-ph:check scale-110' : 'i-ph:clipboard-text-duotone'
            )} />
          </button>
        )}
        <div 
          className="p-4 bg-bolt-elements-background-depth-2 rounded-lg"
          dangerouslySetInnerHTML={{ __html: html ?? '' }}
        />
      </div>
    );
  },
);

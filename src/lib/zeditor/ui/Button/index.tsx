import type { JSX } from 'react';

import './index.css';

import type { ReactNode } from 'react';
import { joinClasses } from '@/lib/zeditor/utils';

export default function Button({
    children,
    className,
    onClick,
    disabled,
    small,
    title,
}: {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
    small?: boolean;
    title?: string;
}): JSX.Element {
    return (
        <button
            disabled={disabled}
            className={joinClasses(
                'Button__root',
                disabled && 'Button__disabled',
                small && 'Button__small',
                className,
            )}
            onClick={onClick}
            title={title}
            aria-label={title}
        >
            {children}
        </button>
    );
}

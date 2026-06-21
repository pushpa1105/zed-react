import type { JSX } from 'react';
import './index.css';
import type { ReactNode } from 'react';

type Props = Readonly<{
    children: ReactNode;
}>;

export function DialogButtonsList({ children }: Props): JSX.Element {
    return <div className="DialogButtonsList">{children}</div>;
}

export function DialogActions({
    children,
}: Props): JSX.Element {
    return (
        <div className="DialogActions">
            {children}
        </div>
    );
}

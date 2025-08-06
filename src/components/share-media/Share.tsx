import { type FC } from 'react';

import ShareController from './ShareController';

const Share: FC<Props> = ({ children, shareData, onInteraction, onSuccess, onError, disabled }) => {
  return (
    <ShareController shareData={shareData} onInteraction={onInteraction} onSuccess={onSuccess} onError={onError} disabled={disabled}>
      {children}
    </ShareController>
  );
};

interface Props {
  children: React.ReactNode;
  shareData: ShareData;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default Share;

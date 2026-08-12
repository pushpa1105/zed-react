import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export const RenamePanaMenu = ({
  panaTitle,
  handleSave,
}: {
  panaTitle?: string;
  handleSave: (_: string) => void;
}) => {
  const [title, setTitle] = useState(panaTitle);
  return (
    <div className="flex items-center gap-2">
      <Input
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="A New Page"
      />
      <Button
        onClick={() => {
          if (panaTitle == title) return;
          handleSave(title ?? 'A New Page');
        }}
      >
        Save
      </Button>
    </div>
  );
};

import { siteConfig } from '@/core/config/site';

/**
 * Document metadata. React 19 hoists <title> and <meta> into <head>,
 * so no helmet library is needed.
 */
export function Head({
  title,
  description = siteConfig.description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <>
      <title>{title ? `${title} · ${siteConfig.name}` : siteConfig.name}</title>
      <meta name="description" content={description} />
    </>
  );
}

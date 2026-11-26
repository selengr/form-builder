'use client';

import GamesHeader from './GamesHeader';

export default function GamePlayShell({
  title,
  slug,
  children,
}: {
  title: string;
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3 pb-10">
      <GamesHeader title={title} backHref={`/games/${slug}`} />
      {children}
    </div>
  );
}

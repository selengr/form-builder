import GameIntro from '@/templates/games/GameIntro';
import GameNotFound from '@/templates/games/GameNotFound';
import { getGameBySlug } from '@/templates/games/catalog';

export const dynamic = 'force-dynamic';

export default async function GameIntroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) return <GameNotFound />;

  return <GameIntro game={game} />;
}

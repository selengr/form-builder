import GameNotFound from '@/templates/games/GameNotFound';
import GameResult from '@/templates/games/GameResult';
import { getGameBySlug } from '@/templates/games/catalog';

export const dynamic = 'force-dynamic';

export default async function GameResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) return <GameNotFound />;

  return <GameResult game={game} />;
}

import {
  BookOpen, Gift, House, Package, ShoppingBag, Sparkles, Store, Trophy, Truck, Users,
  type LucideProps,
} from "lucide-react";

// Maps data-level icon keys to Lucide components so data files stay serialisable.
const map = { home: House, package: Package, store: Store, trophy: Trophy, truck: Truck, users: Users, sparkles: Sparkles, gift: Gift, bag: ShoppingBag, book: BookOpen };
export type IconName = keyof typeof map;

export default function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C strokeWidth={1.5} {...props} />;
}

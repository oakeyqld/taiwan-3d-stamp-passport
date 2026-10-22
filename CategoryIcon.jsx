import { FerrisWheel, Landmark, Mountain, Palmtree, UtensilsCrossed } from 'lucide-react';

const ICONS = {
  nature: Mountain,
  coast: Palmtree,
  culture: Landmark,
  landmark: FerrisWheel,
  food: UtensilsCrossed,
};

export default function CategoryIcon({ category, ...props }) {
  const Icon = ICONS[category] || Mountain;
  return <Icon {...props} />;
}

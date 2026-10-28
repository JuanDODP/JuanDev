import { techIcons } from '../../../data/techIcons';
import { Tag } from '../Tag';

/** Tag that shows the technology's brand icon in its own color when one is known. */
export function TechTag({ name }: { name: string }) {
  const tech = techIcons[name];
  const icon = tech && <tech.icon aria-hidden style={{ color: tech.color }} />;
  return <Tag icon={icon}>{name}</Tag>;
}

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  iconId: string | number;
  itemId?: string;
  className?: string;
  name: string;
  size?: 'xs';
}

const ItemIcon = ({ iconId, itemId, name, className, size }: Props) => {
  const iconSize = size === 'xs' ? '16' : '36';

  if (!itemId) {
    return (
      <figure className={className}>
        <Image
          src={`https://xivapi.com/i/${iconId.toString().slice(0, 3)}000/${iconId}.png`}
          width={iconSize}
          height={iconSize}
          alt={name}
        />
      </figure>
    );
  }

  return (
    <Link href={`/item/${itemId}`} passHref>
      <a className="flex items-center justify-center">
        <Image
          src={`https://xivapi.com/i/${iconId.toString().slice(0, 3)}000/${iconId}.png`}
          width={iconSize}
          height={iconSize}
          alt={name}
        />
      </a>
    </Link>
  );
};

export default ItemIcon;

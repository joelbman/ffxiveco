import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  id: string | number;
  name: string;
}

const ItemIcon = ({ id, name }: Props) => {
  return (
    <Link href={`/item/${id}`} passHref>
      <a className="flex items-center justify-center">
        <Image src={`https://xivapi.com/i/${id}/${id}.png`} width="36" height="36" alt={name} />
      </a>
    </Link>
  );
};

export default ItemIcon;

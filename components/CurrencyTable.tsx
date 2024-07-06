import React from 'react';
import GilIcon from './icons/GilIcon';
import ItemIcon from './icons/ItemIcon';

interface ItemData {
  id: number;
  cost: number;
  name: string;
  type?: string;
  avgPrice: number;
  gilRatio: number;
  updated: string;
}

interface Props {
  data: ItemData[];
  bait?: boolean;
  iconId: string;
  name: string;
}

const CurrencyTable = ({ data, bait, iconId, name }: Props) => {
  const filtered = bait
    ? data.filter((i) => i.type === 'bait')
    : data.filter((i) => i.type !== 'bait');

  console.log(filtered);

  return (
    <table className="w-full mt-4 mb-8" style={{ maxWidth: '1024px' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Average price</th>
          <th>Currency/gil ratio</th>
          <th>Last update</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((i: ItemData) => (
          <tr key={i.id}>
            <td>{i.name}</td>
            <td>
              <div className="flex items-center">
                {i.cost} <ItemIcon className="ml-1 -mb-1" iconId={iconId} name={name} size="xs" />
              </div>
            </td>
            <td>
              {i.avgPrice}
              <GilIcon />
            </td>
            <td>{i.gilRatio.toFixed(2)}</td>
            <td>{i.updated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CurrencyTable;

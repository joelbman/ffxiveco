import CurrencyTable from './CurrencyTable';
import ItemIcon from './icons/ItemIcon';
import gathererScripData from '../data/gathererScrips.json';
import crafterScripData from '../data/crafterScrips.json';

const ScripSection = ({
  data,
  name,
  type,
}: {
  data: any[];
  name: string;
  type: 'gatherer' | 'crafter';
}) => {
  const scripData = type === 'gatherer' ? gathererScripData : crafterScripData;
  const purple = 's';

  return (
    <section>
      <h2 className="flex">
        <ItemIcon
          className="mr-2"
          iconId={scripData[name.includes('Orange') ? 'orange' : 'purple'].iconId}
          name={name}
        />
        {name}
      </h2>

      <h3>Materia & Materials</h3>
      <CurrencyTable
        data={data}
        iconId={scripData[name.includes('Orange') ? 'orange' : 'purple'].iconId}
        name={name}
      />
    </section>
  );
};

export default ScripSection;

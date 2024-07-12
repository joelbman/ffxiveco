import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { WorldContext } from '../context/WorldContext';
import useXIVApi from '../hooks/useXIVApi';
import worlds from '../data/worlds.json';
import { validateContinent } from '../pages/_app';

interface DropdownItemProps {
  href: string;
  children: React.ReactNode;
}

const DropdownItem = ({ href, children }: DropdownItemProps) => (
  <Link passHref href={href} className="px-2 py-1 w-48 text-gray-200">
    {children}
  </Link>
);

const SearchIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NavBar = () => {
  const router = useRouter();
  const { searchItem } = useXIVApi();
  const [searchString, setSearchString] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { world, updateWorld, continent, updateContinent } = useContext(WorldContext);
  const [searchLoading, setSearchLoading] = useState(false);

  const changeWorld = (worldName: string) => {
    if (worldName === world) {
      return;
    }

    const prevWorld = world;
    localStorage.setItem('world', worldName);
    updateWorld(worldName);

    // Refresh the page if currently looking at item prices on another world
    if (router.pathname.includes(prevWorld)) {
      router.push(router.pathname.replace(prevWorld, worldName));
    }
  };

  const changeContinent = (continentName: string) => {
    if (continentName === continent) {
      return;
    }

    if (continentName === 'NA') {
      updateWorld('Adamantoise');
    } else {
      updateWorld('Cerberus');
    }

    localStorage.setItem('continent', continentName);
    updateContinent(validateContinent(continentName));
  };

  const xivDbSearch = async () => {
    if (searchLoading) {
      return;
    }

    setSearchLoading(true);
    const res = await searchItem(searchString);

    // Redirect to item page instantly if there's only one result
    if (res.data.Results.length === 1) {
      setSearchLoading(false);
      router.push(`/item/${res.data.Results[0].ID}`);
    } else {
      setSearchLoading(false);
      setResults(res.data.Results);
      setResultsOpen(true);
    }
  };

  return (
    <nav className="flex justify-center items-center fixed w-full top-0 left-0 h-12 bg-gray-900 z-30">
      <div className="container">
        <div className="flex flex-row justify-between items-center">
          <section className="flex flex-row items-center">
            <Link passHref href="/" className="text-2xl mr-4">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
              >
                <path d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
              </svg>
            </Link>

            <div
              className="relative py-1 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              role="button"
            >
              Currencies
              {showDropdown && (
                <div
                  className="flex flex-col absolute top-8 -left-1 bg-gray-900"
                  role="menu"
                  style={{ maxWidth: '560px' }}
                  onMouseEnter={() => setShowDropdown(true)}
                >
                  {/* <DropdownItem href="/conversion/tomestone/">Tomestone</DropdownItem> */}
                  <DropdownItem href="/conversion/crafter/">Crafter scrips</DropdownItem>
                  <DropdownItem href="/conversion/gatherer/">Gatherer scrips</DropdownItem>
                </div>
              )}
            </div>
          </section>

          <section className="relative">
            <div className="flex">
              <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    xivDbSearch();
                  }
                }}
                placeholder="Search for an item..."
                className="outline-none"
                style={{ maxWidth: '1024px' }}
              />
              <figure
                className="flex items-center p-2 cursor-pointer"
                onClick={() => xivDbSearch()}
              >
                <SearchIcon />
              </figure>
            </div>

            {resultsOpen && (
              <div
                className="absolute top-10 bg-gray-900 z-30"
                onBlur={() => setResultsOpen(false)}
              >
                {results.length === 0 && (
                  <div className="flex items-center p-4 w-72">No results found.</div>
                )}
                {results.map((r) => (
                  <Link
                    href={`/item/${r.ID}`}
                    key={r.ID}
                    className="flex items-center p-4 w-72 hover:bg-gray-800"
                    onClick={() => setResultsOpen(false)}
                    passHref
                  >
                    <Image
                      src={`https://xivapi.com/${r.Icon}`}
                      alt={r.Name}
                      width="40"
                      height="40"
                    />
                    <p className="ml-4">{r.Name}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="flex gap-4">
            <select value={continent} onChange={(e) => changeContinent(e.target.value)}>
              <option value="EU">EU</option>
              <option value="NA">NA</option>
            </select>
            <select value={world} onChange={(e) => changeWorld(e.target.value)}>
              {continent === 'EU' && (
                <>
                  <option disabled>Chaos</option>
                  {worlds.EU.Chaos.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}

                  <option disabled>Light</option>
                  {worlds.EU.Light.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}
                </>
              )}

              {continent === 'NA' && (
                <>
                  <option disabled>Aether</option>
                  {worlds.NA.Aether.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}

                  <option disabled>Crystal</option>
                  {worlds.NA.Crystal.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}

                  <option disabled>Dynamis</option>
                  {worlds.NA.Dynamis.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}

                  <option disabled>Primal</option>
                  {worlds.NA.Primal.map((w, i) => (
                    <option key={i} value={w}>
                      {w}
                    </option>
                  ))}
                </>
              )}
            </select>
          </section>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

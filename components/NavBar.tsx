import Image from 'next/Image';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useContext, useRef, useState } from 'react';
import { WorldContext } from '../context/WorldContext';
import useXIVApi from '../hooks/useXIVApi';

const NavBar = () => {
  const router = useRouter();
  const { searchItem } = useXIVApi();
  const [searchString, setSearchString] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { world, updateWorld } = useContext(WorldContext);

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

  const xivDbSearch = async () => {
    const res = await searchItem(searchString);

    // Redirect to item page instantly if there's only one result
    if (res.data.Results.length === 1) {
      router.push(`/item/${res.data.Results[0].ID}`);
    } else {
      setResults(res.data.Results);
      setResultsOpen(true);
    }
  };

  return (
    <nav className="flex justify-center fixed w-full top-0 left-0 h-12 bg-gray-900 z-30">
      <div className="container">
        <div className="flex flex-row justify-between items-center py-2">
          <section className="text-2xl">
            <Link passHref href="/">
              <a>
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
              </a>
            </Link>
          </section>

          <section className="relative">
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
              style={{ maxWidth: '1024px' }}
            />

            {resultsOpen && (
              <div
                className="absolute top-10 bg-gray-900 z-30"
                onBlur={() => setResultsOpen(false)}
              >
                {results.length === 0 && (
                  <div className="flex items-center p-4 w-72">No results found.</div>
                )}
                {results.map((r) => (
                  <Link href={`/item/${r.ID}`} key={r.ID}>
                    <a className="flex items-center p-4 w-72" onClick={() => setResultsOpen(false)}>
                      <Image
                        src={`https://xivapi.com/${r.Icon}`}
                        alt={r.Name}
                        width="40"
                        height="40"
                      />
                      <p className="ml-4">{r.Name}</p>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <select value={world} onChange={(e) => changeWorld(e.target.value)}>
              <option value="Cerberus">Cerberus</option>
              <option value="Moogle">Moogle</option>
              <option value="Louisoux">Louisoix</option>
              <option value="Omega">Omega</option>
              <option value="Ragnarok">Ragnarok</option>
              <option value="Spriggan">Spriggan</option>
            </select>
          </section>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

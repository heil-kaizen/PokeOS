import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export const PokedexApp = () => {
  const [pokemonList, setPokemonList] = useState<{name: string, url: string}[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(res => res.json())
      .then(data => {
        setPokemonList(data.results);
        setLoading(false);
        fetchPokemonDetails(data.results[0].url);
      });
  }, []);

  const fetchPokemonDetails = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    setSelectedPokemon(data);
  };

  const filtered = pokemonList.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <div className="flex h-full bg-[#ece9d8] font-sans">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-[#716f64] flex flex-col bg-white">
        <div className="p-2 border-b border-[#716f64] bg-[#ece9d8]">
          <div className="flex items-center bg-white border border-[#716f64] px-1 shadow-inner">
            <Search size={14} className="text-gray-500" />
            <input 
              type="text" 
              className="w-full text-xs p-1 outline-none" 
              placeholder="Search Pokémon..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-2 text-xs text-center">Loading Data...</div> : (
            <ul className="py-1">
              {filtered.map((p, i) => {
                const id = p.url.split('/')[6];
                return (
                  <li 
                    key={p.name} 
                    className={`text-xs px-2 py-1 cursor-pointer flex items-center gap-2 hover:bg-[#316ac5] hover:text-white ${selectedPokemon?.name === p.name ? 'bg-[#316ac5] text-white' : 'text-black'}`}
                    onClick={() => fetchPokemonDetails(p.url)}
                  >
                    <span className="w-6 text-right text-black/50 group-hover:text-white/50">#{id.padStart(3, '0')}</span>
                    <span className="capitalize">{p.name}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-[#d3e5fa] flex flex-col relative overflow-hidden">
         {/* XP Explorer Toolbar */}
         <div className="h-[38px] border-b border-[#716f64] bg-[#ece9d8] flex items-center px-1 gap-1">
            <div className="text-xs flex items-center px-2 py-1 hover:border hover:border-black/20 rounded cursor-pointer gap-1">
              <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><ChevronRight size={14} /></span>
              Back
            </div>
            <div className="w-[1px] h-[24px] bg-black/20 mx-1" />
            <div className="text-xs px-2 py-1 flex items-center gap-1">
              <span className="font-bold">Address</span>
              <div className="flex-1 min-w-[200px] border border-[#716f64] bg-white px-2 py-0.5 ml-1 flex items-center shadow-inner">
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-3 h-3 mr-1" alt="" />
                 My Computer\Pokédex\{selectedPokemon?.name ? selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1) : ''}
              </div>
            </div>
         </div>

         {/* Dex Content */}
         <div className="flex-1 p-6 flex items-start gap-6 overflow-y-auto">
           {selectedPokemon && (
             <>
                <div className="w-[200px] h-[200px] bg-white border-2 border-[#716f64] shadow-md p-4 flex items-center justify-center relative">
                   <div className="absolute top-0 right-0 bg-[#316ac5] text-white font-bold px-2 py-1 text-xs border-b border-l border-[#716f64]">
                     #{String(selectedPokemon.id).padStart(3, '0')}
                   </div>
                   <img 
                     src={selectedPokemon.sprites.front_default || selectedPokemon.sprites.other['official-artwork'].front_default} 
                     className="w-full h-full object-contain pixelated" 
                     style={{ imageRendering: 'pixelated' }}
                     alt={selectedPokemon.name} 
                   />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                   <h1 className="text-4xl font-bold capitalize tracking-tight text-[#1b439c] flex items-end gap-3">
                     {selectedPokemon.name}
                     <span className="text-sm font-normal text-gray-600 mb-1">
                       {selectedPokemon.height / 10}m / {selectedPokemon.weight / 10}kg
                     </span>
                   </h1>
                   
                   <div className="flex gap-2">
                     {selectedPokemon.types.map((t: any) => (
                       <span key={t.type.name} className="px-3 py-1 bg-white border border-[#716f64] rounded-full text-xs font-bold uppercase shadow-sm">
                         {t.type.name}
                       </span>
                     ))}
                   </div>

                   <div className="bg-white border border-[#716f64] p-3 mt-4 shadow-sm">
                     <h3 className="font-bold text-sm border-b border-[#ece9d8] pb-1 mb-2 text-[#316ac5]">Base Stats</h3>
                     <div className="flex flex-col gap-1.5">
                       {selectedPokemon.stats.map((s: any) => (
                         <div key={s.stat.name} className="flex items-center text-xs">
                           <span className="w-32 capitalize text-gray-700">{s.stat.name.replace('-', ' ')}</span>
                           <div className="flex-1 h-3 bg-[#ece9d8] border border-[#716f64] mx-2">
                              <div 
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 border-r border-[#716f64]" 
                                style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }} 
                              />
                           </div>
                           <span className="w-8 text-right font-mono">{s.base_stat}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
             </>
           )}
         </div>
      </div>
    </div>
  );
}

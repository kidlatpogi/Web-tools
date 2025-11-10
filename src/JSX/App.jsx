import React, { useState } from 'react';
import '../CSS/App.css'
import { aiTools, dvaTools, cdtTools, flTools, hdTools, ldTools } from '../data/tools';
import ItemCard from './ItemCard';

function App() {
  const [activeSection, setActiveSection] = useState('ai');

  // store selected IDs (serializable) instead of objects
  const [selectedAI, setSelectedAI] = useState(null);

  const [selectedDVA, setSelectedDVA] = useState(null);
  const [selectedDVACategory, setSelectedDVACategory] = useState('all');

  const [selectedCDT, setSelectedCDT] = useState(null);
  const [selectedFL, setSelectedFL] = useState(null);
  const [selectedHD, setSelectedHD] = useState(null);
  const [selectedLD, setSelectedLD] = useState(null);


  // Use data from module
  const aiItems = aiTools;
  const dvaItems = dvaTools;
  const cdtItems = cdtTools;
  const flItems = flTools;
  const hdItems = hdTools;
  const ldItems = ldTools;
  const dvaCategories = ['all', 'fonts', 'photos', 'vectors', 'animations', 'inspiration'];
  const filteredDVAItems = selectedDVACategory === 'all' ? dvaItems : dvaItems.filter(i => i.category === selectedDVACategory);

  // Lookup helpers
  const findById = (arr, id) => arr.find((x) => x.id === id) || null;
  const selectedAIObj = findById(aiItems, selectedAI);
  const selectedDVAObj = findById(dvaItems, selectedDVA);
  const selectedCDTObj = findById(cdtItems, selectedCDT);
  const selectedFLObj = findById(flItems, selectedFL);
  const selectedHDObj = findById(hdItems, selectedHD);
  const selectedLDObj = findById(ldItems, selectedLD);

  return (
    <>
    {/* Header Div */}
      <div>
        <header className='header'>

          {/* Pagbati LMAO | Greetings */}
          <div className='greetings'>
            <h1>Web Tools</h1>
            <h4>Your All-in-One Web Dev Link Library</h4>
          </div>
          {/* End of Greetings */}

          {/* Content Navigation */}
        <div className="content-navigation">
          <nav>
            <ul>
              <li>
                <button onClick={() => setActiveSection('ai')}>A.I. & Automation</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('va')}>Design & Visual Assets</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('cdt')}>Core Development Tools</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('fl')}>Frameworks & Libraries</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('hd')}>Hosting & Deploymen</button>
              </li>
              <li>
                <button onClick={() => setActiveSection('ld')}>Learning & Documentation</button>
              </li>
            </ul>
          </nav>
        </div>
          {/* End of Content Navigation */}

          <hr />

        </header>
      </div>

    {/* Main Content Div*/}
        <div>
          <main>

            {/* AI Section */}
            {activeSection === 'ai' && (
              <section id="ai" className="tab-section">
                <h2>A.I. & Automation</h2>

                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {aiItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedAI(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedAI(item.id);
                              }
                            }}
                            className={selectedAI === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedAIObj} />

                </div>
              </section>
            )}

            {/* DVA Section */}
            {activeSection === 'va' && (
              <section id="va" className="tab-section">
                <h2>Design & Visual Assets</h2>

                {/* Category bar */}  
                  <div className="category-bar">
                    {dvaCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={selectedDVACategory === cat ? 'category-button active' : 'category-button'}
                        onClick={() => setSelectedDVACategory(cat)}
                      >
                        {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>

                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {filteredDVAItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedDVA(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedDVA(item.id);
                              }
                            }}
                            className={selectedDVA === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedDVAObj} />

                </div>
              </section>
            )}

            {activeSection === 'cdt' && (
              <section id="cdt" className="tab-section">
                <h2>Core Development Tools</h2>
                
                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {cdtItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedCDT(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedCDT(item.id);
                              }
                            }}
                            className={selectedCDT === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedCDTObj} />

                </div>
              </section>
            )}

            {activeSection === 'fl' && (
              <section id="fl" className="tab-section">
                <h2>Frameworks & Libraries</h2>

                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {flItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedFL(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedFL(item.id);
                              }
                            }}
                            className={selectedFL === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedFLObj} />

                </div>
              </section>
            )}

            {activeSection === 'hd' && (
              <section id="hd" className="tab-section">
                <h2>Hosting & Deployment</h2>

                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {hdItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedHD(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedHD(item.id);
                              }
                            }}
                            className={selectedHD === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedHDObj} />

                </div>
              </section>
            )}

            {activeSection === 'ld' && (
              <section id="ld" className="tab-section">
                <h2>Learning & Documentation</h2>

                <div className='column'>

                  {/* Scrollable List */}
                  <div className='scrollmenu'>
                    <ul>
                      {ldItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                            onClick={() => setSelectedLD(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedLD(item.id);
                              }
                            }}
                            className={selectedLD === item.id ? 'active' : ''}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cards */}
                  <ItemCard item={selectedLDObj} />

                </div>
              </section>
            )}
          </main>
        </div>

    {/* Footer Div*/}
      <div>
        <footer>
          <p>© Zeus Angelo Bautista | November 2025</p>
        </footer>
      </div>
    </>
  )
}

export default App

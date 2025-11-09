import React, { useState } from 'react';
import '../CSS/App.css'

function App() {
  const [activeSection, setActiveSection] = useState('uno');

  return (
    <>
    {/* Header Div */}
      <div>
        <header className='header'>

          {/* Pagbati LMAO | Greetings */}
          <div className='greetings'>
            <h3>Welcome to</h3>
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
            {activeSection === 'ai' && (
              <section id="ai" className="tab-section">
                <h2>A.I. & Automation</h2>
              </section>
            )}

            {activeSection === 'va' && (
              <section id="va" className="tab-section">
                <h2>Design & Visual Assets</h2>
              </section>
            )}

            {activeSection === 'cdt' && (
              <section id="cdt" className="tab-section">
                <h2>Core Development Tools</h2>
              </section>
            )}

            {activeSection === 'fl' && (
              <section id="fl" className="tab-section">
                <h2>Frameworks & Libraries</h2>
              </section>
            )}

            {activeSection === 'hd' && (
              <section id="hd" className="tab-section">
                <h2>Hosting & Deployment</h2>
              </section>
            )}

            {activeSection === 'ld' && (
              <section id="ld" className="tab-section">
                <h2>Learning & Documentation</h2>
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

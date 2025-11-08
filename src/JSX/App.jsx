import '../CSS/App.css'
import Aurora from '../JSX/Aurora.jsx';
import SimpleList from '../JSX/SimpleList.jsx';
import { useState } from 'react';

function App() {
  const [activeSection, setActiveSection] = useState('ai');

  return (
    <>

      <div>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div>
        <header>
          {/* Header goes here */}
          <h1>Welcome to Web Tools</h1>
          <h3>Your All-in-One Web Dev Link Library</h3>
        </header>
      </div>

      <div>
            <ul>
              <li><button onClick={() => setActiveSection('ai')} className={activeSection === 'ai' ? 'active' : ''}>A.I.</button></li>
              <li><button onClick={() => setActiveSection('assets')} className={activeSection === 'assets' ? 'active' : ''}>Assets</button></li>
              <li><button onClick={() => setActiveSection('fonts')} className={activeSection === 'fonts' ? 'active' : ''}>Fonts</button></li>
              <li><button onClick={() => setActiveSection('colors')} className={activeSection === 'colors' ? 'active' : ''}>Colors</button></li>
              <li><button onClick={() => setActiveSection('animations')} className={activeSection === 'animations' ? 'active' : ''}>Animations</button></li>
              <li><button onClick={() => setActiveSection('certifications')} className={activeSection === 'certifications' ? 'active' : ''}>Certifications</button></li>
            </ul>
      </div>

      <div className='liquid-glass main-container'>
        <main>
          <section id='ai' className={activeSection === 'ai' ? 'active' : 'hidden'}>
            <h1>A.I. Tools</h1>
            <SimpleList 
              items={[
                'ChatGPT',
                'Gemini',
                'Claude',
                'Copilot',
                'Deepseek'
              ]}
            />
          </section>

          <section id='assets' className={activeSection === 'assets' ? 'active' : 'hidden'}>
            <h1>Assets</h1>
            <p>Add your assets and resources here</p>
          </section>

          <section id='fonts' className={activeSection === 'fonts' ? 'active' : 'hidden'}>
            <h1>Fonts</h1>
            <p>Add your font resources here</p>
          </section>

          <section id='colors' className={activeSection === 'colors' ? 'active' : 'hidden'}>
            <h1>Colors</h1>
            <p>Add your color resources here</p>
          </section>

          <section id='animations' className={activeSection === 'animations' ? 'active' : 'hidden'}>
            <h1>Animations</h1>
            <p>Add your animation resources here</p>
          </section>

          <section id='certifications' className={activeSection === 'certifications' ? 'active' : 'hidden'}>
            <h1>Certifications</h1>
            <p>Add your certification resources here</p>
          </section>
        </main>
      </div>

      <div>
        <footer>

        </footer>
      </div>
      
    </>
  )
}

export default App

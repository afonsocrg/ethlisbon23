import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Logo from './assets/canngov.svg'; // Path to your logo image
import './main.css'; // Assuming you have an external CSS file for additional styling

const App = () => {
  return (
    <div>
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <img src={Logo} alt="Canngov Logo" style={{ maxWidth: '200px' }} />
        <h1>Welcome to Canngov</h1>
        <p>Ensuring integrity in the cannabis supply chain through blockchain technology.</p>
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Link to="/regulator">
          <Button className="customButton">Regulator Access</Button>
        </Link>
        <Link to="/producer">
          <Button className="customButton">Producer Dashboard</Button>
        </Link>
      </div>
      {/* Additional sections here */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f4f4f4' }}>
        <img src={Logo} alt="Canngov Logo" style={{ maxWidth: '100px' }} />
        <p>Canngov - Blockchain-based platform for cannabis regulation and compliance.</p>
        <div>
          {/* Insert links here */}
        </div>
        <div>
          {/* Social media icons here */}
        </div>
      </footer>
    </div>
  );
};

export default App;

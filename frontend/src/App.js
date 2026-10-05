import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import NmassMargin from './pages/NmassMargin';
import  ScenarioMargin from './pages/ScenarioMargin';
import TradesMismatch_v3 from './pages/TradesMismatch_v3';
import TradesMismatch_v4 from './pages/TradesMismatch_v4';
import ReactScenrioMargin from './pages/ReactScenrioMargin';
import StockComparison from './pages/StocksComparison';
import PositionsMismatch from './pages/PositionsMismatch';
import ExcelWatch from './pages/ExcelWatch';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/tradesmismatch' element={<TradesMismatch_v3 />} />
        <Route path='/home' element={<Home />}>
          <Route path='nmassmargin' element={<NmassMargin />} />
          <Route path='scenariomargin' element={<ScenarioMargin />} />
          <Route path='tradesmismatch' element={<TradesMismatch_v3 />} />
          <Route path='tradesmismatch_testing' element={<TradesMismatch_v4 />} />
          <Route path='reactmargin' element={<ReactScenrioMargin />} />
          <Route path='stockcomparison' element={<StockComparison />} />
          <Route path='positionsmismatch' element={<PositionsMismatch />} />
          <Route path='excelwatch' element={<ExcelWatch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
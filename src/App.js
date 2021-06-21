import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch';

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 left-panel">
          <FileSearch title="我的策略"
          onFileSearch={() => {}} />
        </div>
        <div className="col-9 bg-primary right-panel">
          <h1>this is right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;

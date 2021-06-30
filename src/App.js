import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TabList from './components/TabList';
import defaultFiles from "./utils/defaultFiles";

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-6 left-panel">
          <FileSearch
            title="我的策略"
            onFileSearch={(value) => {
              console.log(value);
            }}
          />

          <FileList
            files={defaultFiles}
            onFileClick={(id) => {}}
            onFileDelete={(id) => {}}
            onSaveEdit={(id, newValue) => {
              console.log(id, newValue);
            }}
          />

          <div className="row g-0">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onClick={() => {}}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="Import"
                colorClass="btn-success"
                icon={faFileImport}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="col-6 right-panel">
          <TabList files={defaultFiles} activeId="2" onTabClick={(id)=>{console.log(id);}}/>
        </div>
      </div>
    </div>
  );
}

export default App;

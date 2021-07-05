import { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TabList from './components/TabList';
import defaultFiles from "./utils/defaultFiles";

function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFileID, setActiveFileID] = useState('');
  const [openedFileIDs, setOpenedFileIds] = useState([]);
  const [unsavedFileIDs, setUnSavedFileIDs] = useState([]);
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  });
  const activeFile = files.find(file => file.id === activeFileID);

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
            files={files}
            onFileClick={(id) => { }}
            onFileDelete={(id) => { }}
            onSaveEdit={(id, newValue) => {
              console.log(id, newValue);
            }}
          />

          <div className="row g-0 button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onClick={() => { }}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="Import"
                colorClass="btn-success"
                icon={faFileImport}
                onClick={() => { }}
              />
            </div>
          </div>
        </div>
        <div className="col-6 right-panel">
          {!activeFileID ? (
            <div className="start-page">
              choose or create file
            </div>
          ) : (
            <>
              <TabList files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={(id) => { console.log(id); }}
                onCloseTab={(id) => { console.log('close', id); }}
              />
              <SimpleMDE
                value={activeFile && activeFile.body}
                onChange={(value) => { console.log(value); }}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

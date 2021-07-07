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

  // fileClick
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    // openedFileIDs dont have fileID add
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIds([...openedFileIDs, fileID]);
    }
  };

  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };

  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter(fileID => id !== fileID);

    setOpenedFileIds(tabsWithout);

    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID('');
    }
  };

  const fileChange = (id, value) => {
    const newFiles = files.map(file => {
      if(file.id === id) {
        file.body = value;
      }

      return file;
    });

    setFiles(newFiles);
  };
  
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
            onFileClick={fileClick}
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
                onTabClick={tabClick}
                onTabClose={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => fileChange(activeFile.id, value)}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

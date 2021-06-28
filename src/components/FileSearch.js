import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import useKeyPress from '../hooks/useKeyPress';

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');
  const node = useRef(null);
  // enter
  const enterPressed = useKeyPress(13);
  // esc
  const escPressed = useKeyPress(27);

  const closeSearch = () => {
    setInputActive(false);
    setValue('');
  }

  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value);
    }
    if (escPressed && inputActive) {
      closeSearch();
    }
  });

  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);

  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center">
      {!inputActive && (
        <>
          <span>{title}</span>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </button>
        </>
      )}
      {inputActive && (
        <>
          <input className="col-10" ref={node} value={value} onChange={(e) => { setValue(e.target.value) }}></input>
          <button
            type="button"
            className="icon-button col-2"
            onClick={closeSearch}
          >
            <FontAwesomeIcon 
            title="关闭"
            icon={faTimes} size="lg" />
          </button>
        </>
      )}
    </div>
  );
};

export default FileSearch;
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');
  const node = useRef(null);

  const closeSearch = (e) => {
    e.preventDefault();
    setInputActive(false);
    setValue('');
  }

  useEffect(() => {
    const handleInputEvent = (event) => {
      const { keyCode } = event;
      // enter
      if (keyCode === 13 && inputActive) {
        onFileSearch(value);
      } else if (keyCode === 27 && inputActive) {
        // esc
        closeSearch(event);
      }
    }

    document.addEventListener('keyup', handleInputEvent);
    return () => {
      document.removeEventListener('keyup', handleInputEvent);
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
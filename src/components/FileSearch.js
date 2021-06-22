import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
    <div className="alert alert-primary">
      {!inputActive && (
        <div className="d-flex justify-content-between align-items-center">
          <span>{title}</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}
      {inputActive && (
        <div className="row d-flex">
          <input className="col-8" ref={node} value={value} onChange={(e) => { setValue(e.target.value) }}></input>
          <button
            type="button"
            className="btn btn-primary col-4"
            onClick={closeSearch}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};

export default FileSearch;
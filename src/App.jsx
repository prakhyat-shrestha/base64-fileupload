import { useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import axios from "axios";
import "./App.css";

function App() {
  const [inputList, setInputList] = useState([{ id: uuidV4(),document_type:'1',document_file:'' }]);



  const url = "http://localhost:5000/uploads";
  const createPost = (newPost) => axios.post(url, newPost);

  const createNewPost = async (post) => {
    try {
      await createPost(post);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddFileInput = () => {
    setInputList((prevState) => {
      return [...prevState, { id:uuidV4(),document_type:'1',document_file:'' }];
    });
  };

  const handleRemoveFileInput = (id) => {
    setInputList((prevState) => {
     return prevState.filter((input) => input.id !== id)
    });
  };



  const handleInputChange = (id) => (evt) => {
    const { value } = evt.target;
    setInputList((list) =>
      list.map((el) =>                 // <-- shallow copy array
        el.id === id                   // <-- match by id
          ? {
              ...el,                   // <-- shallow copy element
              [evt.target.name]: value // <-- update key/value
            }
          : el                         // <-- or return current element
      )
    );
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange =  (id) => async (evt) => {
    const { files } = evt.target;
    const file = files[0];

    const base64 = await convertBase64(file);

    //console.log("base 64",base64)

    setInputList((list) =>
      list.map((el) =>                 // <-- shallow copy array
        el.id === id                   // <-- match by id
          ? {
              ...el,                   // <-- shallow copy element
              [evt.target.name]: base64 // <-- update key/value
            }
          : el                         // <-- or return current element
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(createNewPost);
  };



  console.log("zzz",inputList)

  return (
    <>
      <h2>Upload Your Documents</h2>

      <button onClick={handleAddFileInput}>+ Add File </button>

      {inputList.map((x,i) => (
        <div key={x.id}>
          <select value={x.document_type} name="document_type"  onChange={handleInputChange(x.id)}>
            <option value="1">Citizenship</option>
            <option value="2">Passport</option>
            <option value="3">Drivers License</option>
          </select>
          <input type="file" name="document_file" onChange={handleFileChange(x.id)}/>
          <button onClick={() => handleRemoveFileInput(x.id)}>
            Remove
          </button>
        </div>
      ))}

<br/><br/><br/>
      <button onClick={handleSubmit}> Upload Files </button>
    </>
  );
}

export default App;

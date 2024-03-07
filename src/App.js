import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid'
import PrintButton from "./Print";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" element={
          <>
            <TextEditor />
            <PrintButton/>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

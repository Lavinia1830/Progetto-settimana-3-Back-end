import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Posts from './pages/Posts';
import Detail from './pages/Detail';
import Author from './pages/Author';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/posts' element={<Posts/>}/>
          <Route path='/posts/:postId' element={<Detail/>}/>
          <Route path='/users/:authorId' element={<Author/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

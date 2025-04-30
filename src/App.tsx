import { Route, Routes  } from 'react-router-dom'
import { Home } from './pages/Home'
import { Navbar } from './components/Navbar'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostPage } from './pages/PostPage'
import { Comunities } from './pages/Comunities'

function App() {
  return (
   <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
    <Navbar/>
    <div className="container mx-auto px-4 py-6">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create" element={<CreatePostPage/>}/>
        <Route path="/post/:id" element={<PostPage/>}/>
        <Route path="/communities" element={<Comunities/>}/>
      </Routes>
    </div>
   </div>
  )
}

export default App

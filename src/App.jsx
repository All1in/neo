import './styles/App.css'
import NeoList from "./components/NeoList/NeoList.jsx";

const App = () => {
  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
      <NeoList />
    </div>
  )
}

export default App

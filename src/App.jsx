import { useState, useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { LogOut } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('eidsUser')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  if (loading) return <div className="text-center pt-20">Yükleniyor...</div>

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '113465423921534583561'

  if (!user) return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center justify-center min-h-screen bg-blue-600">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">EIDS Yetki Takip</h1>
          <GoogleLogin onSuccess={(res) => {
            const decoded = jwtDecode(res.credential)
            setUser({name: decoded.name, email: decoded.email, picture: decoded.picture})
            localStorage.setItem('eidsUser', JSON.stringify({name: decoded.name, email: decoded.email, picture: decoded.picture}))
          }} />
        </div>
      </div>
    </GoogleOAuthProvider>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6 shadow">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EIDS Yetki Takip</h1>
          <button onClick={() => {setUser(null); localStorage.removeItem('eidsUser')}} className="bg-red-600 px-4 py-2 rounded">Çıkış</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Hoşgeldiniz {user.name}</h2>
          <p className="text-gray-600">Google Sheets API'den veri çekmek için doğru API Key ve Sheet ID gerekli.</p>
          <p className="text-sm mt-4 text-gray-500">Email: {user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default App

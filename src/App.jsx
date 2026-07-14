import { useState, useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { LogOut } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('eidsUser')
    if (savedUser) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const handleGoogleLogin = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      setUser({ name: decoded.name, email: decoded.email, picture: decoded.picture })
      localStorage.setItem('eidsUser', JSON.stringify({ name: decoded.name, email: decoded.email, picture: decoded.picture }))
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('eidsUser')
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '113465423921534583561'

  return !user ? (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
          <h1 className="text-3xl font-bold text-center mb-2">EIDS Yetki Takip</h1>
          <p className="text-center text-gray-600 mb-6">T.C. TICARET BAKANLIGII</p>
          <div className="flex justify-center mb-6"><GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert('Login failed')} /></div>
        </div>
      </div>
    </GoogleOAuthProvider>
  ) : (
    <Dashboard user={user} onLogout={handleLogout} />
  )
}

function Dashboard({ user, onLogout }) {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({ toplam: 0, aktif: 0, biten: 0, iptal: 0 })

  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID || 'EIDS_YETKILER'
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'eids-490310'

  useEffect(() => {
    axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`)
      .then(res => {
        const rows = (res.data.values || []).slice(1)
        setData(rows)
        setStats({ toplam: rows.length, aktif: rows.filter(r => r[4] === 'AKTIF').length, biten: rows.filter(r => r[4] === 'SURE BITTI').length, iptal: rows.filter(r => r[4] === 'IPTAL').length })
      })
      .catch(e => console.error('Error:', e))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
          <div><h1 className="text-3xl font-bold">EIDS Yetki Takip</h1><p className="text-blue-100">T.C. TICARET BAKANLIGII</p></div>
          <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded"><LogOut size={18} /></button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600 text-sm">Toplam</p><p className="text-3xl font-bold">{stats.toplam}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-green-600 text-sm font-semibold">Aktif</p><p className="text-3xl font-bold text-green-800">{stats.aktif}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-red-600 text-sm font-semibold">Biten</p><p className="text-3xl font-bold text-red-800">{stats.biten}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-600 text-sm">Iptal</p><p className="text-3xl font-bold">{stats.iptal}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-sm"><thead className="bg-gray-100"><tr><th className="px-4 py-2">No</th><th className="px-4 py-2">Ad</th><th className="px-4 py-2">Bitis</th><th className="px-4 py-2">Durum</th></tr></thead><tbody>{data.map((r, i) => <tr key={i} className="border-b"><td className="px-4 py-2">{r[0]}</td><td className="px-4 py-2">{r[1]}</td><td className="px-4 py-2">{r[2]}</td><td className="px-4 py-2"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">{r[4]}</span></td></tr>)}</tbody></table>
        </div>
      </main>
    </div>
  )
}

export default App

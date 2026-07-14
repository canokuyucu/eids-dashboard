import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({ toplam: 0, aktif: 0, biten: 0, iptal: 0 })
  const [loading, setLoading] = useState(true)

  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID || 'EIDS_YETKILER'
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'eids-490310'

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`)
      .then(res => res.json())
      .then(res => {
        const rows = (res.values || []).slice(1)
        setData(rows)
        setStats({
          toplam: rows.length,
          aktif: rows.filter(r => r[4] === 'AKTİF').length,
          biten: rows.filter(r => r[4] === 'SÜRE BİTTİ').length,
          iptal: rows.filter(r => r[4] === 'İPTAL').length
        })
        setLoading(false)
      })
      .catch(e => {
        console.error('Error:', e)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">EIDS Yetki Takip</h1>
          <p className="text-blue-100">T.C. TİCARET BAKANLIĞI</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Veriler yükleniyor...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Toplam</p>
                <p className="text-3xl font-bold text-gray-800">{stats.toplam}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-green-600 text-sm font-semibold">Aktif</p>
                <p className="text-3xl font-bold text-green-800">{stats.aktif}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-red-600 text-sm font-semibold">Biten</p>
                <p className="text-3xl font-bold text-red-800">{stats.biten}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">İptal</p>
                <p className="text-3xl font-bold text-gray-800">{stats.iptal}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Yetki Listesi</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">No</th>
                      <th className="px-4 py-2 text-left">Ad</th>
                      <th className="px-4 py-2 text-left">Bitiş Tarihi</th>
                      <th className="px-4 py-2 text-left">Alım Tarihi</th>
                      <th className="px-4 py-2 text-left">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{row[0] || '-'}</td>
                          <td className="px-4 py-2">{row[1] || '-'}</td>
                          <td className="px-4 py-2">{row[2] || '-'}</td>
                          <td className="px-4 py-2">{row[3] || '-'}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              row[4] === 'AKTİF' ? 'bg-green-100 text-green-800' :
                              row[4] === 'SÜRE BİTTİ' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {row[4] || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          Kayıt bulunamadı
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App

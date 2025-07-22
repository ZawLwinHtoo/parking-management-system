import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ParkForm from '../components/ParkForm'
import UnparkTable from '../components/UnparkTable'
import ActiveStatus from '../components/ActiveStatus'
import HistoryTable from '../components/HistoryTable'
import { getActive, getHistory } from '../api/parking'

export default function Dashboard() {
  const [activeList, setActiveList] = useState([])
  const [historyList, setHistoryList] = useState([])

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user.id

  const fetchActive = () => {
    getActive(userId)
      .then(res => setActiveList(res.data))
      .catch(console.error)
  }

  const fetchHistory = () => {
    getHistory(userId)
      .then(res => setHistoryList(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchActive()
    fetchHistory()
  }, [])

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <p>Welcome, {user.fullName || user.username}</p>

        <section>
          <h2>Park My Car</h2>
          <ParkForm
            userId={userId}
            onSuccess={() => { fetchActive(); fetchHistory() }}
          />
        </section>

        <section>
          <h2>Unpark My Car</h2>
          <UnparkTable
            activeList={activeList}
            onUnpark={() => { fetchActive(); fetchHistory() }}
          />
        </section>

        <section>
          <h2>My Active Parking Status</h2>
          <ActiveStatus activeList={activeList} />
        </section>

        <section>
          <h2>My Parking History</h2>
          <HistoryTable historyList={historyList} />
        </section>
      </div>
    </div>
  )
}

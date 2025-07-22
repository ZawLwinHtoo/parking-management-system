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
    // eslint-disable-next-line
  }, [])

  return (
    <div className="bg-dark text-light min-vh-100">
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-secondary text-light shadow p-4 mb-4">
              <h2 className="mb-4 text-center">
                Welcome, <span className="fw-bold">{user.fullName || user.username}</span>
              </h2>

              <section className="mb-4">
                <h4 className="mb-3">Park My Car</h4>
                <ParkForm
                  userId={userId}
                  onSuccess={() => { fetchActive(); fetchHistory() }}
                />
              </section>

              <section className="mb-4">
                <h4 className="mb-3">Unpark My Car</h4>
                <UnparkTable
                  activeList={activeList}
                  onUnpark={() => { fetchActive(); fetchHistory() }}
                />
              </section>

              <section className="mb-4">
                <h4 className="mb-3">My Active Parking Status</h4>
                <ActiveStatus activeList={activeList} />
              </section>

              <section>
                <h4 className="mb-3">My Parking History</h4>
                <HistoryTable historyList={historyList} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

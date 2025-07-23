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
    <div className="bg-dark text-light min-vh-100">
      <Header />
      <div className="container py-4 d-flex flex-column align-items-center">
        <div className="w-100" style={{ maxWidth: '900px' }}>
          <div className="text-center mb-4">
            <h1 className="fw-bold">Parking Dashboard</h1>
            <p className="lead mb-1">
              Welcome, <b>{user.fullName || user.username}</b>
            </p>
          </div>

          <section className="mb-5">
            <h3 className="mb-3">Park Your Car</h3>
            <ParkForm
              userId={userId}
              onSuccess={() => {
                fetchActive()
                fetchHistory()
              }}
            />
          </section>

          <section className="mb-5">
            <h3 className="mb-3">Unpark My Car</h3>
            <UnparkTable
              activeList={activeList}
              onUnpark={() => {
                fetchActive()
                fetchHistory()
              }}
            />
          </section>

          <section className="mb-4">
            <h3 className="mb-3">Active Parking Status</h3>
            <ActiveStatus activeList={activeList} />
          </section>

          <section>
            <h3 className="mb-3">Parking History</h3>
            <HistoryTable historyList={historyList} />
          </section>
        </div>
      </div>
    </div>
  )
}

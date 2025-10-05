import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
  const [filter, setFilter] = useState('all') // 'all', 'current', 'completed', 'cancelled'

  useEffect(() => {
    if (localStorage.getItem('aToken')) {
      getAllAppointments()
    }
  }, [aToken])

  // Filtered appointments based on selected filter
  const filteredAppointments = appointments?.filter(item => {
    if (filter === 'completed') return item.isCompleted
    if (filter === 'cancelled') return item.cancelled
    if (filter === 'current') return !item.cancelled && !item.isCompleted
    return true // all
  })

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-4">
        {['all', 'current', 'completed', 'cancelled'].map(type => (
          <div
            key={type}
            onClick={() => setFilter(type)}
            className={`cursor-pointer px-4 py-1.5 rounded-full border-2 transition-all
              ${filter === type 
                ? 'border-double border-blue-500 bg-blue-50 text-blue-700 font-medium' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[1fr_2fr_2fr_2fr_2fr_1.5fr_0.5fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {filteredAppointments && filteredAppointments.length > 0 ? (
          filteredAppointments.map((item, index) => (
            <div
              className='flex flex-wrap justify-between max-sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-3 border-b hover:bg-gray-50'
              key={index}
            >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" />
                <p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : !item.isCompleted ? (
                <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              ) : (
                <p className='text-green-400 text-xs font-medium'>Complete</p>
              )}
            </div>
          ))
        ) : (
          <p className='m-auto text-gray-500'>No Appointments</p>
        )}
      </div>
    </div>
  )
}

export default AllAppointments

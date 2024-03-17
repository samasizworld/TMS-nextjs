import React from 'react'


const UserDetail = ({ params }: { params: { id: string } }) => {
  const id = params.id
  return (
    <div>UserDetail: {id}</div>
  )
}

export default UserDetail
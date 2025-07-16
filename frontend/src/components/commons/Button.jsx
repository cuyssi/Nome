import React from 'react'

const Button = ({children, className, onClick}) => {
  return (
    <div className={className} onClick={onClick}>{children}</div>
  )
}

export default Button
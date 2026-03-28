import React from 'react'

const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="pb-5">{children}</div>
}

export default PageContainer

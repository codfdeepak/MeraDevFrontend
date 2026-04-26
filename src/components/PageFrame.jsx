function PageFrame({ id, children }) {
  return (
    <div className="page" id={id}>
      <div className="bg glow-a" />
      <div className="bg glow-b" />
      <div className="bg mesh" />
      {children}
    </div>
  )
}

export default PageFrame

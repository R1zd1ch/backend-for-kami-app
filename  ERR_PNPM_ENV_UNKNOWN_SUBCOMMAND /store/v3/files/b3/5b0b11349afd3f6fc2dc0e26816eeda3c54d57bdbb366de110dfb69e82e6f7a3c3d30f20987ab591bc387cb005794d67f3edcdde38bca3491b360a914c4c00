import classNames from "classnames"
import * as React from "react"

interface CardProps {
  highlight: "primary" | "secondary" | "success" | "attention"
}

const Card: React.SFC<CardProps> = ({ children, highlight }) => {
  const cardClasses = classNames("card", {
    [`highlight-${highlight}`]: Boolean(highlight)
  })

  return <div className={cardClasses}>{children}</div>
}

export default Card

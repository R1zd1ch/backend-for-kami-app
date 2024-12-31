import classNames from "classnames"
import * as React from "react"

interface ButtonProps {
  /** Content of the button */
  text: string

  /** Button type */
  type: "normal" | "outline" | "ghost"

  /** Button color */
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "attention"
    | "negative"

  /** Display an arrow? */
  arrow: boolean
}

const RightArrow = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z" />
  </svg>
)

const Button: React.SFC<ButtonProps> = ({ arrow, color, text, type }) => {
  const buttonClasses = classNames("button", {
    [`${type}`]: true,
    [`${color}`]: true,
    arrow
  })
  return (
    <button className={buttonClasses}>
      <span>{text}</span>
      {arrow && RightArrow}
    </button>
  )
}

Button.defaultProps = {
  color: "default",
  type: "normal"
}

export default Button

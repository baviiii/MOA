import * as React from "react"

export const FormFieldContext = React.createContext<{
  name: string
}>({ name: "" })

export const FormItemContext = React.createContext<{
  id: string
}>({ id: "" }) 
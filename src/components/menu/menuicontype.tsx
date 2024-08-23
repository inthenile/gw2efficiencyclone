import { ReactElement } from "react"
import { EndpointType } from "../../endpoints/endpointtype"

export type MenuIcon = {
    element: ReactElement,
    activeState: boolean
    endPoint?: EndpointType,
    subMenu?: ReactElement
}
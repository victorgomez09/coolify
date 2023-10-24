import { PiInfo } from "react-icons/pi"

type Props = {
    text: string
    position?: "top" | "bottom" | "left" | "right"
}

export function Info({ text, position }: Props) {
    return (
        <div className={`tooltip tooltip-${position}`} data-tip={text}>
            <PiInfo />
        </div>
    )
}
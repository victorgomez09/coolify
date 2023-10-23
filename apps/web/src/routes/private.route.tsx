import { auth } from "../constants/auth.constants";
import { useNavigate } from "@esmo/react-utils/router";

type Props = {
    children: JSX.Element
}

export function PrivateRoute({ children }: Props) {
    const navigate = useNavigate('/signin');
    const token = localStorage.getItem(auth.token);

    if (!token) navigate();

    return children;
}
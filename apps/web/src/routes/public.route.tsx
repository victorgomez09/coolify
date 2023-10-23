import { useLocalStorage } from "@esmo/react-utils/hooks";
import { auth } from "../constants/auth.constants";
import { useNavigate } from "@esmo/react-utils/router";

type Props = {
    children: JSX.Element
}

export function PublicRoute({children}: Props) {
    const [token] = useLocalStorage<string>(auth.token, "");
    const navigate = useNavigate('/');

    console.log('token', token)
    if (token) navigate();

    return children;
}
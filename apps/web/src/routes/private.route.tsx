import { useLocalStorage } from "@esmo/react-utils/hooks"
import { auth } from "../constants/auth.constants";
import { useNavigate } from "@esmo/react-utils/router";

type Props = {
    children: JSX.Element
}

export function PrivateRoute({children}: Props) {
    const [token] = useLocalStorage<string>(auth.token, "");
    const navigate = useNavigate('/singin');

    if (!token) navigate();

    return children;
}
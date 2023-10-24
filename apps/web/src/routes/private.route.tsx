import { Redirect } from "@esmo/react-utils/router";

import { Navbar } from "../components/navbar.component";
import { auth } from "../constants/auth.constants";
import { getMe } from "../services/user.service";
import { useUserStore } from "../store/user.store";

type Props = {
    children: JSX.Element
}

export function PrivateRoute({ children }: Props) {
    const { user, setUser } = useUserStore(state => [state.user, state.setUser]);
    const token = localStorage.getItem(auth.token);

    if (!token) return <Redirect href="/signin" />

    if (!user || user.account.email === "") {
        getMe().then((data) => {
            setUser(data);
        });
    }

    return (
        <div className="flex flex-1 flex-col h-full">
            <Navbar />

            <div className="p-2 overflow-auto h-full w-full">
                {children}
            </div>
        </div>
    );
}
import { useUserStore } from "../store/user.store";
import { ThemeSwitcher } from "./theme-switcher.component";

export function Navbar() {
    const { user } = useUserStore(state => [state.user])

    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">viraPaas</a>
            </div>
            <div className="flex-none gap-2">
                <ThemeSwitcher />

                <div className="dropdown dropdown-end ml-2">
                    <label tabIndex={0} className="btn btn-circle avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span>{user.account.email.charAt(0).toUpperCase()}</span>
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
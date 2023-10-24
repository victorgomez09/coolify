import { FormErrors, email, register, required, useForm } from "@esmo/react-utils/forms";
import { useNavigate } from "@esmo/react-utils/router";
import { useMutation } from "@esmo/react-utils/state";

import { Loading } from "../components/loading.component";
import { ThemeSwitcher } from "../components/theme-switcher.component";
import { auth } from "../constants/auth.constants";
import { ILogin } from "../models/auth.model";
import { login } from "../services/auth.service";
import { getMe } from "../services/user.service";
import { useUserStore } from "../store/user.store";

export default function SignInView() {
    const navigate = useNavigate('/');
    // const [_, setToken] = useLocalStorage(auth.token, "");
    const { field, submit, errors, hasError, getError } = useForm<ILogin>({
        onSubmit(values) {
            mutate(values);
        },
        onValidate(values) {
            const formErrors: FormErrors<ILogin> = new Map();
            // Email
            if (required(values.email)) formErrors.set('email', 'Email is required');
            if (email(values.email)) formErrors.set('email', 'Enter a valid email');
            // Password
            if (required(values.password)) formErrors.set('password', 'Password is required');

            return formErrors;
        },
        isValidateAfterTouch: true,
        isValidateOnChange: true
    });
    const { data, error, mutate, isMutating, isSuccess } = useMutation(login);
    const { setUser } = useUserStore(state => [state.user, state.setUser]);

    if (isMutating) return <Loading />;

    if (isSuccess) {
        localStorage.setItem(auth.token, data.token);

        getMe().then((data) => {
            setUser(data);
        }).finally(() => {
            navigate();
        });
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex h-full lg:flex-row flex-col">
                <div className="bg-neutral-focus lg:flex hidden flex-col justify-end p-20 flex-1">
                    <h1 className="title text-neutral-content lg:text-6xl mb-5 border-gradient">Vira Paas</h1>
                    <h3 className="title text-neutral-content">Made self-hosting simple.</h3>
                </div>
                <div className="flex flex-col h-full lg:max-w-2xl">
                    <div className="flex flex-row p-8 items-center space-x-3 justify-between">

                        <div className="icons cursor-pointer" onClick={navigate}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <line x1="5" y1="12" x2="11" y2="18" />
                                <line x1="5" y1="12" x2="11" y2="6" />
                            </svg>
                        </div>
                        <div className="flex flex-row items-center space-x-3">
                            <ThemeSwitcher />
                        </div>
                    </div>
                    <div
                        className="w-full px-10 md:px-20 lg:px-10 xl:px-20 flex flex-col h-full justify-center items-center overflow-auto"
                    >
                        <div className="mb-5 w-full prose prose-neutral">
                            <h1 className="m-0 white">Get access</h1>
                            <h5>Enter the required fields to complete the login.</h5>
                        </div>
                        <form onSubmit={submit} className="flex flex-col pt-4 space-y-3 w-full">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text" placeholder="vira@pass.com" className={`input input-bordered w-full ${hasError("email") ? 'input-error' : ''}`}  {...register(field("email"))} />
                                {hasError("email") && (
                                    <label className="label">
                                        <span className="label-text-alt italic text-error">{getError("email")}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" placeholder="********" className={`input input-bordered w-full ${hasError("password") ? 'input-error' : ''}`}  {...register(field("password"))} />
                                {hasError("password") && (
                                    <label className="label">
                                        <span className="label-text-alt italic text-error">{getError("password")}</span>
                                    </label>
                                )}
                            </div>

                            <div className="flex space-y-3 flex-col pt-3 pb-3">
                                <button type="submit" disabled={errors.size > 0} className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {error && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-error">
                        <span>Oops! Something goes wrong.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
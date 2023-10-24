import { useRouteMatch } from "@esmo/react-utils/router";
import { useQuery } from "@esmo/react-utils/state";
import { PiTrash } from 'react-icons/pi';

import { Loading } from "../components/loading.component";
import { getDestination, getDestinationStatus } from "../services/destinations.service";
import { Destination } from "../models/destination.model";
import { FormErrors, register, required, useForm } from "@esmo/react-utils/forms";
import { useIsomorphicLayoutEffect } from "@esmo/react-utils/hooks";

type DestinationForm = {
    name: string;
    engine: string;
    network: string;
    ip: string;
    user: string;
    port: number;
    ssh: string;
    useProxy: boolean;
}

export default function DestinationsView() {
    const { params } = useRouteMatch()!;
    const { data, error, isLoading, isSuccess } = useQuery<{ destination: Destination }>(["get-destination"], () => getDestination(params.id!))
    const { data: statusData, error: statusError, isLoading: statusIsLoading } = useQuery<{ isRunning: boolean }>(["get-destination-status", data?.destination.id], () => getDestinationStatus(params.id!), {
        autoFetchEnabled: !!data?.destination.id
    });
    const { field, hasError, getError, errors, submit, setValues, getValue } = useForm<DestinationForm>({
        onValidate: (values) => {
            const formErrors: FormErrors<DestinationForm> = new Map();

            if (required(values.name)) formErrors.set("name", "Name cannot be empty");

            return formErrors;
        },
        isValidateAfterTouch: true,
        isValidateOnChange: true
    })

    useIsomorphicLayoutEffect(() => {
        if (data)
            setValues({
                name: data.destination.name,
                engine: data.destination.engine,
                network: data.destination.network,
                ip: data.destination.remoteIpAddress,
                user: data.destination.remoteUser,
                port: data.destination.remotePort,
                ssh: data.destination.sshKey.name,
                useProxy: data.destination.isCoolifyProxyUsed
            })
    }, [data, isSuccess])


    if (isLoading || statusIsLoading) return <Loading />;

    return (
        <div className="flex flex-col flex-1 px-4">
            <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center">
                    <span className="font-semibold text-2xl">{data?.destination.name}</span>
                    <div className={`badge ${statusData?.isRunning ? 'badge-success' : 'badge-error'} badge-sm ml-2`}></div>
                </div>

                <div>
                    <div className="tooltip tooltip-primary tooltip-left" data-tip="Delete">
                        <button className="btn btn-ghost btn-primary">
                            <PiTrash />
                        </button>
                    </div>

                    <div className="tooltip tooltip-primary tooltip-left" data-tip="Force delete">
                        <button className="btn bg-transparent text-red-500">
                            <PiTrash />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 mt-10">
                <div className="flex flex-1 items-center justify-between">
                    <h2 className="font-semibold">Configurations</h2>

                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-info">Save</button>
                        {data?.destination.remoteEngine ? (
                            <button className="btn btn-sm">Verify Docker Remote Engine</button>
                        ) : (
                            <button className="btn btn-sm btn-error">Force restart proxy</button>
                        )}
                    </div>
                </div>

                <form className="mt-10">
                    <div className="grid gap-2 grid-cols-2 auto-rows-max items-center">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" className="input input-bordered w-full" {...register(field("name"))} />
                        {hasError("name") && (
                            <label className="label">
                                <span className="label-text-alt">{getError("name")}</span>
                            </label>
                        )}

                        {!data?.destination.remoteEngine && (
                            <>
                                <label className="label">
                                    <span className="label-text">Engine</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" disabled {...register(field("engine"))} />
                            </>
                        )}

                        <label className="label">
                            <span className="label-text">Network</span>
                        </label>
                        <input type="text" className="input input-bordered w-full" disabled {...register(field("network"))} />

                        {data?.destination.remoteEngine && (
                            <>
                                <label className="label">
                                    <span className="label-text">IP Adress</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" disabled {...register(field("ip"))} />

                                <label className="label">
                                    <span className="label-text">User</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" disabled {...register(field("user"))} />

                                <label className="label">
                                    <span className="label-text">Port</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" disabled {...register(field("port"))} />

                                <label className="label">
                                    <span className="label-text">SSH</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" disabled {...register(field("ssh"))} />
                            </>
                        )}

                        <label className="label">
                            <span className="label-text">Use proxy?</span>
                        </label>
                        <input type="checkbox" className="toggle !toggle-success" disabled={data?.destination.remoteEngine} checked={data?.destination.isCoolifyProxyUsed} />
                    </div>
                </form>
            </div>

            {(error || statusError) && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-error">
                        <span>Oops! Something goes wrong.</span>
                    </div>
                </div>
            )}
        </div>
    )
}
import { useState } from "react";
import { useRouteMatch } from "@esmo/react-utils/router";
import { useMutation, useQuery, useQueryMagic } from "@esmo/react-utils/state";
import { FormErrors, register, required, useForm } from "@esmo/react-utils/forms";
import { useIsomorphicLayoutEffect } from "@esmo/react-utils/hooks";
import { PiTrash } from 'react-icons/pi';

import { Loading } from "../components/loading.component";
import { changeDestinationSettings, forceDestinationProxyRestart, getDestination, getDestinationStatus, startDestinationProxy, stopDestinationProxy as stopDestinationProxy, updateDestination } from "../services/destinations.service";
import { Destination } from "../models/destination.model";
import { Info } from "../components/info.component";
import { Setting } from "../models/setting.model";

type DestinationForm = {
    name: string;
    engine?: string;
    network: string;
    ip?: string;
    user?: string;
    port?: number;
    ssh?: string;
    useProxy: boolean;
}

export default function DestinationsView() {
    const { params } = useRouteMatch()!;
    const { invalidateQuery, getQueryData, setQueryData, cancelQuery } = useQueryMagic();
    const { data, error, isLoading, isSuccess } = useQuery<{ destination: Destination, settings: Setting }>(["get-destination"], () => getDestination(params.id!))
    const { data: statusData, error: statusError, isLoading: statusIsLoading } = useQuery<{ isRunning: boolean }>(["get-destination-status", data?.destination.id], () => getDestinationStatus(params.id!), {
        autoFetchEnabled: !!data?.destination.id
    });
    const { mutate: changeSettingsMutate } = useMutation<{ id: string, isCoolifyProxyUsed: boolean, engine: string }>(changeDestinationSettings);
    const { mutate: stopProxyMutate } = useMutation<{ id: string, engine: string }>(stopDestinationProxy, {
        async onMutate() {
            const prevDest = getQueryData(`get-destination`);
            await cancelQuery(`get-destination`);
            await cancelQuery("get-destination-status");
            setQueryData(`get-destination`, (old: Destination) => ({ ...old, isCoolifyProxyUsed: data!.destination.isCoolifyProxyUsed }));
            setQueryData(`get-destination-status`, () => ({ isRunning: true }));

            return { prevDest };
        },
        onError(_err, _newDest, context) {
            setQueryData(`get-destination`, context.prevDest);
            setQueryData(`get-destination-status`, () => ({ isRunning: true }));
        },
        onSettled() {
            invalidateQuery(`get-destination`);
            invalidateQuery(`get-destination-status`);
            setStopProxyToast(true);
        }
    });
    const { mutate: startProxyMutate } = useMutation<{ id: string, engine: string }>(startDestinationProxy, {
        async onMutate() {
            const prevDest = getQueryData(`get-destination`);
            // Cancel ongoing network request if it exists. So that there will not be like data conflicts due to optimistic update.
            await cancelQuery(`get-destination`);
            await cancelQuery("get-destination-status");
            // Users will see immediate result before acutal mutation begins
            setQueryData(`get-destination`, (old: Destination) => ({ ...old, isCoolifyProxyUsed: data!.destination.isCoolifyProxyUsed }));
            setQueryData("get-destination-status", () => ({ isRunning: true }))
            // return context object
            return { prevDest };
        },
        onError(_err, _newDest, context) {
            // consumes context returned from onMutate callback. If mutation failed, set previous pets.
            setQueryData(`get-destination`, context.prevDest);
            setQueryData(`get-destination-status`, () => ({ isRunning: false }));
        },
        onSettled() {
            invalidateQuery(`get-destination`);
            invalidateQuery(`get-destination-status`);
            setStartProxyToast(true);
        }
    });
    const { mutate: restartProxyMutate } = useMutation<{ id: string, engine: string, fqdn: string }>(forceDestinationProxyRestart, {
        async onMutate() {
            const prevDest = getQueryData(`get-destination`);
            // Cancel ongoing network request if it exists. So that there will not be like data conflicts due to optimistic update.
            await cancelQuery(`get-destination`);
            // Users will see immediate result before acutal mutation begins
            setQueryData(`get-destination`, (old: Destination) => ({ ...old, isCoolifyProxyUsed: data!.destination.isCoolifyProxyUsed }));
            // return context object
            return { prevDest };
        },
        onError(_err, _newDest, context) {
            // consumes context returned from onMutate callback. If mutation failed, set previous pets.
            setQueryData(`pets`, context.prevDest);
        },
        onSettled() {
            invalidateQuery(`get-destination`);
            setStartProxyToast(true);
        }
    });
    const { mutate: destinationMutate } = useMutation<{ id: string, destination: Destination }>(updateDestination, {
        // async onMutate() {
        //     const prevDest = getQueryData(`get-destination`);
        //     await cancelQuery(`get-destination`);
        //     setQueryData(`get-destination`, (old: Destination) => ({ ...old, isCoolifyProxyUsed: data!.destination.isCoolifyProxyUsed }));

        //     return { prevDest };
        // },
        // onError(_err, _newDest, context) {
        //     console.log('err', _err)
        //     setQueryData(`get-destination`, context.prevDest);
        // },
        // onSettled() {
        //     invalidateQuery(`get-destination`);
        // }
    });
    const { field, hasError, getError, setValues, submit } = useForm<DestinationForm>({
        onValidate: (values) => {
            const formErrors: FormErrors<DestinationForm> = new Map();

            if (required(values.name)) formErrors.set("name", "Name cannot be empty");

            return formErrors;
        },
        onSubmit: (values) => {
            data!.destination.name = values.name;
            console.log('destination', data!.destination)
            destinationMutate({
                id: params.id!,
                destination: { ...data!.destination }
            });
        },
        isValidateAfterTouch: true,
        isValidateOnChange: true
    });
    const [startProxyToast, setStartProxyToast] = useState<boolean>(false);
    const [stopProxyToast, setStopProxyToast] = useState<boolean>(false);

    useIsomorphicLayoutEffect(() => {
        if (data) {
            if (data.destination.remoteEngine) {
                setValues({
                    name: data.destination.name,
                    network: data.destination.network,
                    ip: data.destination.remoteIpAddress,
                    user: data.destination.remoteUser,
                    port: data.destination.remotePort,
                    ssh: data.destination.sshKey.name,
                    useProxy: data.destination.isCoolifyProxyUsed
                })
            } else {
                setValues({
                    name: data.destination.name,
                    engine: data.destination.engine,
                    network: data.destination.network,
                    useProxy: data.destination.isCoolifyProxyUsed
                })
            }
        }
    }, [data, isSuccess])

    const changeProxySetting = async () => {
        const isProxyActivated = data?.destination.isCoolifyProxyUsed;
        if (isProxyActivated) {
            const sure = confirm(
                `Are you sure you want to ${data?.destination.isCoolifyProxyUsed ? 'disable' : 'enable'
                } Coolify proxy? It will remove the proxy for all configured networks and all deployments on '${data!.destination.engine
                }'! Nothing will be reachable if you do it!`
            );
            if (!sure) return;
        }
        data!.destination.isCoolifyProxyUsed = !data!.destination.isCoolifyProxyUsed;
        try {
            changeSettingsMutate({
                id: params.id!,
                isCoolifyProxyUsed: data!.destination.isCoolifyProxyUsed,
                engine: data!.destination.engine
            });
            if (isProxyActivated) {
                await stopProxy();
            } else {
                await startProxy();
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const stopProxy = async () => {
        try {
            stopProxyMutate({ id: params.id!, engine: data!.destination.engine });
        } catch (error) {
            console.log('error', error)
        }
    }
    const startProxy = async () => {
        try {
            startProxyMutate({
                id: params.id!,
                engine: data!.destination.engine
            });
            console.log('started')
        } catch (error) {
            console.log('error', error)
        }
    }
    const forceRestartProxy = async () => {
        const sure = confirm("Are you sure you want to restart the proxy? Everything will be reconfigured in ~10 secs.");
        if (sure) {
            try {
                restartProxyMutate({
                    id: params.id!,
                    engine: data!.destination.engine,
                    fqdn: data!.settings.fqdn
                })
            } catch (error) {
                console.log('error', error)
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            }
        }
    }

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
                <form className="mt-4" onSubmit={submit}>
                    <div className="flex flex-1 items-center justify-between">
                        <h2 className="font-semibold">Configurations</h2>

                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-info" type="submit">Save</button>
                            {data?.destination.remoteEngine ? (
                                <button className="btn btn-sm">Verify Docker Remote Engine</button>
                            ) : (
                                <button className="btn btn-sm btn-error" onClick={forceRestartProxy}>Force restart proxy</button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2 grid-cols-2 auto-rows-max items-center mt-10">
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
                            <span className="label-text">
                                Use proxy?
                                <Info position="right" text="This will install a proxy on the destination to allow you to access your applications and services without any manual configuration" /></span>
                        </label>
                        <input type="checkbox" className="toggle !toggle-success" disabled={data?.destination.remoteEngine} checked={data?.destination.isCoolifyProxyUsed} onChange={changeProxySetting} />
                    </div>
                </form>
            </div>

            {/* TOASTS */}
            {(startProxyToast || stopProxyToast) && (
                <div className="toast toast-top toast-center cursor-pointer" onClick={() => {
                    if (startProxyToast) setStartProxyToast(!startProxyToast)
                    else setStopProxyToast(!stopProxyToast)
                }}>
                    <div className="alert alert-info">
                        <span>{startProxyToast ? "Vira Paas proxy started" : "Vira Paas proxy stopped"}</span>
                    </div>
                </div>
            )}

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
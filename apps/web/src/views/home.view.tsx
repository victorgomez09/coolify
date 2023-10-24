import { useQuery } from "@esmo/react-utils/state"
import { getResources } from "../services/resources.service"

import { Loading } from "../components/loading.component"
import { Resource } from "../models/resource.model"
import { useUserStore } from "../store/user.store"
import { Link } from "@esmo/react-utils/router"

export default function HomeView() {
    const { data, error, isFetching, isLoading } = useQuery<Resource>("get-resources", getResources)
    const { user } = useUserStore(state => [state.user])

    if (isFetching || isLoading) return <Loading />

    return (
        <div className="flex flex-col p-2">
            <div className="flex flex-1 items-center justify-between">
                <h2 className="font-semibold text-2xl">Dashboard</h2>
            </div>

            {/* DESTINATIONS */}
            <div className="flex flex-col">
                <div className="flex items-center mt-10">
                    <h1 className="title lg:text-3xl">Destinations</h1>
                </div>

                <div className="divider" />
                {data?.destinations.length ? (
                    <div
                        className="grid grid-col gap-4 md:gap-8 auto-cols-max grid-cols-1 md:grid-cols-2 lg:md:grid-cols-3 xl:grid-cols-4 p-4 "
                    >
                        {data.destinations.map((destination, index) => (
                            <Link className="no-underline mb-5" to={`/destinations/${destination.id}`} key={index}>
                                <div
                                    className="w-full rounded p-5 bg-neutral hover:bg-info hover:text-info-content indicator duration-150 cursor-pointer"
                                >
                                    <div className="w-full flex flex-row">
                                        <div className="absolute top-0 left-0 -m-5 h-10 w-10">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="absolute top-0 left-0 -m-2 h-12 w-12 text-sky-500"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path
                                                    d="M22 12.54c-1.804 -.345 -2.701 -1.08 -3.523 -2.94c-.487 .696 -1.102 1.568 -.92 2.4c.028 .238 -.32 1.002 -.557 1h-14c0 5.208 3.164 7 6.196 7c4.124 .022 7.828 -1.376 9.854 -5c1.146 -.101 2.296 -1.505 2.95 -2.46z"
                                                />
                                                <path d="M5 10h3v3h-3z" />
                                                <path d="M8 10h3v3h-3z" />
                                                <path d="M11 10h3v3h-3z" />
                                                <path d="M8 7h3v3h-3z" />
                                                <path d="M11 7h3v3h-3z" />
                                                <path d="M11 4h3v3h-3z" />
                                                <path d="M4.571 18c1.5 0 2.047 -.074 2.958 -.78" />
                                                <line x1="10" y1="16" x2="10" y2="16.01" />
                                            </svg>
                                            {destination.remoteEngine && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="absolute top-0 left-9 -m-2 h-6 w-6 text-sky-500 rotate-45"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="3"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                                    <path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
                                                    <path d="M6.343 12.343a8 8 0 0 1 11.314 0" />
                                                    <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col">
                                            <h1 className="font-bold text-base truncate">{destination.name}</h1>
                                            <div className="h-10 text-xs">
                                                {(user.account.teams && user.account.teams[0].id === '0' && destination.remoteVerified === false && destination.remoteEngine) && (
                                                    <h2 className="text-red-500">Not verified yet</h2>
                                                )}
                                                {(destination.remoteEngine && !destination.sshKeyId) && (
                                                    <h2 className="text-red-500">SSH key missing</h2>
                                                )}
                                                {(destination.teams.length > 0 && destination.teams[0]?.name) && (
                                                    <div className="truncate">{destination.teams[0]?.name}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>Nothing here.</p>
                )}
            </div>

            {error && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-error">
                        <span>Oops! Something goes wrong.</span>
                    </div>
                </div>
            )}
        </div>
    )
}
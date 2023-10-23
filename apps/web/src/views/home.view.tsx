import { useQuery } from "@esmo/react-utils/state"
import { getResources } from "../services/resources.service"
import { Loading } from "../components/loading.component"
import { Resource } from "../models/resource.model"
import { Link } from "@esmo/react-utils/router"
import { getMe } from "../services/user.service"

export default function HomeView() {
    const { data: userData, error: userError, isFetching: userFetching, isLoading: userLoading } = useQuery<User>("get-me", getMe)
    const { data: resourcesData, error: resourcesError, isFetching: resourcesFetching, isLoading: resourcesLoading } = useQuery<Resource>("get-resources", getResources)

    if (userFetching || userLoading || resourcesFetching || resourcesLoading) return <Loading />

    return (
        <div className="flex flex-col p-2">
            <div
                className="grid grid-col gap-8 auto-cols-max grid-cols-1 md:grid-cols-2 lg:md:grid-cols-3 xl:grid-cols-4 p-4 "
            >
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Destinations</div>
                        <div className="stat-value">{resourcesData?.destinations.length}</div>
                        <div className="stat-desc">All Docker destinations</div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-1 left-1 h-12 w-12 text-sky-500"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                    </div>
                </div>
            </div>
        </div>
    )
}
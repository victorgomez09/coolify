import { Destination } from "./destination.model"
import { Setting } from "./setting.model"

export interface Resource {
    foundUnconfiguredApplication: boolean,
    foundUnconfiguredDatabase: boolean,
    foundUnconfiguredService: boolean,
    applications: [],
    databases: [],
    services: [],
    gitSources: [],
    destinations: Destination[],
    settings: Setting
}
import { EndpointType } from "../endpointtype";

export const accountInfo: EndpointType = {
    url: "/v2/account",
    keyReq: true
}

export const wizVaultDaily: EndpointType = {
    url: "/v2/account/wizardsvault/daily",
    keyReq: true
}

export const worldBosses: EndpointType = {
    url: "/v2/account/worldbosses",
    keyReq: true
}
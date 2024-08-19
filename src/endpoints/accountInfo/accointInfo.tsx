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

export const bankInfo: EndpointType = {
    url: "/v2/account/bank",
    keyReq: true
}

export const walletInfo: EndpointType = {
    url: "/v2/account/wallet",
    keyReq: true
}

export const sharedInventoryInfo: EndpointType = {
    url: "/v2/account/inventory",
    keyReq: true
}

export const guildInfo: EndpointType = {
    url: "/v2/guild/",
    keyReq: true
}
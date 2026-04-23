/**
 * Barrel: named axios instances (same idea as multiple `AxiosInstance*Service` exports).
 * Prefer importing the default from each `*Client.ts` file for tree-shaking clarity.
 */

// A single entry point for all the 4 axios instances for the application.
import dummyJsonClient from "@/services/axios/dummyJsonClient";
import weatherClient from "@/services/axios/weatherClient";
import stocksClient from "@/services/axios/stocksClient";
import reqresClient from "@/services/axios/reqresClient";

export const axiosInstanceDummyJson = dummyJsonClient;
export const axiosInstanceWeather = weatherClient;
export const axiosInstanceStocks = stocksClient;
export const axiosInstanceReqres = reqresClient;

export { dummyJsonClient, weatherClient, stocksClient, reqresClient };

export { createClient } from "@/services/axios/createClient";

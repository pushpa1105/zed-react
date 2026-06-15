import type { PanaType } from "@/types"

export type StoreStatus = 'loading' | 'succeed' | 'failed';

export type NormalizePanas = Record<string, PanaType>;
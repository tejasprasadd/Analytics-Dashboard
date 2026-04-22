export interface FreeApiStockItem {
  Name: string;
  Symbol: string;
  ListingDate: string; // e.g. "06-Oct-08"
  ISIN: string;
  MarketCap: string; // e.g. "₹ 621 Cr."
  CurrentPrice: string; // e.g. "₹ 176"
  HighLow: string; // e.g. "₹ 201 / 62.8"
  StockPE: string; // can be "" when missing
  BookValue: string; // can be "" / formatted currency string
  DividendYield: string; // e.g. "0.42 %", can be "0.00 %", can be "%"
  ROCE: string; // e.g. "19.3 %", can be "%"
  ROE: string; // e.g. "15.3 %", can be "%"
  FaceValue: string; // formatted currency string, sometimes "₹"
}

export interface FreeApiStocksPage {
  page: number;
  limit: number;
  totalPages: number;
  previousPage: boolean;
  nextPage: boolean;
  totalItems: number;
  currentPageItems: number;
  data: FreeApiStockItem[];
}

export interface FreeApiStocksResponse {
  statusCode: number;
  data: FreeApiStocksPage;
  message: string;
  success: boolean;
}


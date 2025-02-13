import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>우리동네 의안찾기</title>
        <meta name="description" content="전국 지방의회 의안을 검색하고 분석할 수 있는 서비스입니다." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📃</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

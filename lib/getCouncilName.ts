import councilsData from "@/public/data/councils_list.json";

// councilCode를 기반으로 councilName을 찾는 함수
export const getCouncilName = (code: string): string | null => {
  for (const region of Object.keys(councilsData) as Array<keyof typeof councilsData>) {
    const councils = councilsData[region]; // 지역별 의회 리스트

    for (const council of councils) {
      if (council.code === code) {
        return council.council; // 일치하는 이름 반환
      }
    }
  }
  return null; // 찾지 못한 경우
};

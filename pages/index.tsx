import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { pretendard } from "@/lib/fonts";
import NetworkGraph from "@/components/NetworkGraph";
import WordCloud from "@/components/WordCloud";
import { getCouncilName } from "@/lib/getCouncilName";
import { Button } from "@/components/ui/button";
import KeywordFreq from "@/components/keywordsFreq";
import BillListNoSearch from "@/components/BillListNoSearch";

export default function Home() {
  const router = useRouter();

  return (
    <div className={pretendard.variable + "w-full max-w-[100vw] flex flex-col bg-[#d2d0cc]"}>
      <div className="flex flex-col">
        <section className="pb-[400px]">
          <div className="flex w-full">
            <div className="w-1/3 mx-auto pt-10 flex flex-col items-center">
              <img src="./image/logo2.png"/>
              <p className="text-2xl font-bold p-2">데이터 사이언스와 저널리즘 아카데미 Project5 - 임광섭</p>
              <Button 
                className="mx-auto bg-[#132133] text-xl p-6" 
                onClick={() => router.push("/visualizationPage")}
              >
                상세 시각화 페이지로 바로 이동하기
              </Button>
            </div>
            <div className="w-1/2 h-1/2 pt-20 mr-5">
              <WordCloud code='000ALL' />
            </div>
          </div>
        </section>
        <div className="w-full max-w-[1000px] px-4 mx-auto">

          <section className="pl-10 pr-20 pb-[100px]">
            <h1 className="text-5xl font-bold underline underline-offset-[10px] mb-[10px] pb-5">Part1. 왜 지방의회 의안인가?</h1>
            <p className="mb-6 text-xl">4년마다 치러지는 전국동시지방선거는 선거운동과 여론조사, 방송사의 선거보도로 뜨거운 관심을 받는다. 그러나 개표가 끝난 후,  어느 ‘당’이 이겼는지 결정되면 선출된 지방의원들이 구성하는 지방의회에 대한 관심은 급격히 줄어든다. 직전 2022년 지방선거에서 자신이 뽑은 지방의회 의원이 누구인지 기억하는 사람이 얼마나 될까? 더 나아가, 지방의회가 어떤 의안을 발의하고 어떤 정책을 수행하는지 알고 있는 사람은 더욱 드물다.</p>
            <figure className="flex flex-col items-center mb-6">
              <img src="/image/election.png" className="w-full max-w-3xl px-20"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                2022년 SBS 지방선거 개표방송 (출처: 스브스 뉴스)
              </figcaption>
            </figure>
            <p className="mb-6 text-xl">그러나 지방의회는 지방자치의 핵심 기관으로서 중요한 역할을 수행한다. 주민 대표 기관으로서 주민의 의견과 이익을 지방 정책에 반영하여 지역 발전과 주민의 복지 증진을 위한 정책을 수립하고 추진한다. 또한 지방자치단체의 법령이라고 할 수 있는 조례를 제정, 개정, 폐지하고 지방자치단체의 한 해 예산을 심의, 확정한다. 국회에서 다루는 의안만큼은 아닐지라도, 지방의회의 결정은 우리 삶에 직접적인 영향을 미친다. 오히려 국회보다 더 현실적이고 생활에 밀접한 정책을 추진하는 곳이 지방의회일지도 모른다.</p>
            <p className="mb-6 text-xl">이렇게 중요한 지방의회에 대한 관심이 부족한 상황은 분명히 문제다. 일부는 지방의정 활동에 관심을 가지지만, 대부분의 시민이 지방의회 홈페이지에서 의안과 회의록을 일일이 찾아보는 것은 현실적으로 어렵다. 지방의회에 대한 무관심은 주민들이 자신의 목소리를 낼 창구를 스스로 무시하는 것이며, 결과적으로 지방의회의 정책이 주민의 의견을 제대로 반영하는지 감시하기 어려운 상황을 만든다. </p>
            <p className="mb-6 text-xl">이에 따라 본 기사는 전국 지방의회의 의안을 수집하고 분석하여, 각 지방의회가 어떤 분야에 관심을 갖고 어떤 정책을 추진해왔는지를 한눈에 살펴볼 수 있도록 하고자 한다. 더 많은 사람들이 지방의회의 의정에 관심을 갖고 지켜볼 수 있을 때 비로소 지방의회가 주민들의 목소리를 더욱 반영하여 주민을 대표하는 기관이 될 수 있을 것이다.</p>
            <p className="mb-6 text-xl"></p>
          </section>

          <section className="pl-10 pr-20 pb-[100px]">
            <h1 className="text-5xl font-bold underline underline-offset-[10px] mb-[10px] pb-5">Part2. 키워드로 본 지방의회</h1>
            <p className="mb-6 text-xl">지방의회 의안은 국회지방의회의정포털(<a href="https://clik.nanet.go.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                https://clik.nanet.go.kr/
              </a>)을 통하여 수집하였으며, 2020년부터 2024년까지 최근 5년간 발의된 의안 중 가결된 의안을 대상으로 했다.(가결(원안), 가결(수정), 가결(대안), 의결(원안), 의결(수정), 승인, 동의, 채택, 기타 등 포함) 수집 항목은 의안 제목, 의안 제안일, 의안 종류로 한정했다.</p>
            <p className="mb-6 text-xl">수집 결과 전국 243개의 지방의회 중 208개의 지방의회에서 총 16만 8,500건의 의안을 수집하였다. 일부 의안이 누락된 지방의회는 자체 사이트에서 의안을 제공하는 경우가 있으나 이번 분석에서는 제외하였다. </p>
            <p className="mb-6 text-xl">수집 데이터의 기초적인 통계는 다음과 같다.</p>
            <figure className="flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl">
                <img src="/image/graph_bill_type.png" className="w-full"/>
                <img src="/image/graph_local_council.png" className="w-full"/>
              </div>
              <img src="/image/graph_bill_years.png" className="w-full max-w-3xl px-10 mt-4"/>
            </figure>

            <p className="mb-6 text-xl">의안 종류로는 조례안이 과반을 차지하였으며, 연도 별로는 매년 3만 건 내외가 존재했다. 지역 별로는 제주특별자치도 의회가 3089건으로 가장 많은 의안이 있었으며, 세종특별자치시 의회(2084건), 경상남도 창원시 의회(1488)가 뒤를 이었다.</p>
            <p className="mb-6 text-xl">이렇게 수집된 의안에서 키워드를 추출하기 위해 바른(<a href="https://bareun.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              https://bareun.ai/
              </a>)의 AI 모델 기반 형태소 분석기를 활용했다. 조사, 어미, 접두사, 접미사 등을 제외하고 명사, 동사, 형용사 위주의 키워드를 선별했다. 또한, 의정 활동 자체와 관련된 용어(조례, 의결 등), 지나치게 포괄적인 용어는 제외했다.</p>
            <p className="mb-6 text-xl">분석 결과, 총 22404개의 키워드를 추출할 수 있었다. 빈도수 상위 30개의 단어는 다음과 같다.</p>
            <KeywordFreq/>
            <p className="mt-6 mb-6 text-xl">가장 많은 빈도수를 기록한 ‘사업’이라는 키워드가 포함된 의안은 총 7036개였으며, 각 의회별로 재개발사업, 어촌뉴딜300사업 등 다양한 사업이 논의된 것으로 나타났다.</p>
            <BillListNoSearch initialKeyword="사업" councilName="전국"/>
            <p className="mt-6 mb-6 text-xl">어촌뉴딜300 사업은 2018년부터 시작된 전국 어촌의 선착장 등 필수기반시설을 현대화하고, 어촌과 어항 통합개발을 추진하는 사업으로 고창군뿐만 아니라 광양시, 보령시, 서산시, 제주특별자치도 등 여러 지역에서 진행이 되었음을 확인할 수 있었다.</p>
            <BillListNoSearch initialKeyword="어촌뉴딜300" councilName="전국"/>
            <p className="mt-6 mb-6 text-xl">또한, ‘재난’ 관련 의안은 1,210건이었으며, 폭설과 폭우 피해에 따른 특별재난지역 선포 결의안이 다수 포함되어 있었다. 그 외에도 재난취약계층 지원, 재난관리기금 등의 의안도 찾아볼 수 있다.</p>
            <BillListNoSearch initialKeyword="재난" councilName="전국"/>
            <p className="mt-6 mb-6 text-xl">더 자세히 ‘특별재난지역’이라는 키워드로 검색한 결과, 2024년과 2023년 폭우로 피해를 본 대전, 전북, 충청 등의 지방의회에서 피해자 및 유가족 지원을 위한 세금 감면 정책을 시행한 것으로 확인되었다.</p>
            <BillListNoSearch initialKeyword="특별재난지역" councilName="전국"/>
          </section>

          <section className="pl-10 pr-20 pb-[100px]">
            <h1 className="text-5xl font-bold underline underline-offset-[10px] mb-[10px] pb-5">Part3. 워드클라우드로 본 지방의회 의안</h1>
            <p className="mb-6 text-xl">분석 결과를 더욱 효과적으로 표현하기 위해 워드 클라우드를 이용하였다. 워드클라우드는 자주 등장하는 단어일수록 더 크게 표시되어 한눈에 어떤 주제가 중요한지 파악 가능한 시각화 기법이다. 각 지방의회 별로 빈도수 상위 100개의 키워드를 뽑아 각 지방의회의 주요 관심사를 시각적으로 표현했다.</p>
            <p className="mb-6 text-xl">서울시 노원구의 워드 클라우드를 보면 ‘아동’, ‘청년’, ‘청소년’, ‘교육’, ‘보호’ 등이 두드러지는 모습을 보이는데, 학교, 학원 등이 밀집해 있어 25년 1월 기준 아동, 청소년 인구수가 서울시 3위를 기록할 정도로 유소년층이 많이 거주하는 지역적 특성을 반영하고 있다. ‘장애인’, ‘복지’ 등 유소년층 뿐만 아니라 사회적 약자 전반에 대한 지원과 복지에 관련된 키워드가 크게 나타나는 것도 눈여겨볼만한 점이었다.</p>
            <figure className="flex flex-col items-center">
              <WordCloud code="002010"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                서울특별시 노원구 의회 워드클라우드
              </figcaption>
            </figure>
            <p className="mt-6 mb-6 text-xl">부산광역시 사하구 의회를 보면 ‘정비’가 가장 두드러졌다. ‘정비’가 포함된 의안은 주로 재개발사업 정비계획에 관한 의안 제목이 많았다. 부산은 사하구뿐만 아니라 동래구, 부산진구, 수영구 등에서 ‘정비’ 키워드가 두드러지게 나타났으며 역시 재개발 관련 의안이 주를 이루었다. 부산시는 별도의 정비사업 통합홈페이지를 운영할 정도로 재개발 및 정비사업이 활발하게 이루어지고 있기 때문에 이러한 특징이 워드 클라우드로 반영된 것으로 보인다.</p>
            <figure className="flex mb-6 flex-col items-center">
              <WordCloud code="051011"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                부산광역시 사하구 의회 워드클라우드
              </figcaption>
            </figure>
            <BillListNoSearch initialKeyword="정비" councilName="부산광역시 사하구 의회"/>
          </section>

          <section className="pl-10 pr-20 pb-[100px]">
            <h1 className="text-5xl font-bold underline underline-offset-[10px] mb-[10px] pb-5">Part4. 네트워크로 본 지방의회 의안</h1>
            <p className="mb-6 text-xl">단순 빈도 분석을 넘어, 하나의 의안 제목에서 같이 나타난 키워드 간 관계를 표현하기 위해 네트워크 분석을 적용했다. 각 키워드는 정점으로, 두 개의 키워드가 동시에 등장하는 경우 간선으로 연결했다. 정점의 크기는 키워드의 빈도수를, 간선의 굵기는 같이 등장하는 빈도수를 나타낸다. 다른 정점과 연결된 간선의 개수가 가장 많은 100개의 정점(키워드)을 추출하여 시각화하였다.</p>
            <p className="mb-6 text-xl">전라남도 함평군 의회의 워드 클라우드를 먼저 봤을 때는 ‘의사 일정’, ‘윤리’, ‘안전’ 등의 키워드가 두드러지지만 경향성을 쉽게 파악하기 어렵다.</p>
            <figure className="flex flex-col items-center">
              <WordCloud code="061021"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                전라남도 함평군 의회 워드클라우드
              </figcaption>
            </figure>
            <p className="mt-6 mb-6 text-xl">그러나 네트워크 그래프를 보면 ‘후쿠시마’, ‘오염수’, ‘방류’ 등 예전에 이슈가 되었던 후쿠시마 원전 오염수 방류 관련 의안들이 있었음을 알 수 있고, ‘인구’, ‘균형’, ‘소멸’ 등 함평군이 인구 소멸 위기에 처해있음을 추정해볼 수 있었다. 실제로 함평군은 행정안전부에 의해 인구감소지역으로 지정된 89개의 시군구 중 하나이다.</p>
            <figure className="flex flex-col items-center">
              <NetworkGraph code="061021"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                전라남도 함평군 의회 네트워크 그래프(상호작용이 가능합니다)
              </figcaption>
            </figure>
            <p className="mt-6 mb-6 text-xl">같은 전라남도에 위치한 장흥군 의회 역시 후쿠시마 원전 오염수 방류 관련 키워드를 확인할 수 있었다. 한편, 쌀 과잉 공급으로 인한 가격 폭락 등을 짐작할 수 있는 키워드도 존재했다.</p>
            <figure className="flex flex-col items-center">
              <NetworkGraph code="061019"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                전라남도 장흥군 의회 네트워크 그래프(상호작용이 가능합니다)
              </figcaption>
            </figure>
            <p className="mt-6 mb-6 text-xl">서울시 도봉구 의회의 네트워크 그래프에서는 수도권 광역급행철도인 GTX-C 관련 키워드를 확인할 수 있었다. 관련 의안이 발의된 것은 착공 전인 2022년으로, 노선 중 도봉에 있는 창동역 구간을 지하노선으로 추진할 것을 결의하는 내용이었다. 이후 2023년 5월, 창동역 구간이 지하화로 결론 내려졌다. 결의안의 목표대로 진행된 것이다.</p>
            <figure className="flex flex-col items-center">
              <NetworkGraph code="002011"/>
              <figcaption className="mt-2 text-gray-600 text-center text-md">
                서울특별시 도봉구 의회 네트워크 그래프(상호작용이 가능합니다)
              </figcaption>
            </figure>
            <p className="mt-6 mb-6 text-xl">도봉구 의회는 서울에 위치한 지방의회에는 다소 어색할 수 있는 ‘일본’, ‘노역’, ‘군함’ 등의 키워드가 나타나기도 하였는데, 도봉구 의회가 가결한 의안 중 ‘일본’이라는 키워드로 검색한 결과, 도봉구 의회는 독도 영유권, 후쿠시마 오염수, 군함도와 사도광산 유네스코 지정 등의 이슈에 결의안을 다수 의결한 것을 볼 수 있었다.</p>
            <BillListNoSearch initialKeyword="일본" councilName="서울특별시 도봉구 의회"/>
            <p className="mt-6 mb-6 text-xl">사도광산 유네스코 지정 이슈와 관련해서는 도봉구 외에도 전라북도 임실군, 정읍시, 전라북도 전주시, 광주광역시 등이 결의안을 의결한 것 또한 확인할 수 있었다. 이를 통해 지방의회가 외교적인 이슈에 대해서도 의견을 표명하는 상황이 적지 않음을 볼 수 있었다.</p>
            <BillListNoSearch initialKeyword="사도광산" councilName="전국"/>
          </section>

          <section className="pl-10 pr-20 pb-[10px]">
            <h1 className="text-5xl font-bold underline underline-offset-[10px] mb-[10px] pb-5">Part5. 앞으로의 “우리동네 의안찾기”</h1>
            <p className="mt-6 mb-6 text-xl">지금까지 구성한 분석 및 시각화 측면에서 몇몇 한계가 존재한다. 우선 국회지방의회의정포털에서의 수집 과정이 모든 의안을 수집하는데 실패했다는 점이다. 아예 누락된 지방의회도 있었으며, 매우 적은 의안만 수집된 의회도 존재했다. 대부분의 지방의회에는 별도의 사이트를 통해 개별적으로 의안 정보를 제공하고 있기 때문에 더 정확한 분석과 시각화를 위해서 추가 수집이 필요</p>
            <p className="mt-6 mb-6 text-xl">또한 자연어 텍스트 특성 상 형태소 분석이 완벽하게 되지 않는다.  AI 모델 기반의 최대한 자연스러운 형태소 분석을 시도했으나, 여전히 완벽한 키워드 추출은 불가능했다. 띄어쓰기가 제대로 되지 않아 ‘부산광역시동래구’가 제대로 필터링되지 않고 표시되거나, ‘수시안’이 ‘수’와 ‘시안’으로 분리되는 문제 등이 있었다. 10만 건이 넘는 의안 분석을 일일이 형태소로 분리하고 키워드를 추출하는 것은 현실적 제약이 있기 때문에 더 정교한 형태소 분석 도구가 필요할 것이다.</p>
            <p className="mt-6 mb-6 text-xl">네트워크 시각화는 제목이 매우 긴 의안에서 여러 개의 키워드가 추출되었을 경우, 서로를 연결하기 때문에 다른 의안보다 과도하게 대표되는 문제가 있었다. 결과적으로 제목이 긴 의안이 더 잘 표현될 경향성이 있는 것이다. 이를 방지하기 위해서는 길이에 대한 가중치에 대한 고려가 필요하며, 이에 따라 새로운 시각화 데이터가 만들어질 것이다.</p>
            <p className="mt-6 mb-6 text-xl">무엇보다 키워드의 빈도수를 기반으로 한 분석의 유효성은 확실하지 않다. 단순히 관련 의안을 많이 발의했다고 그 의제가 중요한 것은 아니기 때문이다. 그렇기에 본 기사의 시각화는 참고용으로 이용하고, 이를  기반으로 빈도수뿐만 아니라 관련 사업, 정책에 투입되는 인력, 예산, 기간 등을 다각적으로 고려하여 분석해야할 것이다.</p>
            <p className="mt-6 mb-6 text-xl">전국에는 총 243개의 지방의회가 존재하기 때문에 지금까지 소개한 시각화는 그 일부에 지나지 않는다. 거주하는 지역이나 관심 있는 지역의 의안을 직접 확인하고 시각화를 볼 수 있도록 별도의 시각화 페이지를 준비해두었기 때문에 더 많은 유용한 정보와 분석이 기대된다.</p>
          </section>
          <div className="flex flex-col justify-center items-center mt-6 mb-10">
            <Button 
              className="bg-[#132133] text-xl p-6 mb-5" 
              onClick={() => router.push("/visualizationPage")}
            >
              상세 시각화 페이지로 이동하기
            </Button>
            <Button 
              className="bg-[#132133] text-xl p-6" 
              onClick={() => window.open("https://github.com/endermaru/DSJA_Project4", "쏘쓰")}
            >
              소스 코드 페이지로 이동하기
            </Button>
          </div>

        </div>

        {/* 오른쪽 시각화 영역
        <div className="w-1/2 sticky top-2 p-1 h-[calc(100vh-2rem)] flex flex-col">
          <Tabs value={visualizations[activeIndex].name}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold px-2">{councilName}</h1>
            </div>

            <div className="relative">
              {visualizations.map((viz, index) => (
                <div key={viz.name} className={activeIndex === index ? "block" : "hidden"}>
                  {viz.component}
                </div>
              ))}
            </div>
          </Tabs>
        </div> */}
      </div>
    </div>
  );
}

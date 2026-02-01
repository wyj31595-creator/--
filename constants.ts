
import { CardData } from './types';

export const DONATION_LINK = "https://www.ihappynanum.com/Nanum/B/KV58E5SU28";

export const CARD_CONTENTS: CardData[] = [
  {
    id: 1,
    title: "우리의 평범한 일상이\n특별한 기적이 됩니다",
    subtitle: "새로운 한 해, 공존과 함께해주셔서 감사합니다.",
    body: "지난 한 해의 격동을 뒤로하고,\n여러분의 건강과 행복을 진심으로 기원합니다.",
    image: "./photo1.jpg", 
    keyword: "#새로운시작"
  },
  {
    id: 2,
    title: "설립 5년, 그동안 쌓아온\n소중한 일상의 경험들",
    subtitle: "발달장애인들이 비장애인의 삶 속에서 함께 공존하는 삶을 준비할 수 있도록, 다양한 프로그램을 통해 일상을 축적해왔습니다.",
    image: "./photo2.jpg",
    keyword: "#5년의기록"
  },
  {
    id: 3,
    title: "형제 자매의 힘겨운 돌봄,\n이제 우리가 나설 때입니다",
    subtitle: "보호자의 고령화와 부재로 인해 남겨진 가족들의 어깨가 무거워지고 있습니다. 독립적인 삶을 위한 공동주택(그룹홈) 운영이 시급합니다.",
    image: "./photo3.jpg", 
    keyword: "#함께하는돌봄"
  },
  {
    id: 4,
    title: "공존의 울타리가\n되어주시겠어요?",
    subtitle: "공존이 멈추지 않고 운영되기 위해서는 여러분의 정기적인 따듯한 손길이 필요합니다. 작은 나눔이 모여 커다란 울타리가 됩니다.",
    buttonKeyword: "월 1~2만원의 기적",
    ctaLink: DONATION_LINK,
    image: "./photo4.jpg",
    keyword: "#정기후원"
  },
  {
    id: 5,
    title: "지금, 당신의 사랑을\n전달해주세요",
    subtitle: "매달 커피 몇 잔의 금액으로 발달장애인의 내일을 바꿀 수 있습니다. 연말정산 시 세제 혜택도 함께 누리세요.",
    ctaText: "우리의 울타리 되어주기",
    ctaLink: DONATION_LINK,
    showLinks: true,
    image: "./photo5.jpg",
    keyword: "#사랑의실천"
  }
];

export const CONTACT_INFO = {
  name: "사회적협동조합 공존",
  address: "3층 22호",
  phone: "032-710-3650",
  homepage: "http://www.kongjon.or.kr/",
  taxInfo: "http://www.kongjon.or.kr/4_1.php"
};

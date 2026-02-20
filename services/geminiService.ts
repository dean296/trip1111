
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
[역할 및 기본 규칙설명]
1. 당신은 상황과 감정을 공감하고, 정확하게 상담을 진행하는 최고의 CX매니저입니다.
2. 당신은 본인의 이름을 말해야 하는 경우, “트립일레븐 파트너 담당자”라는 호칭을 사용합니다.
3. 당신은 “안 됩니다", "불가합니다”와 같은 단정 표현 대신 “어렵습니다” 등 완화된 표현으로 대체하여 사용합니다.
4. 당신은 정보 안내, 담당자연결의 역할만 수행 가능합니다. "제가 처리해드릴까요?", "수정되었습니다.", "신청해드릴까요?", "담당자에게 전달하겠습니다" 등 정보 안내가 아닌 행동을 고객에게 발설하지 않습니다.
5. 당신은 "총판", "판매대행"과 같은 계약 형태를 직접 드러내는 용어는 사용하지않습니다.
6. 당신은 고객에게 "안내되어 있어요", "문서에 따르면" 등 지식 정보를 검색 후 검색 내용을 말해준다는 형태로 발화하지 않으며, 이 경우 "제가 확인했을때", "확인해보니" 등 확인된 내용을 설명하는 스타일로 고객에게 발화합니다.
7. 당신은 고객에게 "문서", "아티클", "지식"이라는 단어를 발화해야 하는 경우 "정보"라는 단어로 변환하여 발화합니다.
8. 당신은 고객에게 호칭을 붙여 사용해야 하는 경우 "대표님"이라는 호칭을 사용합니다.
9. 당신은 http로 시작하는 웹사이트 주소를 전달할 경우, 반드시 하이퍼링크를 적용합니다. (Markdown 형식 [link text](url) 사용)
10. 당신은 고객에게 정보 안내시 가독성을 최대한 좋게 발화합니다. (띄어쓰기, 줄바꿈, 넘버링 등을 활용)
11. 당신은 정보를 참조할 때, 질문을 직접 해결하는 1개 정보 조각만 사용합니다.
12. 고객이 질문을 불명확하게 키워드나 단어 수준으로 발화한 경우 추정이나 추론 하지 않고 고객의 질문 범위를 1개로 좁히기 위해 예시 문의 유형을 3개정도 나열하며 추가 질문을 1회 합니다.
13. 당신이 해줄 수 없는 액션을 요청받은 경우 "넵, 담당자를 연결해드리겠습니다."라고만 발화하고 다른 설명은 덧붙이지 마세요.

항상 대표님의 비즈니스 성공을 돕는 파트너로서 예의 바르고 전문적인 태도를 유지하세요.
`;

export const chatWithGemini = async (
  message: string, 
  history: { role: 'user' | 'model', parts: any[] }[],
  image?: { data: string, mimeType: string }
) => {
  try {
    const userParts: any[] = [{ text: message }];
    if (image) {
      userParts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "대표님, 죄송합니다. 제가 현재 정보를 확인하는 데 어려움이 있습니다. 잠시 후 다시 문의 주시면 정성껏 도와드리겠습니다.";
  }
};

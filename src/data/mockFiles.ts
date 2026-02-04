import { FileTab } from "../stores/useEditorStore";

export const mockFiles: Record<string, FileTab> = {
  // ===== 인물 =====
  characters: {
    id: "characters",
    fileName: "인물",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "이 소설에 등장하는 주요 인물들의 목록과 간단한 설명",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "민수 - 50대 초반의 서점 주인. 2년 전 아내를 잃고 혼자 서점을 운영하고 있다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "수진 - 고등학생 소녀. 6개월째 매일 서점을 찾아와 책을 읽는다. 민수에게 변화를 가져다주는 인물.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "예린 - 수진의 친구. 수진에게서 시를 듣고 감동받아 서점을 찾아온다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "중년 여성 - 조카를 통해 시집 소식을 듣고 찾아온 손님. 재출판을 제안한다.",
      },
    ],
  },

  "char-minsu": {
    id: "char-minsu",
    fileName: "민수",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "주인공. 내면의 변화가 핵심 서사.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "민수는 50대 초반의 남성으로, '책과 시간'이라는 작은 서점의 주인이다. 매일 아침 9시에 문을 열고, 저녁이 되면 책장을 정리하고 문을 닫는 일상을 반복한다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "2년 전 아내를 잃었다. 아내는 시인이었고, 생전에 '당신에게 닿기를'이라는 시집을 자비 출판했다. 단 100부만 제작되었으며, 민수는 아내가 떠난 후 단 한 권도 팔지 못했다.",
      },
      {
        kind: "content",
        vcsState: "modified",
        content:
          "수진을 만나면서 조금씩 변화한다. 아내의 시가 누군가에게 위로가 될 수 있다는 것을 깨닫고, 마침내 시집을 세상에 내놓기로 결심한다.",
      },
      {
        kind: "memo",
        vcsState: "default",
        content: "후반부에서 아내의 2권 원고를 발견하는 장면 추가 고려",
      },
    ],
  },

  "char-sujin": {
    id: "char-sujin",
    fileName: "수진",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "변화의 촉매제 역할. 왜 서점에 오는지 배경 설명 필요.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "수진은 고등학생 소녀로, 6개월째 매일 같은 시간에 '책과 시간' 서점을 찾는다. 교복 차림으로 항상 창가 옆 낡은 소파에 앉아 책을 읽는다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "책을 사지 않고 읽기만 한다. 주로 시집이나 에세이를 읽으며, 가끔 눈물을 흘리거나 작은 미소를 짓기도 한다. 민수는 그녀의 이름도, 어느 학교에 다니는지도 모른 채 지켜봐왔다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "어느 날 처음으로 민수에게 말을 건다. 아내의 시집 '당신에게 닿기를'을 사겠다고 한다. 민수에게 시집을 선물받은 후, 친구 예린에게 시를 읽어주고, 작은 독서 모임을 이끈다.",
      },
    ],
  },

  "char-yerin": {
    id: "char-yerin",
    fileName: "예린",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "조연. 시의 확산을 보여주는 첫 번째 사례.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "예린은 수진의 친구로, 수진에게서 아내의 시를 듣고 감동받아 서점을 찾아온다. 수줍은 성격이지만, 시에 대한 진심어린 관심을 보인다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "이후 두 명의 남학생과 함께 창가 소파를 중심으로 작은 독서 모임을 형성한다. 서점에 다시 웃음소리가 돌아오게 하는 데 기여한다.",
      },
    ],
  },

  // ===== 사건 =====
  events: {
    id: "events",
    fileName: "사건",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "주요 사건들의 목록. 각 사건이 서사에 미치는 영향 정리.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "시집 구매 시도 - 수진이 처음으로 민수에게 말을 걸며 아내의 시집을 사려고 한다. 민수의 과거가 드러나는 계기.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "시집 선물 - 민수가 수진에게 시집을 무료로 선물하며, 시를 누군가에게 전해달라고 부탁한다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "독서 모임 형성 - 수진과 예린을 시작으로 학생들이 모여 작은 독서 모임이 만들어진다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "재출판 결심 - 중년 여성의 방문을 계기로 민수가 아내의 시집 재출판을 결심한다.",
      },
    ],
  },

  "event-poem-purchase": {
    id: "event-poem-purchase",
    fileName: "시집 구매 시도",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "첫 번째 전환점. 민수의 내면이 처음으로 드러나는 장면.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "6개월간 말없이 책만 읽던 수진이 처음으로 민수에게 말을 건다. '아저씨, 이 책 살게요.' 손에 든 것은 먼지 쌓인 시집이었다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "민수가 바코드 스캐너를 들다가 멈칫한다. 가격표에는 '비매품'이라고 적혀 있었다. 파란색 표지 위에 손글씨로 적힌 제목 '당신에게 닿기를'. 아내가 생전에 자비 출판한 시집이었다.",
      },
      {
        kind: "content",
        vcsState: "modified",
        content:
          "민수는 아내가 세상을 떠난 후 2년간 단 한 권도 팔지 못했다. 팔 수가 없었다. 하지만 수진 앞에서 그는 말문이 막힌다.",
      },
    ],
  },

  "event-gift": {
    id: "event-gift",
    fileName: "시집 선물",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "민수의 첫 번째 변화. 시집을 '보내주는' 행위.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "'이건... 제 아내가 쓴 시집입니다.' 민수가 조심스럽게 말했다. 수진의 눈이 커졌다. '그럼 더 사야 해요. 이 시를 읽으면서 제가 얼마나 위로받았는지 모르실 거예요.'",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "민수는 처음으로 미소 지었다. 아내가 떠난 지 2년, 그는 마침내 이 서점을 닫을 이유를 찾지 못했다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "수진이 지갑을 꺼내지만 민수는 손을 젓는다. '가져가세요. 돈은 받을 수 없습니다.' 대신 한 가지 부탁을 한다. 시가 누군가에게 위로가 될 수 있도록 이야기해달라고.",
      },
    ],
  },

  // ===== 구성 요소 =====
  structure: {
    id: "structure",
    fileName: "구성 요소",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "5단 구성으로 서사 전개. 현재 전개 단계까지 작성 완료.",
      },
      {
        kind: "content",
        vcsState: "default",
        content: "발단 - 민수와 서점, 그리고 수진의 등장. 일상의 묘사.",
      },
      {
        kind: "content",
        vcsState: "default",
        content: "전개 - 수진이 시집을 사려 하고, 민수가 선물한다. 독서 모임 형성.",
      },
      {
        kind: "content",
        vcsState: "added",
        content: "위기 - (계획) 서점 폐업 위기 또는 민수의 건강 문제 등장.",
      },
      {
        kind: "content",
        vcsState: "added",
        content: "절정 - (계획) 아내의 2권 원고 발견, 재출판 결심.",
      },
      {
        kind: "content",
        vcsState: "added",
        content: "결말 - (계획) 시집 재출판, 서점의 새로운 시작.",
      },
    ],
  },

  // 발단
  intro: {
    id: "intro",
    fileName: "발단",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "세계관과 인물 소개. 민수의 일상과 수진의 등장.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "민수의 서점 '책과 시간'을 소개한다. 주변 가게들이 카페나 편의점으로 바뀌어버린 골목에서 유일하게 남은 서점. 민수는 매일 아침 9시에 문을 연다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "6개월째 매일 찾아오는 고등학생 소녀 수진을 묘사한다. 책을 사지 않고 읽기만 하는 그녀를 민수는 조용히 지켜본다.",
      },
    ],
  },

  "intro-01": {
    id: "intro-01",
    fileName: "(01)",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "서점과 민수 소개. 분위기 설정에 집중.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "낡은 간판이 삐걱거리며 바람에 흔들렸다. '책과 시간'이라는 이름의 서점은 이 골목에서 유일하게 남은 옛것이었다. 주변의 모든 가게들이 카페나 편의점으로 바뀌어버린 지금, 민수는 여전히 매일 아침 9시에 문을 열었다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "오늘도 어김없이 첫 손님은 고등학생 소녀였다. 교복 차림의 그녀는 항상 같은 자리, 창가 옆 낡은 소파에 앉아 책을 읽었다. 민수는 그녀의 이름도, 어느 학교에 다니는지도 몰랐지만, 벌써 6개월째 매일 같은 시간에 그녀를 보고 있었다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "처음에는 단순히 손님이라 생각했다. 하지만 한 달이 지나고, 두 달이 지나면서 그녀가 책을 사지 않는다는 것을 알게 되었다. 그저 읽을 뿐이었다. 보통의 서점 주인이라면 눈살을 찌푸렸을 테지만, 민수는 오히려 안심했다. 적어도 한 명은 여전히 책을 읽고 있구나.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "소녀가 읽는 책들은 주로 시집이나 에세이였다. 가끔은 눈물을 훔치기도 했고, 가끔은 작은 미소를 짓기도 했다. 민수는 그 모습을 보며 자신이 왜 아직도 이 서점을 지키고 있는지 조금씩 이해하게 되었다.",
      },
    ],
  },

  // 전개
  development: {
    id: "development",
    fileName: "전개",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "갈등의 시작과 관계 형성. 민수의 과거가 드러남.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "수진이 처음으로 민수에게 말을 건다. 아내의 시집을 사려고 하고, 민수는 과거를 고백하며 시집을 선물한다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "수진이 친구 예린에게 시를 전하고, 작은 독서 모임이 형성된다. 서점에 다시 웃음소리가 돌아온다.",
      },
    ],
  },

  "development-01": {
    id: "development-01",
    fileName: "(01)",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "첫 대화와 시집 구매 시도. 민수의 과거 공개.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "'아저씨, 이 책 살게요.' 소녀가 처음으로 말을 걸어왔다. 손에 든 것은 먼지 쌓인 시집이었다. 민수는 놀라서 바코드 스캐너를 들다가 멈칫했다. 그 책의 가격표에는 '비매품'이라고 적혀 있었다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "소녀의 손에 들린 파란색 표지, 그 위에 손글씨로 적힌 제목 '당신에게 닿기를'. 민수의 심장이 뛰기 시작했다. 이 책은 아내가 생전에 자비 출판한 시집이었고, 단 100부만 만들어진 것 중 서점에 남은 마지막 한 권이었다.",
      },
      {
        kind: "content",
        vcsState: "modified",
        content:
          "민수는 아내가 세상을 떠난 후 단 한 권도 팔지 않았다. 팔 수가 없었다. 하지만 지금, 이 소녀 앞에서 그는 말문이 막혔다.",
      },
      {
        kind: "content",
        vcsState: "default",
        content:
          "'이건... 제 아내가 쓴 시집입니다.' 민수가 조심스럽게 말했다. 소녀의 눈이 커졌다. '그럼 더 사야 해요. 이 시를 읽으면서 제가 얼마나 위로받았는지 모르실 거예요.'",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "민수는 처음으로 미소 지었다. 아내가 떠난 지 2년, 그는 마침내 이 서점을 닫을 이유를 찾지 못했다. 소녀에게 책을 건네며, 그는 내일도 문을 열어야겠다고 생각했다.",
      },
    ],
  },

  "development-02": {
    id: "development-02",
    fileName: "(02)",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "시집 선물과 부탁. 수진의 이름이 밝혀짐.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "소녀는 가방에서 지갑을 꺼냈지만, 민수는 손을 저었다. '가져가세요. 돈은 받을 수 없습니다.' 소녀가 당황한 표정을 지었다. '하지만...'",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "'대신 한 가지 부탁이 있어요.' 민수가 말했다. '그 시집을 읽고, 누군가에게 이야기해주세요. 시가 당신에게 해준 것처럼, 누군가에게도 위로가 될 수 있도록요.'",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "소녀는 고개를 끄덕이며 책을 가슴에 안았다. 그리고 문을 나서기 전, 뒤돌아서며 말했다. '저는 수진이에요. 내일도 와도 될까요?' 민수는 웃으며 대답했다. '물론이죠. 당신만의 자리는 항상 여기 있을 거예요.'",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "수진이 떠난 후, 서점은 다시 고요해졌다. 민수는 아내의 사진이 걸린 벽을 바라보았다. 사진 속 아내는 여전히 환하게 웃고 있었다. '여보, 오늘 당신의 시가 한 사람을 구했어요.' 그가 작은 목소리로 중얼거렸다.",
      },
    ],
  },

  "development-03": {
    id: "development-03",
    fileName: "(03)",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "하루의 마무리. 서점의 의미를 깨닫는 장면.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "저녁이 되어 서점 문을 닫을 시간이 되었다. 민수는 평소처럼 책장을 정리하고, 창가의 소파에 놓인 쿠션을 가지런히 했다. 내일 수진이가 앉을 자리였다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "그리고 그는 깨달았다. 이 서점은 단순히 책을 파는 곳이 아니었다. 누군가의 피난처였고, 위로의 공간이었으며, 이야기가 살아 숨 쉬는 곳이었다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "밖으로 나와 간판을 올려다보았다. '책과 시간'. 민수는 처음으로 그 이름의 의미를 제대로 이해했다. 책은 시간을 담고, 시간은 책 속에서 영원해진다. 아내가 떠났어도 그녀의 시는 여전히 누군가를 위로하고 있었다. 그리고 이 서점은, 그 시간들이 만나는 장소였다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "민수는 주머니에서 열쇠를 꺼내 문을 잠갔다. 내일 아침 9시, 그는 다시 이 문을 열 것이다.",
      },
    ],
  },

  // 위기
  crisis: {
    id: "crisis",
    fileName: "위기",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "아직 작성되지 않음. 서점 폐업 위기 또는 민수의 건강 문제 등 고려.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 독서 모임이 커지면서 서점이 활기를 되찾지만, 건물주의 재개발 통보 또는 민수의 건강 문제가 등장한다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 수진과 학생들이 서점을 지키기 위해 움직이기 시작한다. SNS에 시와 서점 이야기가 퍼진다.",
      },
    ],
  },

  // 절정
  climax: {
    id: "climax",
    fileName: "절정",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "아직 작성되지 않음. 가장 극적인 순간.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 민수가 아내의 작업실에서 2권 원고를 발견한다. 아내가 계획했던 두 번째 시집의 존재를 알게 된다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 출판사에서 연락이 온다. SNS에서 화제가 된 시집의 재출판을 제안한다.",
      },
    ],
  },

  // 결말
  ending: {
    id: "ending",
    fileName: "결말",
    blocks: [
      {
        kind: "memo",
        vcsState: "default",
        content: "아직 작성되지 않음. 새로운 시작을 암시하는 결말.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 아내의 시집이 재출판되고, 서점은 '시가 있는 서점'으로 새롭게 시작한다.",
      },
      {
        kind: "content",
        vcsState: "added",
        content:
          "(계획) 민수는 더 이상 과거에 갇혀있지 않다. 아내의 시는 많은 사람들에게 전해지고, 서점은 그 시간들이 만나는 장소로 남는다.",
      },
    ],
  },
};

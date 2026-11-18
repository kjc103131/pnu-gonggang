import React, { useState, useEffect, useMemo } from 'react';

const PLACES = [
  '정문(부산대역·NC백화점)',
  '경영관',
  '문창회관',
  '새벽벌도서관',
  '학생회관',
  '건설관',
  '제1공학관',
  '제6공학관(컴공)',
  '물리관',
  '수학관',
  '화학관',
  '생물관',
  '자연과학관',
  '약학관',
  '생활환경관',
  '금정회관',
  '상남국제회관',
  '중앙도서관',
  '법학관',
  '인문관',
  '사회관',
  '예술관',
  '북문(장전역 방향)',
];

const UPPER_CAMPUS = new Set([
  '중앙도서관',
  '법학관',
  '인문관',
  '사회관',
  '예술관',
  '상남국제회관',
  '약학관',
  '생활환경관',
]);
const LOWER_CAMPUS = new Set([
  '정문(부산대역·NC백화점)',
  '경영관',
  '문창회관',
  '새벽벌도서관',
  '학생회관',
  '건설관',
  '제1공학관',
  '제6공학관(컴공)',
]);

const COORDS = {
  '정문(부산대역·NC백화점)': { x: 0, y: 0 },
  경영관: { x: 1, y: 1 },
  문창회관: { x: 2, y: 1 },
  새벽벌도서관: { x: 3, y: 1 },
  학생회관: { x: 2, y: 2 },
  건설관: { x: 2, y: 3 },
  제1공학관: { x: 3, y: 3 },
  '제6공학관(컴공)': { x: 3, y: 4 },
  자연과학관: { x: 4, y: 2 },
  물리관: { x: 4, y: 3 },
  수학관: { x: 4, y: 4 },
  화학관: { x: 5, y: 2 },
  생물관: { x: 5, y: 1 },
  금정회관: { x: 5, y: 3 },
  약학관: { x: 5, y: 4 },
  생활환경관: { x: 6, y: 1 },
  상남국제회관: { x: 6, y: 2 },
  중앙도서관: { x: 6, y: 4 },
  법학관: { x: 7, y: 3 },
  인문관: { x: 7, y: 4 },
  사회관: { x: 8, y: 4 },
  예술관: { x: 8, y: 5 },
  '북문(장전역 방향)': { x: 9, y: 3 },
};

function calcWalkTime(src, dst, useBus = true) {
  if (!src || !dst || src === dst || src === '제자리' || dst === '제자리')
    return 0;
  const p1 = COORDS[src] || { x: 4, y: 2 };
  const p2 = COORDS[dst] || { x: 4, y: 2 };
  const dist = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  const uphill = Math.max(0, p2.x - p1.x) * 0.75;
  const walk = Math.max(2, Math.round(dist * 1.25 + uphill));
  if (
    useBus &&
    ((LOWER_CAMPUS.has(src) && UPPER_CAMPUS.has(dst)) ||
      (UPPER_CAMPUS.has(src) && LOWER_CAMPUS.has(dst)))
  ) {
    return Math.min(walk, 7);
  }
  return walk;
}

const DEFAULT_TIMETABLE = [
  { id: 101, day: '수', subject: '일반물리학', end: '13:50', place: '물리관' },
  {
    id: 102,
    day: '수',
    subject: '미분적분학',
    start: '15:00',
    end: '16:15',
    place: '수학관',
  },
  { id: 103, day: '목', subject: '일반화학', end: '11:50', place: '화학관' },
  {
    id: 104,
    day: '목',
    subject: '대학영어',
    start: '13:00',
    end: '14:15',
    place: '인문관',
  },
];

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    name: '문창회관 GS25 삼김+컵라면 15분 컷',
    spot: '문창회관 1층 편의점',
    mapQuery: '부산대학교 문창회관',
    purpose: '식사',
    duration: 15,
    place: '문창회관',
    wait: 3,
    plan: [
      '결제 및 온수 붓기 (4분)',
      '빠른 취식 (9분)',
      '뒷정리 및 물 한 잔 (2분)',
    ],
    reason:
      '물리관·수학관·공대 연강 사이 25분밖에 없을 때 가장 안전하게 허기를 채우는 루틴입니다.',
  },
  {
    id: 2,
    name: '정문 앞 이삭토스트·봉구스 테이크아웃',
    spot: '부산대 정문 건너편',
    mapQuery: '부산대 정문 이삭토스트',
    purpose: '식사',
    duration: 22,
    place: '정문(부산대역·NC백화점)',
    wait: 5,
    plan: [
      '주문 및 조리 대기 (6분)',
      '벤치/강의실 이동 후 취식 (12분)',
      '정리 (4분)',
    ],
    reason:
      '식당 줄 설 시간은 없지만 갓 구운 따뜻한 한 끼가 간절할 때 실패 없는 선택입니다.',
  },
  {
    id: 3,
    name: '새벽벌 1층 카페 베이글 & 아아 브런치',
    spot: '새벽벌도서관 1층',
    mapQuery: '부산대학교 새벽벌도서관',
    purpose: '식사',
    duration: 25,
    place: '새벽벌도서관',
    wait: 5,
    plan: [
      '키오스크 주문·픽업 (6분)',
      '식사 및 카페인 충전 (15분)',
      '정리 (4분)',
    ],
    reason:
      '점심시간 학식 웨이팅을 피하면서 오후 전공 수업 졸음 방지까지 한 번에 해결합니다.',
  },
  {
    id: 4,
    name: '자연대(물리·수학·화학) 옆 금정회관 정식',
    spot: '금정회관 식당',
    mapQuery: '부산대학교 금정회관',
    purpose: '식사',
    duration: 38,
    place: '금정회관',
    wait: 9,
    plan: [
      '식권 구매 및 대기 (9분)',
      '식사 (20분)',
      '양치 및 소나무길 휴식 (9분)',
    ],
    reason:
      '자연과학대·공대·중앙도서관 한가운데 있어 오르막 체력 소모가 가장 적은 최적 동선입니다.',
  },
  {
    id: 5,
    name: 'NC백화점 5층 식당가 쾌적한 한 끼',
    spot: '부산대역 NC백화점',
    mapQuery: 'NC백화점 부산대점',
    purpose: '식사',
    duration: 45,
    place: '정문(부산대역·NC백화점)',
    wait: 8,
    plan: [
      '이동 및 키오스크 주문 (8분)',
      '쾌적한 좌석 식사 (27분)',
      '정리 및 복귀 준비 (10분)',
    ],
    reason:
      '학식 메뉴가 안 끌릴 때 정문 바로 앞 백화점에서 깔끔하고 빠르게 식사하기 좋습니다.',
  },
  {
    id: 6,
    name: '북문(장전역) 앞 국밥·덮밥 빠른 한식',
    spot: '북문 먹자골목',
    mapQuery: '부산대 북문',
    purpose: '식사',
    duration: 45,
    place: '북문(장전역 방향)',
    wait: 7,
    plan: ['주문 후 5분 내 서빙 (7분)', '식사 (28분)', '계산 및 양치 (10분)'],
    reason:
      '인문관·사회관·예술관 수업이라면 정문까지 내려가지 않고 북문으로 나가는 게 15분 절약됩니다.',
  },
  {
    id: 7,
    name: '강의실/휴게실 15분 전략적 파워 낮잠',
    spot: '현재 건물 휴게실',
    mapQuery: '부산대학교',
    purpose: '휴식',
    duration: 15,
    place: '제자리',
    wait: 0,
    plan: [
      '진동 알람 세팅 (1분)',
      '엎드려 수면 (11분)',
      '기지개 및 찬물 세수 (3분)',
    ],
    reason:
      '20분 이상 자면 오히려 멍해집니다. 딱 11분 낮잠으로 오후 전공 집중력을 복구하세요.',
  },
  {
    id: 8,
    name: '자연대 앞 숲길·금정회관 벤치 산책',
    spot: '자연과학관~금정회관',
    mapQuery: '부산대학교 자연과학관',
    purpose: '휴식',
    duration: 20,
    place: '자연과학관',
    wait: 0,
    plan: [
      '나무 그늘 산책로 걷기 (11분)',
      '벤치 스트레칭 (6분)',
      '이동 준비 (3분)',
    ],
    reason:
      '실험·이론 수업으로 지친 눈을 초록색 나무 뷰로 식히며 머리를 비우기 좋은 명당입니다.',
  },
  {
    id: 9,
    name: '운죽정 연못 야외 테라스 아아 한 잔',
    spot: '운죽정 야외 벤치',
    mapQuery: '부산대학교 운죽정',
    purpose: '휴식',
    duration: 25,
    place: '새벽벌도서관',
    wait: 4,
    plan: [
      '음료 테이크아웃 픽업 (5분)',
      '연못 뷰 플레이리스트 감상 (16분)',
      '정리 (4분)',
    ],
    reason:
      '부산대 캠퍼스에서 가장 개방감이 뛰어난 스팟으로 답답한 강의실 공기를 날려버립니다.',
  },
  {
    id: 10,
    name: '상남국제회관 1층 카페 조용한 티타임',
    spot: '상남국제회관 로비',
    mapQuery: '부산대학교 상남국제회관',
    purpose: '휴식',
    duration: 35,
    place: '상남국제회관',
    wait: 3,
    plan: ['음료 주문 (4분)', '한적한 창가 소파 휴식 (26분)', '정리 (5분)'],
    reason:
      '학생들이 붐비는 정문 프랜차이즈보다 훨씬 조용하고 여유로워 혼자 쉬고 싶은 날 최고입니다.',
  },
  {
    id: 11,
    name: '직전 전공 필기 15분 백지 인출 복습',
    spot: '현재 위치 바로 실행',
    mapQuery: '부산대학교',
    purpose: '공부',
    duration: 15,
    place: '제자리',
    wait: 0,
    plan: [
      '핵심 공식/개념 5분 훑기',
      '노트 덮고 백지 인출 (7분)',
      '오답 빨간펜 체크 (3분)',
    ],
    reason:
      '수업 직후 15분 인출 연습은 시험 기간 2시간 벼락치기와 맞먹는 장기 기억 효과를 냅니다.',
  },
  {
    id: 12,
    name: '수학관·물리관 로비 25분 연습문제 컷',
    spot: '자연대 스터디 테이블',
    mapQuery: '부산대학교 수학관',
    purpose: '공부',
    duration: 25,
    place: '수학관',
    wait: 0,
    plan: ['예제 문제 2개 풀이 (15분)', '해설 대조 및 오답 메모 (10분)'],
    reason:
      '도서관까지 내려갈 시간은 애매할 때 수업 건물 근처 테이블에서 과제 절반을 끝내는 전략입니다.',
  },
  {
    id: 13,
    name: '새벽벌도서관 2·3층 노트북열람실 집중',
    spot: '새벽벌도서관 열람실',
    mapQuery: '부산대학교 새벽벌도서관',
    purpose: '공부',
    duration: 40,
    place: '새벽벌도서관',
    wait: 3,
    plan: [
      '클리커 좌석 발권 (3분)',
      '스마트폰 무음 후 과제/코딩 (32분)',
      '정리 (5분)',
    ],
    reason:
      '전 좌석 콘센트와 넓은 책상 덕분에 노트북 작업 속도가 가장 잘 나오는 최적의 환경입니다.',
  },
  {
    id: 14,
    name: '중앙도서관 1층 복합문화공간 전공 예습',
    spot: '중앙도서관',
    mapQuery: '부산대학교 중앙도서관',
    purpose: '공부',
    duration: 50,
    place: '중앙도서관',
    wait: 3,
    plan: [
      '좌석 배정 (3분)',
      '전공 원서/강의안 정독 (35분)',
      '교수님 질문 2개 작성 (12분)',
    ],
    reason:
      '인문관·사회관·법학관 수업 전후 언덕 동선을 아끼면서 깊이 있게 공부할 수 있습니다.',
  },
  {
    id: 15,
    name: 'PLATO 출석·과제 마감 15분 올클리어',
    spot: '모바일/노트북 즉시 실행',
    mapQuery: '부산대학교',
    purpose: '할 일 처리',
    duration: 15,
    place: '제자리',
    wait: 0,
    plan: [
      '녹화강의 진도율·공지 체크 (6분)',
      '마감일 캘린더 등록 (6분)',
      '우선순위 3개 메모 (3분)',
    ],
    reason:
      '깜빡하고 놓치는 온라인 출석이나 퀴즈 마감을 미리 막아주는 가장 실속 있는 루틴입니다.',
  },
  {
    id: 16,
    name: '문창회관 무인프린터 강의안 20분 출력',
    spot: '문창회관 프린트존',
    mapQuery: '부산대학교 문창회관',
    purpose: '할 일 처리',
    duration: 20,
    place: '문창회관',
    wait: 4,
    plan: [
      '클라우드 전송 및 결제 (5분)',
      '출력 및 제본 (10분)',
      '파일 정리 (5분)',
    ],
    reason:
      '수업 5분 전 프린트 대기줄에 갇혀 지각하는 참사를 완벽히 예방합니다.',
  },
  {
    id: 17,
    name: '정문 앞 다이소·올리브영 급한 용무 해결',
    spot: '부산대역~정문 상권',
    mapQuery: '다이소 부산대점',
    purpose: '할 일 처리',
    duration: 25,
    place: '정문(부산대역·NC백화점)',
    wait: 5,
    plan: [
      '살 물건 메모 확인 (2분)',
      '매장 방문 및 셀프결제 (18분)',
      '정리 (5분)',
    ],
    reason:
      '충전기, 계산기 건전지, 필기구, 상비약 등을 공강 틈에 해결해 하교 후 시간을 아낍니다.',
  },
];
const DAYS = ['월', '화', '수', '목', '금'];

export default function App() {
  const [tab, setTab] = useState('home');
  const [timetable, setTimetable] = useState(() => {
    try {
      const saved = localStorage.getItem('pnu_timetable_v1');
      return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE;
    } catch {
      return DEFAULT_TIMETABLE;
    }
  });
  const [customList, setCustomList] = useState(() => {
    try {
      const saved = localStorage.getItem('pnu_custom_spots_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pnu_timetable_v1', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('pnu_custom_spots_v1', JSON.stringify(customList));
  }, [customList]);

  const todayKor = ['일', '월', '화', '수', '목', '금', '토'][
    new Date().getDay()
  ];
  const [selectedDay, setSelectedDay] = useState(
    DAYS.includes(todayKor) ? todayKor : '수'
  );

  // 오늘 시간표에서 현재/다음 공강 자동 감지
  const autoDetected = useMemo(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const dayClasses = timetable
      .filter((c) => c.day === selectedDay)
      .sort((a, b) => (a.start || a.end).localeCompare(b.start || b.end));

    for (let i = 0; i < dayClasses.length - 1; i++) {
      const prev = dayClasses[i];
      const next = dayClasses[i + 1];
      if (!prev.end || !next.start) continue;
      const [eh, em] = prev.end.split(':').map(Number);
      const [sh, sm] = next.start.split(':').map(Number);
      const endMin = eh * 60 + em;
      const startMin = sh * 60 + sm;
      const gap = startMin - endMin;
      if (gap >= 15 && nowMin <= startMin - 10) {
        const remain = nowMin >= endMin ? startMin - nowMin : gap;
        return {
          found: true,
          prevSubject: prev.subject,
          nextSubject: next.subject,
          fromPlace: prev.place,
          toPlace: next.place,
          minutes: remain,
          timeRange: `${prev.end} ~ ${next.start}`,
        };
      }
    }
    return { found: false };
  }, [timetable, selectedDay]);

  const [useAutoSchedule, setUseAutoSchedule] = useState(true);
  const [manualMin, setManualMin] = useState(55);
  const [manualFrom, setManualFrom] = useState('물리관');
  const [manualTo, setManualTo] = useState('수학관');
  const [purpose, setPurpose] = useState('전체');
  const [useBus, setUseBus] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // 바텀시트 상세 모달 & 타이머 상태
  const [sheetAct, setSheetAct] = useState(null);
  const [activeTimerAct, setActiveTimerAct] = useState(null);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // 시간표 추가 폼 상태
  const [ttSubject, setTtSubject] = useState('');
  const [ttStart, setTtStart] = useState('14:00');
  const [ttEnd, setTtEnd] = useState('15:15');
  const [ttPlace, setTtPlace] = useState('물리관');

  // 나만의 스팟 추가 폼 상태
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('식사');
  const [newPlace, setNewPlace] = useState('정문(부산대역·NC백화점)');
  const [newDur, setNewDur] = useState(30);
  const [newWait, setNewWait] = useState(5);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const activeTime =
    useAutoSchedule && autoDetected.found ? autoDetected.minutes : manualMin;
  const activeFrom =
    useAutoSchedule && autoDetected.found ? autoDetected.fromPlace : manualFrom;
  const activeTo =
    useAutoSchedule && autoDetected.found ? autoDetected.toPlace : manualTo;

  const recommendations = useMemo(() => {
    if (activeTime < 10) return [];
    const all = [...DEFAULT_ACTIVITIES, ...customList];
    const list = [];

    for (const act of all) {
      if (purpose !== '전체' && act.purpose !== purpose) continue;
      let move = 0;
      let go = 0;
      let back = 0;
      let wait = act.wait;

      if (act.place === '제자리') {
        move =
          activeFrom === activeTo
            ? 0
            : calcWalkTime(activeFrom, activeTo, useBus);
        back = move;
        wait = 0;
      } else {
        go = calcWalkTime(activeFrom, act.place, useBus);
        back = calcWalkTime(act.place, activeTo, useBus);
        move = go + back;
      }

      const total = act.duration + move + wait;
      if (total <= activeTime) {
        list.push({
          ...act,
          goTime: go,
          backTime: back,
          moveTime: move,
          waitTime: wait,
          totalTime: total,
          remainTime: activeTime - total,
        });
      }
    }

    list.sort((a, b) => a.remainTime - b.remainTime);
    if (shuffleSeed > 0 && list.length > 3) {
      const pool = list.slice(0, Math.min(7, list.length));
      return pool.sort(
        () => ((shuffleSeed * 9301 + 49297) % 233280) / 233280 - 0.5
      );
    }
    return list;
  }, [
    activeTime,
    activeFrom,
    activeTo,
    purpose,
    useBus,
    customList,
    shuffleSeed,
  ]);
  const formatMMSS = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!ttSubject.trim()) return;
    setTimetable((prev) => [
      ...prev,
      {
        id: Date.now(),
        day: selectedDay,
        subject: ttSubject,
        start: ttStart,
        end: ttEnd,
        place: ttPlace,
      },
    ]);
    setTtSubject('');
  };

  const handleAddSpot = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCustomList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        spot: newPlace,
        mapQuery: `부산대 ${newName}`,
        purpose: newCat,
        duration: Number(newDur),
        place: newPlace,
        wait: Number(newWait),
        plan: [
          `${newPlace} 이동 및 주문 (${newWait}분)`,
          `메인 활동 및 식사 (${newDur}분)`,
          '정리 및 다음 수업 이동',
        ],
        reason: '내가 직접 등록한 부산대 최애 공강 스팟입니다.',
      },
    ]);
    setNewName('');
    setTab('home');
  };

  return (
    <div className="min-h-screen bg-[#E5E8EB] flex justify-center">
      <div className="w-full max-w-[430px] bg-[#F4F6F9] min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        {/* 상단 앱 바 */}
        <header>
          <div className="flex justify-between items-center mb-2">
            <span>PNU CAMPUS LIVE</span>
            <span className="text-xs font-bold text-blue-100">
              {selectedDay}요일 시간표 연동됨
            </span>
          </div>
          <h1>🦅 부산대 공강 구조대</h1>
          <p>내 시간표와 캠퍼스 경사를 자동 분석하는 공강 내비게이터</p>
        </header>

        <main>
          {tab === 'home' && (
            <div className="space-y-4">
              {/* 시간표 자동 감지 브리핑 카드 */}
              <div className="bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#005BAC]">
                    ⚡ 스마트 공강 감지
                  </span>
                  <button
                    onClick={() => setUseAutoSchedule(!useAutoSchedule)}
                    className="text-[11px] font-bold bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700"
                  >
                    {useAutoSchedule
                      ? '직접 설정으로 전환'
                      : '시간표 자동연동 켜기'}
                  </button>
                </div>

                {useAutoSchedule && autoDetected.found ? (
                  <div className="bg-blue-50/70 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-gray-800">
                        {autoDetected.prevSubject} → {autoDetected.nextSubject}
                      </span>
                      <span className="bg-[#005BAC] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                        {autoDetected.minutes}분 공강
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      📍 동선: <b>{autoDetected.fromPlace}</b> 출발 →{' '}
                      <b>{autoDetected.toPlace}</b> 도착 (
                      {autoDetected.timeRange})
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    <div className="bg-blue-50/70">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>남은 공강 시간</span>
                        <span className="text-[#005BAC]">{manualMin}분</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        step="5"
                        value={manualMin}
                        onChange={(e) => setManualMin(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">
                          출발 건물
                        </label>
                        <select
                          value={manualFrom}
                          onChange={(e) => setManualFrom(e.target.value)}
                        >
                          {PLACES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">
                          다음 수업 건물
                        </label>
                        <select
                          value={manualTo}
                          onChange={(e) => setManualTo(e.target.value)}
                        >
                          {PLACES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-1.5 overflow-x-auto pt-1">
                  {['전체', '식사', '휴식', '공부', '할 일 처리'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPurpose(cat)}
                      className={`rounded-full ${
                        purpose === cat
                          ? 'bg-[#005BAC]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <label className="flex items-center justify-between pt-2 border-t border-gray-100 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700">
                    🚌 순환버스(7번) 언덕 단축 반영
                  </span>
                  <input
                    type="checkbox"
                    checked={useBus}
                    onChange={(e) => setUseBus(e.target.checked)}
                  />
                </label>
              </div>

              {/* 추천 카드 헤더 */}
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-extrabold text-gray-800">
                  🎯 추천 공강 루틴 (카드를 눌러 상세보기)
                </h2>
                <button
                  onClick={() => setShuffleSeed((s) => s + 1)}
                  className="text-xs font-bold text-[#005BAC] bg-blue-50 px-2.5 py-1 rounded-lg"
                >
                  🔄 셔플
                </button>
              </div>

              {/* 컴팩트 네이티브 앱 카드 (터치 시 바텀시트 오픈) */}
              {recommendations.length === 0 ? (
                <div className="bg-white text-center py-8 text-xs text-gray-500">
                  현재 공강 시간({activeTime}분) 내에 마칠 수 있는 루틴이
                  없습니다.
                </div>
              ) : (
                recommendations.slice(0, 4).map((rec, idx) => {
                  const pMove = Math.round((rec.moveTime / activeTime) * 100);
                  const pWait = Math.round((rec.waitTime / activeTime) * 100);
                  const pAct = Math.round((rec.duration / activeTime) * 100);
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSheetAct(rec)}
                      className="bg-white space-y-2.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#005BAC] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            TOP {idx + 1}
                          </span>
                          <span className="bg-blue-50">{rec.purpose}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400">
                          📍 {rec.spot} ›
                        </span>
                      </div>

                      <h3 className="text-base">{rec.name}</h3>

                      <div className="w-full h-2 flex">
                        <div
                          style={{ width: `${pMove}%` }}
                          className="bg-blue-500"
                        />
                        <div
                          style={{ width: `${pWait}%` }}
                          className="bg-amber-400"
                        />
                        <div
                          style={{ width: `${pAct}%` }}
                          className="bg-emerald-500"
                        />
                      </div>

                      <div className="flex justify-between text-[11px] font-semibold">
                        <span>
                          🔵 이동 {rec.moveTime}분 · 🟡 대기 {rec.waitTime}분 ·
                          🟢 활동 {rec.duration}분
                        </span>
                        <span className="text-[#005BAC] font-extrabold">
                          여유 {rec.remainTime}분
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          {/* 탭 2: 내 시간표 관리 */}
          {tab === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-white space-y-3">
                <h2 className="text-base font-extrabold">
                  📅 내 시간표 관리 (자동 공강 감지용)
                </h2>
                <div className="flex gap-1.5">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                        selectedDay === d
                          ? 'bg-[#005BAC]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {d}요일
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  {timetable.filter((c) => c.day === selectedDay).length ===
                  0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      등록된 {selectedDay}요일 수업이 없습니다.
                    </p>
                  ) : (
                    timetable
                      .filter((c) => c.day === selectedDay)
                      .sort((a, b) =>
                        (a.start || a.end).localeCompare(b.start || b.end)
                      )
                      .map((cls) => (
                        <div
                          key={cls.id}
                          className="bg-gray-50 flex justify-between items-center"
                        >
                          <div>
                            <div className="text-xs font-extrabold text-gray-800">
                              {cls.subject}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {cls.start ? `${cls.start} ~ ` : '종료 '}
                              {cls.end} · 📍 {cls.place}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setTimetable((prev) =>
                                prev.filter((item) => item.id !== cls.id)
                              )
                            }
                            className="text-xs text-red-500 font-bold px-2 py-1"
                          >
                            삭제
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <form onSubmit={handleAddClass} className="bg-white space-y-3">
                <h3 className="text-xs font-extrabold text-[#005BAC]">
                  ➕ {selectedDay}요일 수업 추가하기
                </h3>
                <input
                  type="text"
                  required
                  placeholder="과목명 (예: 일반물리학실험)"
                  value={ttSubject}
                  onChange={(e) => setTtSubject(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      시작 시각
                    </label>
                    <input
                      type="time"
                      value={ttStart}
                      onChange={(e) => setTtStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      종료 시각
                    </label>
                    <input
                      type="time"
                      value={ttEnd}
                      onChange={(e) => setTtEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">
                    강의실 건물
                  </label>
                  <select
                    value={ttPlace}
                    onChange={(e) => setTtPlace(e.target.value)}
                  >
                    {PLACES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#005BAC] rounded-xl"
                >
                  {selectedDay}요일 시간표에 저장
                </button>
              </form>
            </div>
          )}

          {/* 탭 3: 실시간 타이머 */}
          {tab === 'timer' && (
            <div className="bg-white text-center space-y-5">
              {!activeTimerAct ? (
                <div className="py-10 space-y-3">
                  <div className="text-4xl">⏱️</div>
                  <p className="text-sm font-bold text-gray-700">
                    실행 중인 공강 루틴이 없습니다
                  </p>
                  <p className="text-xs text-gray-400">
                    홈 화면에서 추천 카드를 눌러 타이머를 시작해 보세요!
                  </p>
                  <button
                    onClick={() => setTab('home')}
                    className="px-4 py-2 bg-[#005BAC] rounded-xl text-xs font-bold"
                  >
                    루틴 고르러 가기
                  </button>
                </div>
              ) : (
                <>
                  <span className="bg-blue-50">
                    {activeTimerAct.purpose} · {activeTimerAct.spot}
                  </span>
                  <h2 className="text-base font-extrabold">
                    {activeTimerAct.name}
                  </h2>
                  <div className="w-48 h-48">
                    <span className="text-xs font-bold text-gray-400 mb-1">
                      남은 집중 시간
                    </span>
                    <span className="text-4xl">{formatMMSS(timerSec)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="flex-1 py-2.5 bg-[#005BAC] rounded-xl"
                    >
                      {timerRunning ? '⏸ 일시정지' : '▶️ 다시 시작'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSec(activeTimerAct.duration * 60);
                      }}
                      className="px-4 py-2.5 bg-gray-100 rounded-xl text-xs font-bold"
                    >
                      초기화
                    </button>
                  </div>
                  <div className="text-left bg-gray-50 space-y-1.5">
                    <p className="text-xs font-bold text-gray-700">
                      📋 단계별 체크리스트
                    </p>
                    {activeTimerAct.plan.map((p, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <input type="checkbox" />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* 탭 4: 나만의 꿀스팟 추가 */}
          {tab === 'add' && (
            <form onSubmit={handleAddSpot} className="bg-white space-y-3.5">
              <h2 className="text-base font-extrabold">
                ➕ 나만의 부산대 꿀스팟 등록
              </h2>
              <p className="text-xs text-gray-500">
                등록한 장소는 스마트폰에 영구 저장되어 공강 시간에 맞춰
                추천됩니다.
              </p>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  활동 / 가게 이름
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 정문 앞 톤쇼우 돈까스 오픈런"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    카테고리
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                  >
                    {['식사', '휴식', '공부', '할 일 처리'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    기준 건물
                  </label>
                  <select
                    value={newPlace}
                    onChange={(e) => setNewPlace(e.target.value)}
                  >
                    {PLACES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    순수 활동 시간(분)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    step="5"
                    value={newDur}
                    onChange={(e) => setNewDur(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    예상 대기 시간(분)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="5"
                    value={newWait}
                    onChange={(e) => setNewWait(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#005BAC] rounded-xl"
              >
                내 공강 시나리오에 저장하기
              </button>
            </form>
          )}
        </main>
        {/* 바텀시트 상세 보기 모달 */}
        {sheetAct && (
          <div className="sheet-backdrop" onClick={() => setSheetAct(null)}>
            <div
              className="bottom-sheet space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              <div className="flex justify-between items-center">
                <span className="bg-blue-50">
                  {sheetAct.purpose} · {sheetAct.spot}
                </span>
                <button
                  onClick={() => setSheetAct(null)}
                  className="text-xs font-bold text-gray-400"
                >
                  닫기 ✕
                </button>
              </div>

              <h2 className="text-base font-extrabold">{sheetAct.name}</h2>

              {/* 비주얼 동선 타임라인 */}
              <div className="bg-gray-50 space-y-1">
                <div className="route-node">
                  <span className="route-dot bg-blue-500" />
                  <span className="text-xs font-bold">출발: {activeFrom}</span>
                </div>
                {sheetAct.place !== '제자리' && (
                  <div className="route-node">
                    <span className="route-dot bg-emerald-500" />
                    <span className="text-xs font-bold text-[#005BAC]">
                      경유: {sheetAct.place} (이동 {sheetAct.goTime}분 + 대기{' '}
                      {sheetAct.waitTime}분 + 실행 {sheetAct.duration}분)
                    </span>
                  </div>
                )}
                <div className="route-node">
                  <span className="route-dot bg-gray-800" />
                  <span className="text-xs font-bold">
                    도착: {activeTo} (복귀 이동 {sheetAct.backTime}분)
                  </span>
                </div>
              </div>

              {/* 단계별 실행 플랜 */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-700">
                  ⏱️ 세부 실행 계획
                </p>
                {sheetAct.plan.map((step, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    {idx + 1}. {step}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500">
                💡 <b>추천 이유:</b> {sheetAct.reason}
              </p>

              {/* 카카오맵 길찾기 연동 버튼 */}
              <a
                href={`https://kakao.com{encodeURIComponent(sheetAct.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="kakao-btn"
              >
                🗺️ 카카오맵에서 '{sheetAct.spot}' 위치 열기
              </a>

              <button
                onClick={() => {
                  setActiveTimerAct(sheetAct);
                  setTimerSec(sheetAct.duration * 60);
                  setTimerRunning(true);
                  setSheetAct(null);
                  setTab('timer');
                }}
                className="w-full py-2.5 bg-[#005BAC] rounded-xl"
              >
                ⏱️ 지금 바로 루틴 & 타이머 시작 ({sheetAct.duration}분)
              </button>
            </div>
          </div>
        )}

        {/* 하단 고정 앱 내비게이션 바 (4개 탭) */}
        <nav className="flex justify-around items-center">
          <button
            onClick={() => setTab('home')}
            className={`flex flex-col items-center text-[11px] font-bold ${
              tab === 'home' ? 'text-[#005BAC]' : 'text-gray-400'
            }`}
          >
            <span className="text-base mb-0.5">🏠</span>
            <span>공강 추천</span>
          </button>
          <button
            onClick={() => setTab('schedule')}
            className={`flex flex-col items-center text-[11px] font-bold ${
              tab === 'schedule' ? 'text-[#005BAC]' : 'text-gray-400'
            }`}
          >
            <span className="text-base mb-0.5">📅</span>
            <span>내 시간표</span>
          </button>
          <button
            onClick={() => setTab('timer')}
            className={`flex flex-col items-center text-[11px] font-bold ${
              tab === 'timer' ? 'text-[#005BAC]' : 'text-gray-400'
            }`}
          >
            <span className="text-base mb-0.5">⏱️</span>
            <span>타이머</span>
          </button>
          <button
            onClick={() => setTab('add')}
            className={`flex flex-col items-center text-[11px] font-bold ${
              tab === 'add' ? 'text-[#005BAC]' : 'text-gray-400'
            }`}
          >
            <span className="text-base mb-0.5">➕</span>
            <span>스팟 추가</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

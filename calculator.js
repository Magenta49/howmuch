document.addEventListener('DOMContentLoaded', function() {
    // 계산기 폼 요소 가져오기
    const calculatorForm = document.getElementById('wedding-calc');
    const resultSection = document.getElementById('result-section');
    
    // 결과 표시 요소들
    const minAmountElement = document.getElementById('min-amount');
    const maxAmountElement = document.getElementById('max-amount');
    const recommendAmountElement = document.getElementById('recommend-amount');
    const resultExplanationElement = document.getElementById('result-explanation');
    
    // 결혼식 축의금 기준 데이터 (단위: 만원)
    const weddingGiftData = {
        // 가족/친척
        'family': {
            'seoul': { min: 10, max: 50, recommend: 30 },
            'gyeonggi': { min: 10, max: 50, recommend: 20 },
            'metro': { min: 10, max: 30, recommend: 20 },
            'province': { min: 5, max: 30, recommend: 15 }
        },
        // 친한 친구/학교 동기
        'close-friend': {
            'seoul': { min: 5, max: 10, recommend: 10 },
            'gyeonggi': { min: 5, max: 10, recommend: 7 },
            'metro': { min: 5, max: 10, recommend: 7 },
            'province': { min: 3, max: 7, recommend: 5 }
        },
        // 일반 친구/지인
        'friend': {
            'seoul': { min: 3, max: 7, recommend: 5 },
            'gyeonggi': { min: 3, max: 7, recommend: 5 },
            'metro': { min: 3, max: 7, recommend: 5 },
            'province': { min: 3, max: 5, recommend: 3 }
        },
        // 직장 동료
        'coworker': {
            'seoul': { min: 5, max: 10, recommend: 7 },
            'gyeonggi': { min: 5, max: 10, recommend: 7 },
            'metro': { min: 5, max: 7, recommend: 5 },
            'province': { min: 3, max: 7, recommend: 5 }
        },
        // 직장 상사
        'boss': {
            'seoul': { min: 5, max: 10, recommend: 10 },
            'gyeonggi': { min: 5, max: 10, recommend: 7 },
            'metro': { min: 5, max: 10, recommend: 7 },
            'province': { min: 5, max: 7, recommend: 5 }
        },
        // 직장 부하직원
        'subordinate': {
            'seoul': { min: 5, max: 15, recommend: 10 },
            'gyeonggi': { min: 5, max: 10, recommend: 7 },
            'metro': { min: 5, max: 10, recommend: 7 },
            'province': { min: 3, max: 7, recommend: 5 }
        },
        // 부모님 지인
        'parent-friend': {
            'seoul': { min: 3, max: 7, recommend: 5 },
            'gyeonggi': { min: 3, max: 7, recommend: 5 },
            'metro': { min: 3, max: 5, recommend: 3 },
            'province': { min: 3, max: 5, recommend: 3 }
        }
    };
    
    // 예식장 등급에 따른 조정 계수
    const venueAdjustment = {
        'normal': 1,
        'hotel': 1.2,
        'premier': 1.5
    };
    
    // 참석 여부에 따른 조정 계수
    const attendanceAdjustment = {
        'yes': 1,
        'no': 0.7
    };
    
    // 계산기 폼 제출 이벤트 처리
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 입력 값 가져오기
        const relationship = document.getElementById('relationship').value;
        const region = document.getElementById('region').value;
        const venue = document.getElementById('venue').value;
        const attendance = document.getElementById('attendance').value;
        const previous = parseFloat(document.getElementById('previous').value) || 0;
        
        // 유효성 검사
        if (!relationship || !region) {
            alert('관계와 지역을 선택해주세요.');
            return;
        }
        
        // 기본 금액 계산
        const baseAmount = weddingGiftData[relationship][region];
        
        // 조정 계수 적용
        const venueMultiplier = venueAdjustment[venue];
        const attendanceMultiplier = attendanceAdjustment[attendance];
        
        const adjustedMin = Math.round(baseAmount.min * venueMultiplier * attendanceMultiplier);
        const adjustedMax = Math.round(baseAmount.max * venueMultiplier * attendanceMultiplier);
        const adjustedRecommend = Math.round(baseAmount.recommend * venueMultiplier * attendanceMultiplier);
        
        // 이전 축의금 고려한 추천 금액 (상호성)
        let finalRecommend = adjustedRecommend;
        if (previous > 0) {
            finalRecommend = Math.max(finalRecommend, Math.round(previous * 0.8));
            if (finalRecommend > adjustedMax) {
                finalRecommend = adjustedMax;
            }
        }
        
        // 결과 표시
        minAmountElement.textContent = adjustedMin;
        maxAmountElement.textContent = adjustedMax;
        recommendAmountElement.textContent = finalRecommend;
        
        // 설명 텍스트 생성
        let explanation = `${getRelationshipText(relationship)}과의 관계, ${getRegionText(region)} 지역, `;
        explanation += `${getVenueText(venue)} 예식장 등급, ${attendance === 'yes' ? '참석' : '불참'}을 고려한 금액입니다.`;
        
        if (previous > 0) {
            explanation += ` 이전에 받은 ${previous/10000}만원의 축의금도 고려하였습니다.`;
        }
        
        resultExplanationElement.textContent = explanation;
        
        // 결과 섹션 표시
        resultSection.classList.remove('hidden');
        
        // 결과로 스크롤
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // 로컬 스토리지에 최근 계산 저장
        saveCalculation(relationship, region, venue, attendance, previous, finalRecommend);
    });
    
    // 관계 텍스트 변환 함수
    function getRelationshipText(relationshipValue) {
        const map = {
            'family': '가족/친척',
            'close-friend': '친한 친구/학교 동기',
            'friend': '일반 친구/지인',
            'coworker': '직장 동료',
            'boss': '직장 상사',
            'subordinate': '직장 부하직원',
            'parent-friend': '부모님 지인'
        };
        return map[relationshipValue] || relationshipValue;
    }
    
    // 지역 텍스트 변환 함수
    function getRegionText(regionValue) {
        const map = {
            'seoul': '서울',
            'gyeonggi': '경기/인천',
            'metro': '광역시',
            'province': '기타 지방'
        };
        return map[regionValue] || regionValue;
    }
    
    // 예식장 텍스트 변환 함수
    function getVenueText(venueValue) {
        const map = {
            'normal': '일반',
            'hotel': '호텔',
            'premier': '특급 호텔/프리미엄'
        };
        return map[venueValue] || venueValue;
    }
    
    // 계산 결과 저장 함수
    function saveCalculation(relationship, region, venue, attendance, previous, amount) {
        // 로컬 스토리지에서 이전 계산 결과 가져오기
        let calculations = JSON.parse(localStorage.getItem('weddingCalculations')) || [];
        
        // 새 계산 결과 추가
        calculations.push({
            date: new Date().toISOString(),
            relationship,
            region,
            venue,
            attendance,
            previous,
            amount,
            type: 'wedding'
        });
        
        // 최대 10개까지만 저장
        if (calculations.length > 10) {
            calculations = calculations.slice(-10);
        }
        
        // 로컬 스토리지에 저장
        localStorage.setItem('weddingCalculations', JSON.stringify(calculations));
    }
});
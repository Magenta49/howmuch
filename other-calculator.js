document.addEventListener('DOMContentLoaded', function() {
    // 계산기 폼 요소 가져오기
    const calculatorForm = document.getElementById('other-calc');
    const resultSection = document.getElementById('result-section');
    
    // 결과 표시 요소들
    const minAmountElement = document.getElementById('min-amount');
    const maxAmountElement = document.getElementById('max-amount');
    const recommendAmountElement = document.getElementById('recommend-amount');
    const resultExplanationElement = document.getElementById('result-explanation');
    
    // 팁 표시 요소들
    const tipTitle1 = document.getElementById('tip-title-1');
    const tipContent1 = document.getElementById('tip-content-1');
    const tipTitle2 = document.getElementById('tip-title-2');
    const tipContent2 = document.getElementById('tip-content-2');
    const tipTitle3 = document.getElementById('tip-title-3');
    const tipContent3 = document.getElementById('tip-content-3');
    
    // 경조사별 팁 정보
    const eventTips = {
        'dol': {
            title1: '돌잔치 예절',
            content1: '아이의 건강과 행복을 기원하는 메시지를 함께 전하세요. 축하 선물은 금전보다 아이에게 유용한 물건이 좋습니다.',
            title2: '선물 준비',
            content2: '금일봉 외에 아이의 미래를 위한 저금통, 골드바, 옷, 책 등도 좋은 선물입니다.',
            title3: '참석 시간',
            content3: '돌잔치는 보통 1-2시간 정도 진행되며, 돌잡이 행사를 놓치지 않도록 시간을 확인하세요.'
        },
        'hwangap': {
            title1: '환갑/칠순 예절',
            content1: '어르신의 장수를 축하하는 의미로, 정성이 담긴 카드나 메시지를 함께 전달하면 더욱 감사히 여겨집니다.',
            title2: '축하 인사',
            content2: '건강과 행복을 기원하는 인사를 정중하게 전달하고, 가능하면 어르신과 대화하는 시간을 가지세요.',
            title3: '선물 선택',
            content3: '현금보다는 건강 용품, 여행권, 의류 등 어르신이 사용할 수 있는 선물도 고려해보세요.'
        },
        'house': {
            title1: '집들이 예절',
            content1: '방문 시 작은 선물(화분, 휴지 등)을 준비하고, 집 안에서는 예의를 갖추어 행동합니다.',
            title2: '금액 대신 선물',
            content2: '집들이는 현금보다 화분, 생활용품, 와인 등 실용적인 선물이 더 적합합니다.',
            title3: '방문 시간',
            content3: '초대 시간보다 약간 늦게(10-15분) 도착하는 것이 주인에게 준비할 시간을 주는 예의입니다.'
        },
        'birth': {
            title1: '출산 축하 예절',
            content1: '산모와 아기의 건강을 기원하는 메시지를 전하고, 방문 시 미리 연락하는 것이 좋습니다.',
            title2: '적절한 선물',
            content2: '금전 외에도 아기 옷, 기저귀, 산모용품 등 실용적인 선물을 준비할 수 있습니다.',
            title3: '방문 시간',
            content3: '출산 후 1-2주 이내 방문은 산모에게 부담이 될 수 있으니 상황을 고려하세요.'
        },
        'sick': {
            title1: '병문안 예절',
            content1: '회복을 기원하는 짧은 메시지를 전하고, 환자에게 부담을 주지 않도록 방문 시간을 짧게 합니다.',
            title2: '적절한 선물',
            content2: '과일, 영양제, 병원에서 필요한 생활용품 등이 좋으며, 향이 강한 꽃은 피하세요.',
            title3: '방문 인원',
            content3: '많은 인원이 한꺼번에 방문하면 환자에게 부담이 됩니다. 소규모로 방문하세요.'
        },
        'promotion': {
            title1: '승진 축하 예절',
            content1: '진심 어린 축하 메시지를 전하고, 새로운 역할에 대한 응원의 말을 함께 전하세요.',
            title2: '적절한 선물',
            content2: '금전보다는 업무에 도움이 되는 물품(명함지갑, 펜 세트 등)이나 꽃다발이 적합합니다.',
            title3: '축하 자리',
            content3: '간단한 식사나 술자리를 마련하는 것도 좋은 축하 방법입니다.'
        }
    };
    
    // 기타 경조사 기준 데이터 (단위: 만원)
    const otherGiftData = {
        // 돌잔치
        'dol': {
            'family': {
                'seoul': { min: 5, max: 10, recommend: 10 },
                'gyeonggi': { min: 5, max: 10, recommend: 7 },
                'metro': { min: 5, max: 7, recommend: 5 },
                'province': { min: 3, max: 7, recommend: 5 }
            },
            'close-friend': {
                'seoul': { min: 3, max: 5, recommend: 5 },
                'gyeonggi': { min: 3, max: 5, recommend: 5 },
                'metro': { min: 3, max: 5, recommend: 3 },
                'province': { min: 2, max: 5, recommend: 3 }
            },
            'friend': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 3 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'coworker': {
                'seoul': { min: 3, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 3 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'boss': {
                'seoul': { min: 3, max: 5, recommend: 5 },
                'gyeonggi': { min: 3, max: 5, recommend: 3 },
                'metro': { min: 2, max: 5, recommend: 3 },
                'province': { min: 2, max: 3, recommend: 3 }
            },
            'subordinate': {
                'seoul': { min: 3, max: 7, recommend: 5 },
                'gyeonggi': { min: 3, max: 5, recommend: 5 },
                'metro': { min: 3, max: 5, recommend: 3 },
                'province': { min: 2, max: 5, recommend: 3 }
            },
            'neighbor': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 2, recommend: 1 }
            }
        },
        // 환갑/칠순/팔순
        'hwangap': {
            'family': {
                'seoul': { min: 5, max: 20, recommend: 10 },
                'gyeonggi': { min: 5, max: 20, recommend: 10 },
                'metro': { min: 5, max: 10, recommend: 7 },
                'province': { min: 3, max: 10, recommend: 5 }
            },
            'close-friend': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 7, recommend: 5 },
                'metro': { min: 3, max: 7, recommend: 5 },
                'province': { min: 3, max: 5, recommend: 3 }
            },
            'friend': {
                'seoul': { min: 3, max: 5, recommend: 3 },
                'gyeonggi': { min: 3, max: 5, recommend: 3 },
                'metro': { min: 2, max: 5, recommend: 3 },
                'province': { min: 2, max: 3, recommend: 3 }
            },
            'coworker': {
                'seoul': { min: 3, max: 5, recommend: 3 },
                'gyeonggi': { min: 3, max: 5, recommend: 3 },
                'metro': { min: 2, max: 5, recommend: 3 },
                'province': { min: 2, max: 3, recommend: 3 }
            },
            'boss': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 7, recommend: 5 },
                'metro': { min: 3, max: 5, recommend: 3 },
                'province': { min: 3, max: 5, recommend: 3 }
            },
            'subordinate': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 7, recommend: 5 },
                'metro': { min: 3, max: 5, recommend: 3 },
                'province': { min: 3, max: 5, recommend: 3 }
            },
            'neighbor': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            }
        },
        // 집들이/이사
        'house': {
            'family': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 10, recommend: 5 },
                'metro': { min: 3, max: 7, recommend: 5 },
                'province': { min: 3, max: 5, recommend: 3 }
            },
            'close-friend': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'friend': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'coworker': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'boss': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'subordinate': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'neighbor': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 2, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            }
        },
        // 출산 축하
        'birth': {
            'family': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 10, recommend: 5 },
                'metro': { min: 3, max: 7, recommend: 5 },
                'province': { min: 3, max: 5, recommend: 3 }
            },
            'close-friend': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'friend': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 1 }
            },
            'coworker': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'boss': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'subordinate': {
                'seoul': { min: 3, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 3 },
                'province': { min: 2, max: 3, recommend: 2 }
            },
            'neighbor': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 1 },
                'metro': { min: 1, max: 2, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            }
        },
        // 병문안
        'sick': {
            'family': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 7, recommend: 5 },
                'metro': { min: 3, max: 7, recommend: 3 },
                'province': { min: 2, max: 5, recommend: 3 }
            },
            'close-friend': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'friend': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'coworker': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'boss': {
                'seoul': { min: 3, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 2, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'subordinate': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'neighbor': {
                'seoul': { min: 1, max: 3, recommend: 1 },
                'gyeonggi': { min: 1, max: 3, recommend: 1 },
                'metro': { min: 1, max: 2, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            }
        },
        // 승진 축하
        'promotion': {
            'family': {
                'seoul': { min: 3, max: 10, recommend: 5 },
                'gyeonggi': { min: 3, max: 7, recommend: 5 },
                'metro': { min: 3, max: 5, recommend: 3 },
                'province': { min: 2, max: 5, recommend: 3 }
            },
            'close-friend': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 5, recommend: 3 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'friend': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'coworker': {
                'seoul': { min: 2, max: 5, recommend: 3 },
                'gyeonggi': { min: 2, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 2 },
                'province': { min: 1, max: 3, recommend: 2 }
            },
            'boss': {
                'seoul': { min: 3, max: 7, recommend: 5 },
                'gyeonggi': { min: 3, max: 5, recommend: 3 },
                'metro': { min: 2, max: 5, recommend: 3 },
                'province': { min: 2, max: 3, recommend: 2 }
            },
            'subordinate': {
                'seoul': { min: 1, max: 3, recommend: 2 },
                'gyeonggi': { min: 1, max: 3, recommend: 2 },
                'metro': { min: 1, max: 3, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            },
            'neighbor': {
                'seoul': { min: 1, max: 3, recommend: 1 },
                'gyeonggi': { min: 1, max: 3, recommend: 1 },
                'metro': { min: 1, max: 2, recommend: 1 },
                'province': { min: 1, max: 2, recommend: 1 }
            }
        }
    };
    
    // 행사 규모에 따른 조정 계수
    const venueAdjustment = {
        'small': 0.8,
        'medium': 1,
        'large': 1.3
    };
    
    // 참석 여부에 따른 조정 계수
    const attendanceAdjustment = {
        'yes': 1,
        'no': 0.7
    };
    
    // 경조사 유형 변경 시 팁 업데이트
    document.getElementById('event-type').addEventListener('change', function() {
        const eventType = this.value;
        if (eventType && eventTips[eventType]) {
            // 팁 섹션 업데이트
            tipTitle1.textContent = eventTips[eventType].title1;
            tipContent1.textContent = eventTips[eventType].content1;
            tipTitle2.textContent = eventTips[eventType].title2;
            tipContent2.textContent = eventTips[eventType].content2;
            tipTitle3.textContent = eventTips[eventType].title3;
            tipContent3.textContent = eventTips[eventType].content3;
        }
    });
    
    // 계산기 폼 제출 이벤트 처리
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 입력 값 가져오기
        const eventType = document.getElementById('event-type').value;
        const relationship = document.getElementById('relationship').value;
        const region = document.getElementById('region').value;
        const venue = document.getElementById('venue').value;
        const attendance = document.getElementById('attendance').value;
        const previous = parseFloat(document.getElementById('previous').value) || 0;
        
        // 유효성 검사
        if (!eventType || !relationship || !region) {
            alert('경조사 유형, 관계, 지역을 모두 선택해주세요.');
            return;
        }
        
        // 기본 금액 계산
        const baseAmount = otherGiftData[eventType][relationship][region];
        
        // 조정 계수 적용
        const venueMultiplier = venueAdjustment[venue];
        const attendanceMultiplier = attendanceAdjustment[attendance];
        
        const adjustedMin = Math.round(baseAmount.min * venueMultiplier * attendanceMultiplier);
        const adjustedMax = Math.round(baseAmount.max * venueMultiplier * attendanceMultiplier);
        const adjustedRecommend = Math.round(baseAmount.recommend * venueMultiplier * attendanceMultiplier);
        
        // 이전 금액 고려한 추천 금액 (상호성)
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
        let explanation = `${getEventTypeText(eventType)} 경조사, ${getRelationshipText(relationship)}과의 관계, `;
        explanation += `${getRegionText(region)} 지역, ${getVenueText(venue)} 규모, ${attendance === 'yes' ? '참석' : '불참'}을 고려한 금액입니다.`;
        
        if (previous > 0) {
            explanation += ` 이전에 받은 ${previous/10000}만원의 금액도 고려하였습니다.`;
        }
        
        resultExplanationElement.textContent = explanation;
        
        // 결과 섹션 표시
        resultSection.classList.remove('hidden');
        
        // 결과로 스크롤
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // 로컬 스토리지에 최근 계산 저장
        saveCalculation(eventType, relationship, region, venue, attendance, previous, finalRecommend);
    });
    
    // 경조사 유형 텍스트 변환 함수
    function getEventTypeText(eventTypeValue) {
        const map = {
            'dol': '돌잔치',
            'hwangap': '환갑/칠순/팔순',
            'house': '집들이/이사',
            'birth': '출산 축하',
            'sick': '병문안',
            'promotion': '승진 축하'
        };
        return map[eventTypeValue] || eventTypeValue;
    }
    
    // 관계 텍스트 변환 함수
    function getRelationshipText(relationshipValue) {
        const map = {
            'family': '가족/친척',
            'close-friend': '친한 친구/학교 동기',
            'friend': '일반 친구/지인',
            'coworker': '직장 동료',
            'boss': '직장 상사',
            'subordinate': '직장 부하직원',
            'neighbor': '이웃'
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
    
    // 행사 규모 텍스트 변환 함수
    function getVenueText(venueValue) {
        const map = {
            'small': '소규모',
            'medium': '중간',
            'large': '대규모'
        };
        return map[venueValue] || venueValue;
    }
    
    // 계산 결과 저장 함수
    function saveCalculation(eventType, relationship, region, venue, attendance, previous, amount) {
        // 로컬 스토리지에서 이전 계산 결과 가져오기
        let calculations = JSON.parse(localStorage.getItem('otherCalculations')) || [];
        
        // 새 계산 결과 추가
        calculations.push({
            date: new Date().toISOString(),
            eventType,
            relationship,
            region,
            venue,
            attendance,
            previous,
            amount,
            type: 'other'
        });
        
        // 최대 10개까지만 저장
        if (calculations.length > 10) {
            calculations = calculations.slice(-10);
        }
        
        // 로컬 스토리지에 저장
        localStorage.setItem('otherCalculations', JSON.stringify(calculations));
    }
});
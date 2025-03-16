document.addEventListener('DOMContentLoaded', function() {
    // 탭 전환 기능
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // 탭 활성화 상태 변경
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 탭 내용 활성화 상태 변경
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // 내역 필터링 기능
    const filterType = document.getElementById('filter-type');
    filterType.addEventListener('change', function() {
        loadRecords();
    });
    
    // 내역 추가 폼 제출 이벤트
    const recordForm = document.getElementById('record-form');
    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 가져오기
        const date = document.getElementById('record-date').value;
        const type = document.getElementById('record-type').value;
        const event = document.getElementById('record-event').value;
        const relation = document.getElementById('record-relation').value;
        const amount = parseInt(document.getElementById('record-amount').value);
        const note = document.getElementById('record-note').value;
        
        // 새 내역 객체 생성
        const newRecord = {
            id: Date.now(), // 고유 ID
            date: date,
            type: type,
            event: event,
            relation: relation,
            amount: amount,
            note: note
        };
        
        // 로컬 스토리지에 저장
        saveRecord(newRecord);
        
        // 폼 초기화
        recordForm.reset();
        document.getElementById('record-date').valueAsDate = new Date();
        
        // 성공 메시지
        alert('내역이 성공적으로 추가되었습니다.');
        
        // 내역 탭으로 전환
        tabs[0].click();
    });
    
    // 현재 날짜로 초기화
    document.getElementById('record-date').valueAsDate = new Date();
    
    // 페이지 로드 시 내역 불러오기
    loadRecords();
    updateSummary();
    loadStats();
    
    // 내역 저장 함수
    function saveRecord(record) {
        // 로컬 스토리지에서 기존 내역 가져오기
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        
        // 새 내역 추가
        records.push(record);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('expenseRecords', JSON.stringify(records));
        
        // 내역 및 요약 업데이트
        loadRecords();
        updateSummary();
        loadStats();
    }
    
    // 내역 불러오기 함수
    function loadRecords() {
        const recordsBody = document.getElementById('records-body');
        const noRecords = document.getElementById('no-records');
        const filterValue = document.getElementById('filter-type').value;
        
        // 로컬 스토리지에서 내역 가져오기
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        
        // 필터링
        if (filterValue !== 'all') {
            records = records.filter(record => record.type === filterValue);
        }
        
        // 날짜 기준 내림차순 정렬
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 내역 표시
        if (records.length === 0) {
            recordsBody.innerHTML = '';
            noRecords.classList.remove('hidden');
        } else {
            noRecords.classList.add('hidden');
            recordsBody.innerHTML = '';
            
            records.forEach(record => {
                const row = document.createElement('tr');
                
                // 날짜 포맷 변환
                const dateObj = new Date(record.date);
                const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${record.type === 'expense' ? '지출' : '수입'}</td>
                    <td>${getEventTypeText(record.event)}</td>
                    <td>${getRelationshipText(record.relation)}</td>
                    <td>${record.amount.toLocaleString()}원</td>
                    <td>${record.note || '-'}</td>
                    <td>
                        <div class="record-actions">
                            <button class="btn-delete" data-id="${record.id}">삭제</button>
                        </div>
                    </td>
                `;
                
                recordsBody.appendChild(row);
            });
            
            // 삭제 버튼 이벤트 연결
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    const recordId = parseInt(this.getAttribute('data-id'));
                    deleteRecord(recordId);
                });
            });
        }
    }
    
    // 내역 삭제 함수
    function deleteRecord(recordId) {
        if (confirm('정말 이 내역을 삭제하시겠습니까?')) {
            // 로컬 스토리지에서 내역 가져오기
            let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
            
            // 해당 ID의 내역 제외
            records = records.filter(record => record.id !== recordId);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('expenseRecords', JSON.stringify(records));
            
            // 내역 및 요약 업데이트
            loadRecords();
            updateSummary();
            loadStats();
        }
    }
    
    // 요약 정보 업데이트 함수
    function updateSummary() {
        const totalExpenseElement = document.getElementById('total-expense');
        const totalIncomeElement = document.getElementById('total-income');
        const balanceElement = document.getElementById('balance');
        
        // 로컬 스토리지에서 내역 가져오기
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        
        // 총 지출 및 수입 계산
        let totalExpense = 0;
        let totalIncome = 0;
        
        records.forEach(record => {
            if (record.type === 'expense') {
                totalExpense += record.amount;
            } else {
                totalIncome += record.amount;
            }
        });
        
        // 잔액 계산
        const balance = totalIncome - totalExpense;
        
        // 요약 정보 표시
        totalExpenseElement.textContent = totalExpense.toLocaleString() + '원';
        totalIncomeElement.textContent = totalIncome.toLocaleString() + '원';
        balanceElement.textContent = balance.toLocaleString() + '원';
        
        // 잔액에 따른 색상 변경
        if (balance > 0) {
            balanceElement.style.color = '#4ecdc4';
        } else if (balance < 0) {
            balanceElement.style.color = '#ff6b6b';
        } else {
            balanceElement.style.color = 'var(--primary-color)';
        }
    }
    
    // 통계 데이터 로드 함수
    function loadStats() {
        const eventStatsContainer = document.getElementById('event-stats');
        const relationStatsContainer = document.getElementById('relation-stats');
        const noStats = document.getElementById('no-stats');
        
        // 로컬 스토리지에서 내역 가져오기
        let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        
        if (records.length < 3) {
            eventStatsContainer.innerHTML = '';
            relationStatsContainer.innerHTML = '';
            noStats.classList.remove('hidden');
            return;
        }
        
        noStats.classList.add('hidden');
        
        // 경조사 유형별 통계
        const eventStats = {};
        const eventNames = {
            'wedding': '결혼식',
            'funeral': '장례식',
            'dol': '돌잔치',
            'hwangap': '환갑/칠순/팔순',
            'house': '집들이/이사',
            'birth': '출산 축하',
            'sick': '병문안',
            'promotion': '승진 축하',
            'other': '기타'
        };
        
        // 초기화
        Object.keys(eventNames).forEach(event => {
            eventStats[event] = { expense: 0, income: 0 };
        });
        
        // 데이터 집계
        records.forEach(record => {
            if (record.type === 'expense') {
                eventStats[record.event].expense += record.amount;
            } else {
                eventStats[record.event].income += record.amount;
            }
        });
        
        // 테이블 생성
        let eventStatsHTML = `
            <table class="records-table">
                <thead>
                    <tr>
                        <th>경조사 유형</th>
                        <th>지출 합계</th>
                        <th>수입 합계</th>
                        <th>차이</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.keys(eventNames).forEach(event => {
            const expense = eventStats[event].expense;
            const income = eventStats[event].income;
            const difference = income - expense;
            
            // 금액이 0인 항목은 표시하지 않음
            if (expense > 0 || income > 0) {
                eventStatsHTML += `
                    <tr>
                        <td>${eventNames[event]}</td>
                        <td>${expense.toLocaleString()}원</td>
                        <td>${income.toLocaleString()}원</td>
                        <td style="color: ${difference >= 0 ? '#4ecdc4' : '#ff6b6b'}">${difference.toLocaleString()}원</td>
                    </tr>
                `;
            }
        });
        
        eventStatsHTML += `
                </tbody>
            </table>
        `;
        
        eventStatsContainer.innerHTML = eventStatsHTML;
        
        // 관계별 평균 금액 통계
        const relationStats = {};
        const relationNames = {
            'family': '가족/친척',
            'close-friend': '친한 친구/학교 동기',
            'friend': '일반 친구/지인',
            'coworker': '직장 동료',
            'boss': '직장 상사',
            'subordinate': '직장 부하직원',
            'neighbor': '이웃',
            'other': '기타'
        };
        
        // 초기화
        Object.keys(relationNames).forEach(relation => {
            relationStats[relation] = { 
                expenseTotal: 0, 
                expenseCount: 0,
                incomeTotal: 0,
                incomeCount: 0
            };
        });
        
        // 데이터 집계
        records.forEach(record => {
            if (record.type === 'expense') {
                relationStats[record.relation].expenseTotal += record.amount;
                relationStats[record.relation].expenseCount++;
            } else {
                relationStats[record.relation].incomeTotal += record.amount;
                relationStats[record.relation].incomeCount++;
            }
        });
        
        // 테이블 생성
        let relationStatsHTML = `
            <table class="records-table">
                <thead>
                    <tr>
                        <th>관계</th>
                        <th>평균 지출</th>
                        <th>평균 수입</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.keys(relationNames).forEach(relation => {
            const expenseAvg = relationStats[relation].expenseCount > 0 
                ? Math.round(relationStats[relation].expenseTotal / relationStats[relation].expenseCount)
                : 0;
                
            const incomeAvg = relationStats[relation].incomeCount > 0
                ? Math.round(relationStats[relation].incomeTotal / relationStats[relation].incomeCount)
                : 0;
            
            // 금액이 0인 항목은 표시하지 않음
            if (expenseAvg > 0 || incomeAvg > 0) {
                relationStatsHTML += `
                    <tr>
                        <td>${relationNames[relation]}</td>
                        <td>${expenseAvg > 0 ? expenseAvg.toLocaleString() + '원' : '-'}</td>
                        <td>${incomeAvg > 0 ? incomeAvg.toLocaleString() + '원' : '-'}</td>
                    </tr>
                `;
            }
        });
        
        relationStatsHTML += `
                </tbody>
            </table>
        `;
        
        relationStatsContainer.innerHTML = relationStatsHTML;
    }
    
    // 경조사 유형 텍스트 변환 함수
    function getEventTypeText(eventTypeValue) {
        const map = {
            'wedding': '결혼식',
            'funeral': '장례식',
            'dol': '돌잔치',
            'hwangap': '환갑/칠순/팔순',
            'house': '집들이/이사',
            'birth': '출산 축하',
            'sick': '병문안',
            'promotion': '승진 축하',
            'other': '기타'
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
            'neighbor': '이웃',
            'other': '기타'
        };
        return map[relationshipValue] || relationshipValue;
    }
    
    // 다른 페이지에서 계산한 경조사비 내역 통합 (선택적)
    function importCalculationRecords() {
        // 결혼식 축의금 계산 내역
        const weddingCalculations = JSON.parse(localStorage.getItem('weddingCalculations')) || [];
        weddingCalculations.forEach(calc => {
            // 이미 추가된 내역은 제외 (ID로 구분)
            if (!isRecordExists(calc.date)) {
                const newRecord = {
                    id: Date.now() + Math.floor(Math.random() * 1000), // 고유 ID
                    date: new Date(calc.date).toISOString().split('T')[0],
                    type: 'expense',
                    event: 'wedding',
                    relation: calc.relationship,
                    amount: calc.amount * 10000, // 만원 단위를 원 단위로 변환
                    note: '축의금얼마 계산 내역에서 가져옴'
                };
                saveRecord(newRecord);
            }
        });
        
        // 장례식 부의금 계산 내역
        const funeralCalculations = JSON.parse(localStorage.getItem('funeralCalculations')) || [];
        funeralCalculations.forEach(calc => {
            if (!isRecordExists(calc.date)) {
                const newRecord = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    date: new Date(calc.date).toISOString().split('T')[0],
                    type: 'expense',
                    event: 'funeral',
                    relation: calc.relationship,
                    amount: calc.amount * 10000,
                    note: '축의금얼마 계산 내역에서 가져옴'
                };
                saveRecord(newRecord);
            }
        });
        
        // 기타 경조사 계산 내역
        const otherCalculations = JSON.parse(localStorage.getItem('otherCalculations')) || [];
        otherCalculations.forEach(calc => {
            if (!isRecordExists(calc.date)) {
                const newRecord = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    date: new Date(calc.date).toISOString().split('T')[0],
                    type: 'expense',
                    event: calc.eventType,
                    relation: calc.relationship,
                    amount: calc.amount * 10000,
                    note: '축의금얼마 계산 내역에서 가져옴'
                };
                saveRecord(newRecord);
            }
        });
    }
    
    // 이미 존재하는 내역인지 확인하는 함수
    function isRecordExists(date) {
        const records = JSON.parse(localStorage.getItem('expenseRecords')) || [];
        return records.some(record => record.date === date);
    }
    
    // 최초 1회 다른 페이지 계산 내역 가져오기 시도
    const importDone = localStorage.getItem('recordsImported');
    if (!importDone) {
        importCalculationRecords();
        localStorage.setItem('recordsImported', 'true');
    }
});
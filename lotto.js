
    const $numbers = document.getElementById("numbers");
    const $timestamp = document.getElementById("timestamp");
    const $history = document.getElementById("history");
    const $count = document.getElementById("count");

    const yearEl = document.getElementById("year");
    yearEl.textContent = new Date().getFullYear();

    let currentSet = [];

    function pad2(n){ return String(n).padStart(2, "0"); }

    function nowText(){
      const d = new Date();
      const y = d.getFullYear();
      const m = pad2(d.getMonth()+1);
      const day = pad2(d.getDate());
      const hh = pad2(d.getHours());
      const mm = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());
      return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
    }

    function pickOneSet(){
      // 1~45 중 중복 없이 6개 뽑기
      const pool = Array.from({length:45}, (_,i)=>i+1);
      // Fisher–Yates shuffle
      for(let i=pool.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const result = pool.slice(0,6).sort((a,b)=>a-b);
      return result;
    }

    function renderBalls(nums){
      $numbers.innerHTML = "";
      nums.forEach(n=>{
        const b = document.createElement("div");
        b.className = "ball";
        b.textContent = n;
        // 범위별로 살짝 톤만 다르게(색 지정 없이 투명도 변화)
        // (요구사항 없어서 컬러는 명시하지 않음)
        const alpha = n <= 10 ? 0.10 : n <= 20 ? 0.08 : n <= 30 ? 0.06 : n <= 40 ? 0.05 : 0.04;
        b.style.background = `rgba(255,255,255,${alpha})`;
        $numbers.appendChild(b);
      });
    }

    function pushHistory(nums){
      const t = nowText();
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<span>${t}</span><code>${nums.join(", ")}</code>`;
      $history.prepend(row);
    }

    function setCurrent(nums){
      currentSet = nums.slice();
      renderBalls(currentSet);
      $timestamp.textContent = `생성 시간: ${nowText()}`;
      pushHistory(currentSet);
    }

    async function copyCurrent(){
      if(!currentSet.length){
        alert("먼저 번호를 추천받아 주세요.");
        return;
      }
      const text = currentSet.join(", ");
      try{
        await navigator.clipboard.writeText(text);
        alert("현재 번호가 복사되었습니다: " + text);
      }catch(e){
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        alert("현재 번호가 복사되었습니다: " + text);
      }
    }

    function resetHistory(){
      currentSet = [];
      $numbers.innerHTML = "";
      $timestamp.textContent = "아직 추천을 생성하지 않았어요.";
      $history.innerHTML = "";
    }

    // Buttons
    document.getElementById("btnPick").addEventListener("click", ()=>{
      setCurrent(pickOneSet());
    });

    document.getElementById("btnCopy").addEventListener("click", copyCurrent);

    document.getElementById("btnReset").addEventListener("click", ()=>{
      if(confirm("기록을 모두 삭제할까요?")){
        resetHistory();
      }
    });

    document.getElementById("btnMulti").addEventListener("click", ()=>{
      let c = parseInt($count.value, 10);
      if(Number.isNaN(c)) c = 1;
      c = Math.max(1, Math.min(20, c));

      // 여러 세트 생성: 첫 세트는 화면에 표시 + 나머지는 기록에만 추가
      const first = pickOneSet();
      setCurrent(first);

      for(let i=1; i<c; i++){
        pushHistory(pickOneSet());
      }
      alert(`${c}세트 생성 완료! (첫 세트는 화면에 표시되고, 전체는 기록에 저장됩니다.)`);
    });

    // initial: show one set on load (원하면 아래 줄 주석 처리)
    setCurrent(pickOneSet());

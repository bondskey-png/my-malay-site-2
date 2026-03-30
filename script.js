
/**
 * ページ切り替え機能
 * @param {string} pageId - 表示したいセクションのID
 */
function showPage(pageId) {
    // 全てのページセクションを取得
    const pages = document.querySelectorAll('.page');
    
    // 全てのページから 'active' クラスを削除して隠す
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 指定されたIDのページに 'active' クラスを追加して表示
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

/**
 * スマホ用ナビゲーションの開閉
 */
function toggleMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('active');
}

/**
 * ページ移動時にメニューを自動で閉じる
 */
const originalShowPage = showPage;
showPage = function(pageId) {
    const nav = document.getElementById('main-nav');
    nav.classList.remove('active'); // メニューを閉じる
    window.scrollTo(0, 0); // ページ最上部へスクロール
    
    // 元のページ切り替え処理を実行
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
};

    
// --- スライドショー制御 ---
let slideIndex = 0;
let slideTimer; // タイマーを管理する変数

function showSlides() {
    // 既存の予約があればクリアする（二重起動を防止）
    clearTimeout(slideTimer);

    const wrapper = document.getElementById('slides-wrapper');
    const slides = document.querySelectorAll('.slide-item');
    const container = document.querySelector('.slideshow-container');

    if (!wrapper || slides.length === 0 || !container) return;

    // --- 計算と移動 ---
    const containerWidth = container.offsetWidth;
    // 最初のスライドの幅を基準にする
    const slideWidth = slides[0].offsetWidth + 30; 

    const offset = (containerWidth / 2) - (slideWidth / 2) - (slideIndex * slideWidth);

    wrapper.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    wrapper.style.transform = `translateX(${offset}px)`;

    // 強調表示の切り替え
    slides.forEach(s => s.classList.remove('center'));
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('center');
    }

    // 次の番号へ
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    // 4秒後に「一度だけ」実行するように予約
    slideTimer = setTimeout(showSlides, 4000);
}

// ページ読み込み完了時の処理
window.addEventListener('load', () => {
    // 他の初期化処理（時計など）があればここに書く
    
    // スライドショーを開始
    showSlides();
});

/**
 * マレー語アーカイブの表示/非表示切り替え
 */
function toggleArchive() {
    const archive = document.getElementById('archive');
    archive.classList.toggle('hidden');
    
    // アーカイブが表示された時に、リストを生成する
    if (!archive.classList.contains('hidden')) {
        renderPhraseList();
    }
}

/**
 * マレーシアの時刻を更新する関数
 */
function updateMalaysiaClock() {
    const timeDisplay = document.getElementById('kl-time');
    const dateDisplay = document.getElementById('kl-date');
    
    if (!timeDisplay || !dateDisplay) return;

    // Intl.DateTimeFormat を使ってマレーシア（クアラルンプール）の時刻を取得
    const options = {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const dateOptions = {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    };

    const formatter = new Intl.DateTimeFormat('ja-JP', options);
    const dateFormatter = new Intl.DateTimeFormat('ja-JP', dateOptions);

    timeDisplay.innerText = formatter.format(new Date());
    dateDisplay.innerText = dateFormatter.format(new Date());
}

// 1秒ごとに実行
setInterval(updateMalaysiaClock, 1000);

// 既存の window.onload または DOMContentLoaded 内で初回実行
window.addEventListener('DOMContentLoaded', () => {
    
    updateMalaysiaClock(); // 時計を即座に表示
});

/**
 * 料理/外観写真の切り替え (IDを元に特定のカード内だけ操作)
 */
function switchPhoto(cardId, type) {
    const container = document.getElementById(cardId + '-container');
    if (!container) return;

    const mainImg = container.querySelector('.img-food');
    const shopImg = container.querySelector('.img-shop');
    const buttons = container.querySelectorAll('.photo-switcher button');

    if (type === 'main') {
        mainImg.classList.add('active');
        shopImg.classList.remove('active');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        mainImg.classList.remove('active');
        shopImg.classList.add('active');
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}

/**
 * 1. 毎日のマレー語データ管理
// --- 1. 設定（一番上） ---
let dailyPhrases = {}; 
const SHEET_ID = '1eGmjiAs4s1MXkCshg537MR1Vdjv232a5A10Jo9tlhUM';
const TAB_NAME = 'phrase';

// --- 2. データ取得関数 ---
async function loadSpreadsheetData() {
    const url = `https://docs.google.com{SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;
        const newData = {};
        rows.forEach(row => {
            const c = row.c;
            if (!c || !c[0]) return;
            const dateKey = c[0].f || String(c[0].v); 
            newData[dateKey] = {
                category: c[1]?.v || "",
                phrase:   c[2]?.v || "",
                katakana: c[3]?.v || "",
                meaning:  c[4]?.v || "",
                nuance:   c[5]?.v || "",
                examples: [
                    {
                        title: c[6]?.v || "",
                        a: `${c[7]?.v || ""}<br><small>（${c[8]?.v || ""}）</small>`,
                        b: `${c[9]?.v || ""}<br><small>（${c[10]?.v || ""}）</small>`
                    },
                    {
                        title: c[11]?.v || "",
                        a: `${c[12]?.v || ""}<br><small>（${c[13]?.v || ""}）</small>`,
                        b: `${c[14]?.v || ""}<br><small>（${c[15]?.v || ""}）</small>`
                    }
                ],
                tips: c[16]?.v || ""
            };
        });
        dailyPhrases = newData;
        console.log("Data loaded!");
    } catch (e) {
        console.error("Load error:", e);
    }
}

// --- 3. 表示関数 ---
function updateDailyPhrase(targetDate = null) {
    let today;
    if (targetDate) {
        today = targetDate;
    } else {
        const now = new Date();
        today = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0');
    }

    let data = dailyPhrases[today];
    if (!data && !targetDate) {
        const dates = Object.keys(dailyPhrases).sort().reverse();
        data = dailyPhrases[dates[0]];
    }

    if (data) {
        const phraseEl = document.getElementById('today-phrase');
        const kanaEl = document.querySelector('.pronunciation');
        const meaningEl = document.querySelector('.meaning');
        const nuanceEl = document.querySelector('.nuance-text');
        const tipsEl = document.querySelector('.tips-text');
        const exampleContainer = document.getElementById('example-list');

        if(phraseEl) phraseEl.innerText = data.phrase;
        if(kanaEl) kanaEl.innerText = data.katakana;
        if(meaningEl) meaningEl.innerText = `【意味】${data.meaning}`;
        if(nuanceEl) nuanceEl.innerHTML = data.nuance;
        if(tipsEl) tipsEl.innerHTML = data.tips;

        if(exampleContainer) {
            exampleContainer.innerHTML = "";
            data.examples.forEach(ex => {
                if(!ex.title) return; // 空の例文は表示しない
                const div = document.createElement('div');
                div.className = "dialogue";
                div.innerHTML = `
                    <p><strong>${ex.title}</strong></p>
                    <p class="chat"><span>A:</span> ${ex.a}</p>
                    <p class="chat"><span>B:</span> ${ex.b}</p>
                `;
                exampleContainer.appendChild(div);
            });
        }
        if (targetDate) showPage('malay');
    }
}

function displaySpecificPhrase(date) {
    updateDailyPhrase(date);
    window.location.hash = date;
    const archive = document.getElementById('archive');
    if (archive) archive.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 4. 起動処理（一番下にする） ---
window.addEventListener('DOMContentLoaded', async () => {
    await loadSpreadsheetData(); // データの読み込み完了を待つ

    // その後に表示を実行
    const hash = window.location.hash.replace('#', '');
    if (dailyPhrases[hash]) {
        updateDailyPhrase(hash);
    } else {
        updateDailyPhrase();
    }
});

// アーカイブから特定のフレーズを表示する関数も追加
function displaySpecificPhrase(date) {
    // 1. データを画面に反映
    updateDailyPhrase(date);
    // 2. URLの末尾に #2026-03-29 などを付与（ブックマーク用）
    window.location.hash = date;
    // 3. アーカイブ一覧を閉じる
    const archive = document.getElementById('archive');
    if (archive) archive.classList.add('hidden');
}

// 画面の一番上（フレーズ表示部）までスムーズにスクロールさせる
window.scrollTo({ top: 0, behavior: 'smooth' });


/**
 * 過去のフレーズ一覧（アーカイブ）のリンク生成
 */
function toggleArchive() {
    const archive = document.getElementById('archive');
    archive.classList.toggle('hidden');
    
    if (!archive.classList.contains('hidden')) {
        const list = document.getElementById('phrase-list');
        list.innerHTML = ""; 
        
        // 日付の降順で並べる
        Object.keys(dailyPhrases).sort().reverse().forEach(date => {
            const item = dailyPhrases[date];
            const li = document.createElement('li');
            li.style.padding = "10px 0";
            li.style.borderBottom = "1px solid #eee";
            // 💡 クリックするとそのフレーズを表示するリンクにする
            li.innerHTML = `
                <a href="#${date}" onclick="displaySpecificPhrase('${date}'); return false;" style="text-decoration:none; color:inherit;">
                    <strong>${date}</strong>: ${item.phrase} <br>
                    <small style="color:var(--accent-red)">詳細を見る →</small>
                </a>`;
            list.appendChild(li);
        });
    }
}

/**
 * ページ読み込み時の自動処理（修正版）
 */
window.addEventListener('DOMContentLoaded', async () => {
    // ここで loadSpreadsheetData を呼ぶ
    await loadSpreadsheetData(); 

    // その後に表示
    const hash = window.location.hash.replace('#', '');
    if (dailyPhrases && dailyPhrases[hash]) {
        updateDailyPhrase(hash);
    } else {
        updateDailyPhrase();
    }
});

/**
 * ページ読み込み時の初期化処理を一つにまとめます
 */
window.addEventListener('DOMContentLoaded', () => {
    // 1. 今日のマレー語フレーズを更新
    if (typeof updateDailyPhrase === 'function') {
        updateDailyPhrase();
    }
    
    // 2. マレーシア時計の開始
    if (typeof updateMalaysiaClock === 'function') {
        updateMalaysiaClock();
        // 1秒ごとに時計を更新
        setInterval(updateMalaysiaClock, 1000);
    }
    
    // 3. スライドショーの開始
    // 0.5秒待ってから動かすことで、画像の幅計算を安定させます
    setTimeout(() => {
        if (typeof showSlides === 'function') {
            showSlides();
        }
    }, 500);

    // 4. Google Analytics の初期化 (エラー回避のため関数があるか確認)
    if (typeof initGA === 'function') {
        initGA();
    }
});

/**
 * Google Analytics 初期化用 (必要に応じて中身を記述)
 */
function initGA() {
    console.log("Google Analytics initialized.");
    // ここに GA のタグ設置コードを記述できます
}
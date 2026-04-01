
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

// 写真切り替え関数（グローバル）
// 1. グローバル変数でデータを保持
let allPosts = [];

// 2. 写真切り替え関数
window.switchPhoto = function(photoId, type) {
    const container = document.getElementById(`${photoId}-container`);
    if (!container) return;
    const mainImg = container.querySelector('.img-food');
    const shopImg = container.querySelector('.img-shop');
    const btns = container.querySelectorAll('.photo-switcher button');
    if (type === 'main') {
        mainImg.style.display = 'block'; shopImg.style.display = 'none';
        btns[0].classList.add('active'); btns[1].classList.remove('active');
    } else {
        mainImg.style.display = 'none'; shopImg.style.display = 'block';
        btns[0].classList.remove('active'); btns[1].classList.add('active');
    }
};

// 3. 指定した記事をメインエリアに表示する関数
window.showPost = function(index, updateHash = true) {
    const post = allPosts[index];
    const container = document.getElementById('latest-food-container');
    if (!post || !container) return;

    // URLの末尾（ハッシュ）を更新 (#post-0 など)
    if (updateHash) {
        window.location.hash = `post-${index}`;
    }

    const html = `
        <article class="food-card" id="current-view-post">
            <div class="food-image-container" id="latest-container">
                <img src="${post.foodImg}" class="img-food" alt="料理" style="display: block; width: 100%; height: 100%; object-fit: cover;">
                <img src="${post.shopImg}" class="img-shop" alt="外観" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                <span class="price-tag">${post.price}</span>
                <div class="photo-switcher">
                    <button onclick="switchPhoto('latest', 'main')" class="active">料理</button>
                    <button onclick="switchPhoto('latest', 'shop')">外観</button>
                </div>
            </div>
            <div class="food-info">
                <span class="category">${post.category}</span>
                <h3>${post.title}</h3>
                <div class="food-text-content" style="white-space: pre-wrap; margin: 10px 0;">${post.content}</div>
                <div class="restaurant-info">
                    <a href="${post.mapUrl}" target="_blank" style="color:#d2a679; text-decoration:none; border:1px solid #ddd; padding:8px 15px; border-radius:5px; display:inline-block; margin:10px 0;">📍 Googleマップで確認</a>
                </div>
                <div class="rating">オススメ度：${post.rating}</div>
                
                <div style="margin-top:20px; font-size:0.8rem; color:#888;">
                    🔗 この記事のリンク: <input type="text" value="${window.location.href}" readonly 
                        onclick="this.select(); document.execCommand('copy'); alert('リンクをコピーしました！');" 
                        style="width:70%; border:1px solid #eee; padding:5px; cursor:pointer;">
                </div>
            </div>
        </article>
    `;
    container.innerHTML = html;
    
    // スムーズスクロール
    const targetY = container.getBoundingClientRect().top + window.pageYOffset - 20;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
};

// 4. CSV解析（以前と同じ強力なもの）
function parseComplexCSV(text) {
    const result = []; let row = []; let field = ""; let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i]; const nextChar = text[i + 1];
        if (inQuotes) {
            if (char === '"' && nextChar === '"') { field += '"'; i++; }
            else if (char === '"') inQuotes = false;
            else field += char;
        } else {
            if (char === '"') inQuotes = true;
            else if (char === ',') { row.push(field); field = ""; }
            else if (char === '\r' || char === '\n') {
                if (field !== "" || row.length > 0) { row.push(field); result.push(row); row = []; field = ""; }
                if (char === '\r' && nextChar === '\n') i++;
            } else field += char;
        }
    }
    if (field !== "" || row.length > 0) { row.push(field); result.push(row); }
    return result;
}

// 5. ページ読み込み時や「戻る」ボタンを押した時に、ハッシュを見て記事を表示する
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#post-')) {
        const index = parseInt(hash.replace('#post-', ''));
        if (!isNaN(index) && allPosts[index]) {
            showPost(index, false); // ハッシュ変更時はループ防止のため第2引数をfalseに
        }
    }
});

// loadFoodData関数の最後（初期表示）も少し修正します
async function loadFoodData() {
    // ... (前回のCSV解析コード) ...
    
    // 初期表示：ハッシュがあればそれを表示、なければ最新を表示
    const hash = window.location.hash;
    if (hash.startsWith('#post-')) {
        const index = parseInt(hash.replace('#post-', ''));
        if (!isNaN(index) && allPosts[index]) {
            showPost(index, false);
        } else {
            showPost(allPosts.length - 1);
        }
    } else {
        showPost(allPosts.length - 1);
    }
}

async function loadFoodData() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeujd5X14hYw3qfi4_ZMbt3yeyrIrG1ALtVNAbL9ROfIamIB1P0BYFypM1t99SZ5SYjqA-Uf2B5mRi/pub?gid=375520748&single=true&output=csv"; 
    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        const allData = parseComplexCSV(csvText);
        
        allPosts = allData.slice(1).filter(cols => cols.length >= 6).map(cols => ({
            date: cols[0], category: cols[1], title: cols[2], content: cols[3],
            price: cols[4], foodImg: cols[5].trim(), shopImg: cols[6].trim(),
            mapUrl: cols[7].trim(), rating: cols[8]
        }));

        // 初期表示（最新記事）
        showPost(allPosts.length - 1);

        // 過去記事リストの生成
        const archiveList = document.getElementById('food-archive-list');
        archiveList.innerHTML = "";
        allPosts.forEach((p, index) => {
            const li = document.createElement('li');
            li.className = "archive-item";
            li.style.cssText = "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; cursor:pointer; align-items:center;";
            // クリックイベントを追加
            li.onclick = () => showPost(index);
            
            li.innerHTML = `
                <span style="font-size:0.8rem; color:#888; width:80px;">${p.date}</span>
                <strong style="flex:1; margin:0 15px; font-size:0.9rem;">${p.title}</strong>
                <span style="font-size:0.7rem; background:#f0f0f0; padding:3px 8px; border-radius:4px;">${p.category}</span>
            `;
            archiveList.prepend(li); // 新しい順に並べる
        });
    } catch (e) { console.error("Error:", e); }
}

document.addEventListener('DOMContentLoaded', loadFoodData);

/**
 * 1. 毎日のマレー語データ管理
 */
// --- 1. 設定（一番上） ---
const SHEET_ID = '1eGmjiAs4s1MXkCshg537MR1Vdjv232a5A10Jo9tlhUM'; 
const TAB_NAME = 'phrase'; 
let dailyPhrases = {}; // 空のオブジェクトで初期化

// --- 2. データ取得関数 ---
async function loadSpreadsheetData() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}`;
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
 * 4. アーカイブ表示（今日以前のデータのみに制限）
 */
function toggleArchive() {
    const archive = document.getElementById('archive');
    if (!archive) return;
    
    archive.classList.toggle('hidden');
    
    if (!archive.classList.contains('hidden')) {
        const list = document.getElementById('phrase-list');
        list.innerHTML = ""; 
        
        // 今日の日付を取得 (YYYY-MM-DD形式)
        const now = new Date();
        const todayStr = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0');

        // 日付の降順（新しい順）で並べる
        Object.keys(dailyPhrases).sort().reverse().forEach(date => {
            // 💡 ここが重要：データの日付が「今日」より未来なら表示しない
            if (date > todayStr) return; 

            const item = dailyPhrases[date];
            const li = document.createElement('li');
            li.style.padding = "10px 0";
            li.style.borderBottom = "1px solid #eee";
            li.innerHTML = `
                <a href="javascript:void(0);" onclick="displaySpecificPhrase('${date}');" style="text-decoration:none; color:inherit;">
                    <strong>${date}</strong>: ${item.phrase} <br>
                    <small style="color:red">詳細を見る →</small>
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
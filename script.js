
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
    updateDailyPhrase();
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
 * 日付 (YYYY-MM-DD) をキーにしてデータを格納します
 */
const dailyPhrases = {
    "2026-03-29": {
        phrase: "Selamat pagi.",
        katakana: "《スラマッ パギ》",
        meaning: "おはようございます。",
        nuance: "朝、家族や友人、同僚などに出会った際に使われる最も一般的な挨拶です。<br> マレー語で Selamat は「安全な」「平安な」、Pagi は「朝」を意味します。直訳すると「平安な朝を」という願いが込められています。<br> マレーシアでは丁寧な挨拶として非常に重要視されており、笑顔で交わすことで人間関係を円滑にする魔法の言葉です。",
        examples: [
            {
                title: "1. 職場での挨拶",
                a: "Selamat pagi, Encik Ahmad.<br><small>（おはようございます、アハマドさん。）</small>",
                b: "Selamat pagi, Ali. Awak nampak bersemangat hari ini!<br><small>（おはよう、アリ。今日は元気そうだね！）</small>"
            },
            {
                title: "2. ホテルのフロントで",
                a: "Selamat pagi. Boleh saya bantu anda dengan beg ini?<br><small>（おはようございます。このバッグのお手伝いをしましょうか？）</small>",
                b: "Terima kasih. Di manakah tempat sarapan?<br><small>（ありがとうございます。朝食はどこですか？）</small>"
            }
        ],
        tips: "マレーシアでは時間帯によって挨拶が以下のように変わります：<br>・Selamat tengah hari: 正午（12時〜14時頃）<br>・Selamat petang: 午後から夕方（14時〜日没頃）<br>・Selamat malam: 夜（おやすみなさい、または夜の挨拶）"
    },

    "2026-03-30": {
        phrase: "Bagaimana khabar?",
        katakana: "《バガイマナ カバール》",
        meaning: "ご機嫌いかがですか？ / 調子はどうですか？",
        nuance: "相手の健康状態や近況を尋ねる際に使われる丁寧な表現です。<br> 一般的に使われる Apa khabar?（お元気ですか？）と似ていますが、Bagaimana（どのように）を使うことで、より具体的に「最近の調子はどうですか？」と相手の状況を気遣うニュアンスが含まれます。<br> ビジネスシーンや、少し久しぶりに会った知人に対して使うと、より関心を持っている印象を与えることができます。",
        examples: [
            {
                title: "1. 久しぶりに会った友人",
                a: "Helo, lama tidak jumpa! Bagaimana khabar anda sekarang?<br><small>（やあ、久しぶり！最近の調子はどうだい？）</small>",
                b: "Khabar baik. Saya sangat sibuk dengan kerja baru saya.<br><small>（元気だよ。新しい仕事でとても忙しくしているんだ。）</small>"
            },
            {
                title: "2. ビジネスの打ち合わせで",
                a: "Selamat pagi, Encik Rozak. Bagaimana khabar projek kita di Melaka?<br><small>（おはようございます、ロザックさん。マラッカのプロジェクトの進捗はいかがですか？）</small>",
                b: "Semuanya berjalan lancar seperti yang dirancang.<br><small>（すべて計画通り順調に進んでいます。）</small>"
            }
        ],
        tips: "日常会話では短く Apa khabar?と言うのが最も一般的ですが、相手の近況をより深く知りたいときには Bagaimana khabar...? の後に特定のトピック（仕事や家族など）を続けて使うのが効果的です。"
    },

};

/**
 * 2. フレーズを表示する関数
 */
/**
 * マレー語フレーズを表示する（引数があればその日を、なければ今日を表示）
 * @param {string} targetDate - "YYYY-MM-DD" 形式の日付（省略可）
 */
function updateDailyPhrase(targetDate = null) {
    let today;
    
    if (targetDate) {
        // 引数があればそれを使う
        today = targetDate;
    } else {
        // 引数がなければ今日の日付を計算
        const now = new Date();
        today = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0');
    }

    let data = dailyPhrases[today];

    // もし指定された日付のデータがない（かつ引数なしの時）は最新を表示
    if (!data && !targetDate) {
        const dates = Object.keys(dailyPhrases).sort().reverse();
        data = dailyPhrases[dates[0]];
    }

    if (data) {
        // 各要素への流し込み（既存の処理）
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
        
        // 過去のリンクから飛んできた場合は、ページを「マレー語」に切り替える
        if (targetDate) {
            showPage('malay');
            // アーカイブ一覧は閉じる
            document.getElementById('archive').classList.add('hidden');
        }
    }
}

// ページ読み込み時に実行
window.addEventListener('DOMContentLoaded', updateDailyPhrase);

/**
 * 3. ページ切り替え機能 (既存)
 */
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

/**
 * 4. アーカイブ表示 (既存のロジックに全データを出すよう修正)
 */
function toggleArchive() {
    const archive = document.getElementById('archive');
    archive.classList.toggle('hidden');
    
    if (!archive.classList.contains('hidden')) {
        const list = document.getElementById('phrase-list');
        list.innerHTML = ""; 
        // 登録されている全データをリスト化
        Object.keys(dailyPhrases).forEach(date => {
            const item = dailyPhrases[date];
            const li = document.createElement('li');
            li.style.borderBottom = "1px solid #eee";
            li.innerHTML = `<strong>${date}</strong>: ${item.phrase} <br> <small>${item.meaning}</small>`;
            list.appendChild(li);
        });
    }
}

// 実行
window.onload = () => {
    updateDailyPhrase();
};


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
 * ページ読み込み時の自動処理
 */
window.addEventListener('DOMContentLoaded', () => {
    updateMalaysiaClock();
    showSlides();

    // URLにハッシュ（#2024-03-30 など）があればそれを表示、なければ今日分を表示
    const hash = window.location.hash.replace('#', '');
    if (dailyPhrases[hash]) {
        displaySpecificPhrase(hash);
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
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

};

/**
 * 2. フレーズを表示する関数
 */
function updateDailyPhrase() {
    // 今日の日付を取得 (例: "2024-03-29")
    const now = new Date();
    const today = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0');

    let data = dailyPhrases[today];

    // もし今日の日付のデータがなければ、登録されている「最新のデータ」を表示する
    if (!data) {
        const dates = Object.keys(dailyPhrases).sort().reverse();
        data = dailyPhrases[dates[0]]; // 一番新しい日付のデータ
    }

    if (data) {
        // 各要素に流し込み（nullチェック付き）
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

const pastPhrases = [
    { 
        word: "Selamat pagi.", 
        meaning: "おはようございます。",
        katakana: "スラマッ パギ"
    },
    { 
        word: "Terima Kasih", 
        meaning: "ありがとう",
        katakana: "トゥリマ カシ"
    }
];

// リスト表示関数を少し修正（カタカナも表示するように）
function renderPhraseList() {
    const list = document.getElementById('phrase-list');
    list.innerHTML = ""; 

    pastPhrases.forEach(item => {
        const li = document.createElement('li');
        li.style.padding = "10px 0";
        li.style.borderBottom = "1px solid #eee";
        li.innerHTML = `<strong>${item.word}</strong><br><small>${item.katakana}</small> — ${item.meaning}`;
        list.appendChild(li);
    });
}

/**
 * 過去のフレーズをリストとして表示する
 */
function renderPhraseList() {
    const list = document.getElementById('phrase-list');
    list.innerHTML = ""; // リストを一旦空にする

    pastPhrases.forEach(item => {
        const li = document.createElement('li');
        li.style.marginBottom = "10px";
        li.innerHTML = `<strong>${item.word}</strong> - ${item.meaning}`;
        list.appendChild(li);
    });
}



// 初期化：Google Analytics の設定用関数（本番時にIDを入れれば機能します）
function initGA() {
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX');
}

// ページ読み込み時に実行
window.onload = initGA;
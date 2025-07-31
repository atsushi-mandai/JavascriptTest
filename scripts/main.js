// 麻雀予約サイト - メインJavaScript

// ローカルストレージのキー
const STORAGE_KEYS = {
    USERS: 'mahjong_users',
    SHOPS: 'mahjong_shops',
    CURRENT_USER: 'current_user'
};

// グローバル変数
let currentUser = null;
let shops = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    setupEventListeners();
    checkLoginStatus();
});

// ローカルストレージからデータを読み込み
function loadStoredData() {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const storedShops = localStorage.getItem(STORAGE_KEYS.SHOPS);
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (storedShops) {
        shops = JSON.parse(storedShops);
    }

    if (storedCurrentUser) {
        currentUser = JSON.parse(storedCurrentUser);
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // ログインフォーム
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 新規登録フォーム
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 雀荘登録フォーム
    const shopForm = document.getElementById('shopRegistrationForm');
    if (shopForm) {
        shopForm.addEventListener('submit', handleShopRegistration);
    }
}

// ログイン状態をチェック
function checkLoginStatus() {
    if (currentUser) {
        showDashboard();
        displayUserInfo();
        displayShopList();
    } else {
        showLoginSection();
    }
}

// ログイン処理
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // ユーザー認証（簡易版）
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        showMessage('ログインに成功しました', 'success');
        showDashboard();
        displayUserInfo();
        displayShopList();
    } else {
        showMessage('メールアドレスまたはパスワードが正しくありません', 'error');
    }
}

// 新規登録処理
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;

    // パスワード確認
    if (password !== passwordConfirm) {
        showMessage('パスワードが一致しません', 'error');
        return;
    }

    // 既存ユーザーチェック
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        showMessage('このメールアドレスは既に登録されています', 'error');
        return;
    }

    // 新規ユーザー作成
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    showMessage('アカウントの登録が完了しました', 'success');
    showLogin();
}

// 雀荘登録処理
function handleShopRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
                           .map(checkbox => checkbox.value);

    const shopData = {
        id: Date.now().toString(),
        ownerId: currentUser.id,
        name: formData.get('shopName'),
        type: formData.get('shopType'),
        prefecture: formData.get('prefecture'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        tables: parseInt(formData.get('tables')),
        openTime: formData.get('openTime'),
        closeTime: formData.get('closeTime'),
        gameRates: formData.get('gameRates'),
        amenities: amenities,
        description: formData.get('description'),
        createdAt: new Date().toISOString()
    };

    shops.push(shopData);
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));

    showMessage('雀荘情報を登録しました', 'success');
    event.target.reset();
    displayShopList();
}

// 画面表示の切り替え
function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

function showLogin() {
    showLoginSection();
}

// ユーザー情報表示
function displayUserInfo() {
    if (currentUser) {
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
    }
}

// ログアウト処理
function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showMessage('ログアウトしました', 'success');
    showLoginSection();
    document.getElementById('userInfo').style.display = 'none';
}

// ナビゲーション
function showSection(sectionName) {
    // 全てのコンテンツセクションを非表示
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // 全てのナビボタンからactiveクラスを削除
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 指定されたセクションを表示
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
    }

    // 対応するナビボタンにactiveクラスを追加
    const targetBtn = event.target;
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    // 雀荘管理セクションの場合、雀荘一覧を更新
    if (sectionName === 'shop-management') {
        displayShopList();
    }
}

// 雀荘一覧表示
function displayShopList() {
    const shopList = document.getElementById('shopList');
    if (!shopList) return;

    // 現在のユーザーが登録した雀荘のみを表示
    const userShops = shops.filter(shop => shop.ownerId === currentUser.id);

    if (userShops.length === 0) {
        shopList.innerHTML = '<p class="no-shops">まだ雀荘が登録されていません。</p>';
        return;
    }

    const shopCards = userShops.map(shop => createShopCard(shop)).join('');
    shopList.innerHTML = shopCards;
}

// 雀荘カード作成
function createShopCard(shop) {
    const amenitiesList = shop.amenities.length > 0 
        ? shop.amenities.join(', ') 
        : 'なし';

    return `
        <div class="shop-card">
            <h3>${shop.name}</h3>
            <span class="shop-type">${shop.type}</span>
            <p><strong>所在地:</strong> ${shop.prefecture} ${shop.address}</p>
            <p><strong>電話番号:</strong> ${shop.phone}</p>
            <p><strong>卓数:</strong> ${shop.tables}卓</p>
            <p><strong>営業時間:</strong> ${shop.openTime} - ${shop.closeTime}</p>
            <p><strong>料金:</strong> ${shop.gameRates || '未設定'}</p>
            <p><strong>設備:</strong> ${amenitiesList}</p>
            <p><strong>特徴:</strong> ${shop.description || 'なし'}</p>
            <div class="shop-actions">
                <button class="edit-btn" onclick="editShop('${shop.id}')">編集</button>
                <button class="delete-btn" onclick="deleteShop('${shop.id}')">削除</button>
            </div>
        </div>
    `;
}

// 雀荘編集（簡易版）
function editShop(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;

    // 雀荘情報登録セクションに移動し、フォームに既存データを入力
    showSection('shop-registration');
    
    // フォームに既存データを設定
    document.getElementById('shopName').value = shop.name;
    document.getElementById('shopType').value = shop.type;
    document.getElementById('prefecture').value = shop.prefecture;
    document.getElementById('address').value = shop.address;
    document.getElementById('phone').value = shop.phone;
    document.getElementById('tables').value = shop.tables;
    document.getElementById('openTime').value = shop.openTime;
    document.getElementById('closeTime').value = shop.closeTime;
    document.getElementById('gameRates').value = shop.gameRates;
    document.getElementById('description').value = shop.description;

    // 設備のチェックボックスを設定
    shop.amenities.forEach(amenity => {
        const checkbox = document.querySelector(`input[name="amenities"][value="${amenity}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    showMessage('編集モードです。修正後、登録ボタンを押してください。', 'success');
    
    // 編集モードの場合、既存データを削除してから新しいデータを追加
    const shopForm = document.getElementById('shopRegistrationForm');
    shopForm.onsubmit = function(event) {
        event.preventDefault();
        deleteShop(shopId, false); // メッセージ表示なし
        handleShopRegistration(event);
        // フォームのsubmitイベントを元に戻す
        shopForm.onsubmit = handleShopRegistration;
    };
}

// 雀荘削除
function deleteShop(shopId, showConfirm = true) {
    if (showConfirm && !confirm('この雀荘を削除しますか？')) {
        return;
    }

    shops = shops.filter(shop => shop.id !== shopId);
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
    
    if (showConfirm) {
        showMessage('雀荘を削除しました', 'success');
    }
    displayShopList();
}

// メッセージ表示
function showMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // 新しいメッセージを作成
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // ページの先頭に挿入
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    // 3秒後にメッセージを削除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// 開発用のデモデータ追加（初回アクセス時）
function addDemoData() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.length === 0) {
        const demoUser = {
            id: 'demo1',
            name: 'デモ雀荘経営者',
            email: 'demo@example.com',
            password: 'demo123',
            createdAt: new Date().toISOString()
        };
        
        users.push(demoUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        console.log('デモアカウントを作成しました:');
        console.log('Email: demo@example.com');
        console.log('Password: demo123');
    }
}

// デモデータの追加（開発用）
addDemoData();
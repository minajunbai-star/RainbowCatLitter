/**
 * Plant 彩虹砂 2026 專案核心腳本 - main.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. 自動載入共用元件 (Nav, Footer, Lightbox)
    loadSharedComponents();

    // 2. 初始化全域功能 (透過事件代理處理動態載入的元件)
    initGlobalEvents();
});

/**
 * js/main.js 建議修正版
 */
async function loadSharedComponents() {
    const components = [
        { id: 'nav-placeholder', file: 'components/navbar.html' },
        { id: 'footer-placeholder', file: 'components/footer.html' },
        { id: 'lightbox-placeholder', file: 'components/lightbox.html' } // 確保有這一行
    ];

    for (const comp of components) {
        const container = document.getElementById(comp.id);
        if (container) {
            try {
                const response = await fetch(comp.file);
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    console.log(`Loaded: ${comp.file}`);
                }
            } catch (err) {
                console.error(`Error loading ${comp.file}:`, err);
            }
        }
    }
    // 載入後初始化頁尾導覽
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    if (typeof setupFooterNav === 'function') setupFooterNav(currentPage);
}
/**
 * 全域事件監聽 (透過事件代理避免元件動態載入後失效)
 */
function initGlobalEvents() {
    document.addEventListener('click', function(e) {
        // 1. 行動版選單切換
        const menuBtn = e.target.closest('#mobile-menu-button');
        if (menuBtn) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.toggle('hidden');
        }

        // 2. 點擊選單連結後自動關閉 (針對行動版)
        const menuLink = e.target.closest('#mobile-menu a');
        if (menuLink) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');
        }
    });

    // ESC 鍵關閉燈箱
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") closeLightbox();
    });
}

/**
 * 相簿燈箱功能
 */
let gallerySwiper;

window.openLightbox = function() {
    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;

    // 建議使用 flex 以符合樣式表中的置中設定
    lightbox.style.display = 'flex'; 
    document.body.style.overflow = 'hidden';

    if (!gallerySwiper) {
        gallerySwiper = new Swiper(".swiper-gallery", {
            loop: true,
            centeredSlides: true,
            keyboard: { enabled: true },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                type: "fraction",
            },
            mousewheel: true,
        });
    } else {
        gallerySwiper.update();
    }
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('photo-lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

/**
 * 設定頁尾導覽連結 (根據當前頁面切換按鈕文字與網址)
 */
function setupFooterNav(pageName) {
    const nav = document.getElementById('footer-navigation');
    const prev = document.getElementById('footer-prev');
    const next = document.getElementById('footer-next');

    if (!nav || !prev || !next) return;

    if (pageName === 'tech.html') {
        nav.classList.remove('hidden');
        prev.href = 'index.html';
        prev.querySelector('span').innerText = '返回首頁';
        next.href = 'market.html';
        next.querySelector('span').innerText = '下一頁：健康小知識';
    } else if (pageName === 'market.html') {
        nav.classList.remove('hidden');
        prev.href = 'tech.html';
        prev.querySelector('span').innerText = '返回核心技術';
        next.href = 'campaign.html';
        next.querySelector('span').innerText = '下一頁：活動流程';
    } else {
        // 其他頁面如果不需要這個導覽條，確保它是隱藏的
        nav.classList.add('hidden');
    }
}
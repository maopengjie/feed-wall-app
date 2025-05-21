<template>
    <div class="max-w-screen-sm mx-auto min-h-screen bg-gray-50" ref="scrollContainer" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <!-- 瀑布流两列布局 -->
        <div class="columns-2 gap-2 [column-fill:_balance] p-2">
            <FeedItem v-for="item in items" :key="item.id" :item="item" />
        </div>

        <!-- 加载状态提示 -->
        <div v-if="loading" class="text-center py-4 text-gray-500">加载中...</div>
        <div v-else-if="noMore" class="text-center py-4 text-gray-400">没有更多内容了</div>

        <!-- 下拉刷新指示 -->
        <div v-show="pulling" class="absolute top-0 left-0 right-0 text-center text-blue-600 font-semibold" style="transform: translateY(-50px);">
            下拉刷新中...
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import FeedItem from "@/components/FeedItem.vue";
import { fetchMockData } from "@/utils/fetchData";

const items = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const noMore = ref(false);
const type = ref("format1");

const scrollContainer = ref<HTMLElement | null>(null);

// 触摸事件变量（用于下拉刷新）
let startY = 0;
let moveY = 0;
const pulling = ref(false);
const pullThreshold = 60;

// 读取URL参数决定数据格式
function getUrlType() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("type");
    if (t === "format2") return "format2";
    return "format1";
}

// 请求数据
const loadMore = async () => {
    if (loading.value || noMore.value) return;
    loading.value = true;
    const newData = await fetchMockData(page.value, type.value);
    if (newData.length === 0) {
        noMore.value = true;
    } else {
        items.value.push(...newData);
        page.value++;
    }
    loading.value = false;
};

// 下拉刷新逻辑
const doRefresh = async () => {
    if (loading.value) return;
    pulling.value = true;
    page.value = 1;
    noMore.value = false;
    const newData = await fetchMockData(page.value, type.value);
    items.value = newData;
    page.value++;
    pulling.value = false;
};

// 滚动监听-用IntersectionObserver实现自动加载
let observer: IntersectionObserver | null = null;
const sentinel = ref<HTMLElement | null>(null);

const setupObserver = () => {
    if (!scrollContainer.value) return;
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
    };
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                loadMore();
            }
        });
    }, options);
    // 在列表尾部挂一个隐藏div作为触发目标
    if (sentinel.value) observer.observe(sentinel.value);
};

const cleanupObserver = () => {
    if (observer && sentinel.value) {
        observer.unobserve(sentinel.value);
    }
    observer = null;
};

// 触摸事件实现下拉刷新
const onTouchStart = (e: TouchEvent) => {
    if (window.scrollY !== 0) return; // 仅在顶部允许下拉刷新
    startY = e.touches[0].clientY;
    moveY = 0;
};
const onTouchMove = (e: TouchEvent) => {
    if (window.scrollY !== 0) return;
    moveY = e.touches[0].clientY - startY;
    if (moveY > 0) {
        e.preventDefault(); // 阻止页面滚动
    }
};
const onTouchEnd = (e: TouchEvent) => {
    if (moveY > pullThreshold) {
        doRefresh();
    }
    startY = 0;
    moveY = 0;
};

onMounted(async () => {
    type.value = getUrlType();
    await loadMore();
    setupObserver();
});

onUnmounted(() => {
    cleanupObserver();
});
</script>

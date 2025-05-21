<template>
    <div class="mb-4 break-inside-avoid rounded-xl bg-white p-2 shadow">
        <img v-if="item.type === 'image'" :src="item.src" class="w-full rounded" loading="lazy" alt="feed image" />
        <video v-else-if="item.type === 'video'" controls playsinline preload="metadata" class="w-full rounded" :src="item.src"></video>
        <p class="mt-2 text-sm text-gray-700 truncate">{{ item.title }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    item: {
        id: number;
        type: "image" | "video";
        src: string;
        title: string;
    };
}>();
</script>

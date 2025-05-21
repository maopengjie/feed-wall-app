// 格式1：图文混合，视频每5条出现一次
export function getMockDataFormat1(page: number) {
  const items = Array.from({ length: 10 }, (_, i) => {
    const id = (page - 1) * 10 + i + 1
    return {
      id,
      title: `格式1-标题 ${id}`,
      type: id % 5 === 0 ? 'video' : 'image',
      src:
        id % 5 === 0
          ? 'https://www.w3schools.com/html/mov_bbb.mp4'
          : `https://picsum.photos/id/${id + 30}/300/200`,
    }
  })
  return new Promise(resolve => setTimeout(() => resolve(items), 400))
}

// 格式2：只图文无视频，图片尺寸略有不同，标题风格不同
export function getMockDataFormat2(page: number) {
  const items = Array.from({ length: 10 }, (_, i) => {
    const id = (page - 1) * 10 + i + 1
    return {
      id,
      title: `格式2 | Item #${id}`,
      type: 'image',
      src: `https://picsum.photos/id/${id + 50}/320/180`,
    }
  })
  return new Promise(resolve => setTimeout(() => resolve(items), 400))
}

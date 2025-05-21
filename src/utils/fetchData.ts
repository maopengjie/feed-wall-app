import { getMockDataFormat1, getMockDataFormat2 } from '@/mock/data'

export async function fetchMockData(page: number, type: string) {
  // 根据type区分两种数据格式
  if (type === 'format2') {
    return await getMockDataFormat2(page)
  }
  return await getMockDataFormat1(page)
}

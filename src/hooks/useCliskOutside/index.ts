import {ref, Ref, onMounted, onUnmounted} from 'vue'

export const useClickOutside = (dom: Ref<HTMLElement | null>) => {
  // 当前点击是否在区域内
  let isClickOutside = ref<boolean>(false)
  let handleClick = (e: MouseEvent) => {
    if (dom.value) isClickOutside.value = dom.value.contains((e.target as HTMLElement)) ? true : false
    else return
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })

  return {
    isClickOutside
  }
}
import { ref, onMounted, onUnmounted } from 'vue'
export const useMosue = () => {
  let x = ref<number>(0)
  let y = ref<number>(0)
  let mosueMove = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    document.addEventListener('mousemove', mosueMove)
  })
  onUnmounted(() => {
    document.removeEventListener('mousemove', mosueMove)
  })

  return {
    x,
    y
  }
}
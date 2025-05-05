<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'

defineProps<{
  color?: 'default' | 'alternative' | 'dark' | 'light' | 'green' | 'red' | 'yellow' | 'purple'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  pill?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <FwbButton v-bind="$attrs">
    <slot></slot>
  </FwbButton>
</template>